from fastapi import FastAPI, UploadFile, File, BackgroundTasks, HTTPException
from fastapi.responses import FileResponse
from kafka import KafkaProducer, KafkaConsumer
import json
import os
import uuid
import hashlib
import time

app = FastAPI(title="Kafka File Streaming Service")

KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9093")
FILE_CHUNK_TOPIC = "file-chunks"
FILE_METADATA_TOPIC = "file-metadata"
CHUNK_SIZE = 1024 * 1024  # 1MB chunks
UPLOAD_DIR = "uploads"
DOWNLOAD_DIR = "downloads"

# Ensure directories exist
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

# Store for tracking file transfers
file_transfers = {}


def get_producer():
    """Create Kafka producer with proper configuration"""
    return KafkaProducer(
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
        value_serializer=lambda v: json.dumps(v).encode('utf-8'),
        max_request_size=10485760,  # 10MB
        compression_type='gzip'
    )


def get_consumer(topic: str, group_id: str):
    """Create Kafka consumer"""
    return KafkaConsumer(
        topic,
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
        value_deserializer=lambda m: json.loads(m.decode('utf-8')),
        group_id=group_id,
        auto_offset_reset='earliest',
        enable_auto_commit=True
    )


def calculate_md5(file_path: str) -> str:
    """Calculate MD5 hash of a file"""
    hash_md5 = hashlib.md5()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()


async def stream_file_to_kafka(file_path: str, file_id: str, original_filename: str):
    """Stream file chunks to Kafka"""
    producer = get_producer()
    
    try:
        file_size = os.path.getsize(file_path)
        total_chunks = (file_size // CHUNK_SIZE) + (1 if file_size % CHUNK_SIZE else 0)
        
        # Send metadata
        metadata = {
            "file_id": file_id,
            "original_filename": original_filename,
            "file_size": file_size,
            "total_chunks": total_chunks,
            "chunk_size": CHUNK_SIZE,
            "md5_hash": calculate_md5(file_path),
            "timestamp": time.time()
        }
        
        producer.send(FILE_METADATA_TOPIC, metadata)
        
        # Update tracking
        file_transfers[file_id] = {
            "status": "uploading",
            "total_chunks": total_chunks,
            "uploaded_chunks": 0,
            "metadata": metadata
        }
        
        # Stream file chunks
        with open(file_path, 'rb') as f:
            chunk_num = 0
            while True:
                chunk_data = f.read(CHUNK_SIZE)
                if not chunk_data:
                    break
                
                chunk_message = {
                    "file_id": file_id,
                    "chunk_number": chunk_num,
                    "total_chunks": total_chunks,
                    "data": chunk_data.hex(),  # Convert bytes to hex string
                    "size": len(chunk_data)
                }
                
                future = producer.send(FILE_CHUNK_TOPIC, chunk_message)
                future.get(timeout=10)  # Wait for confirmation
                
                chunk_num += 1
                file_transfers[file_id]["uploaded_chunks"] = chunk_num
                
                # Simulate some processing time
                time.sleep(0.01)
        
        producer.flush()
        file_transfers[file_id]["status"] = "completed"
        
    except Exception as e:
        file_transfers[file_id]["status"] = "failed"
        file_transfers[file_id]["error"] = str(e)
        raise
    finally:
        producer.close()


@app.get("/")
async def root():
    return {
        "service": "Kafka File Streaming Service",
        "endpoints": {
            "upload": "POST /upload",
            "download": "GET /download/{file_id}",
            "status": "GET /status/{file_id}",
            "list": "GET /files"
        }
    }


@app.post("/upload")
async def upload_file(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    """Upload a large file and stream it to Kafka"""
    
    # Generate unique file ID
    file_id = str(uuid.uuid4())
    upload_path = os.path.join(UPLOAD_DIR, f"{file_id}_{file.filename}")
    
    try:
        # Save uploaded file temporarily
        with open(upload_path, 'wb') as f:
            while chunk := await file.read(1024 * 1024):  # Read in 1MB chunks
                f.write(chunk)
        
        # Stream to Kafka in background
        background_tasks.add_task(
            stream_file_to_kafka,
            upload_path,
            file_id,
            file.filename
        )
        
        return {
            "file_id": file_id,
            "filename": file.filename,
            "message": "File upload initiated. Streaming to Kafka...",
            "status_url": f"/status/{file_id}"
        }
        
    except Exception as e:
        if os.path.exists(upload_path):
            os.remove(upload_path)
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/status/{file_id}")
async def get_upload_status(file_id: str):
    """Check the status of a file transfer"""
    
    if file_id not in file_transfers:
        raise HTTPException(status_code=404, detail="File transfer not found")
    
    transfer_info = file_transfers[file_id]
    
    progress = 0
    if transfer_info["total_chunks"] > 0:
        progress = (transfer_info["uploaded_chunks"] / transfer_info["total_chunks"]) * 100
    
    return {
        "file_id": file_id,
        "status": transfer_info["status"],
        "progress": f"{progress:.2f}%",
        "uploaded_chunks": transfer_info["uploaded_chunks"],
        "total_chunks": transfer_info["total_chunks"],
        "metadata": transfer_info.get("metadata", {})
    }


@app.get("/consume/{file_id}")
async def consume_file(file_id: str, background_tasks: BackgroundTasks):
    """Consume file chunks from Kafka and reconstruct the file"""
    
    def reconstruct_file():
        consumer = get_consumer(FILE_CHUNK_TOPIC, f"file-consumer-{file_id}")
        metadata_consumer = get_consumer(FILE_METADATA_TOPIC, f"metadata-consumer-{file_id}")
        
        try:
            # Get metadata
            metadata = None
            for message in metadata_consumer:
                meta = message.value
                if meta["file_id"] == file_id:
                    metadata = meta
                    break
            
            if not metadata:
                return
            
            # Reconstruct file from chunks
            output_path = os.path.join(DOWNLOAD_DIR, f"{file_id}_{metadata['original_filename']}")
            chunks_received = {}
            
            for message in consumer:
                chunk = message.value
                
                if chunk["file_id"] == file_id:
                    chunks_received[chunk["chunk_number"]] = bytes.fromhex(chunk["data"])
                    
                    # Check if we have all chunks
                    if len(chunks_received) == metadata["total_chunks"]:
                        # Write file in order
                        with open(output_path, 'wb') as f:
                            for i in range(metadata["total_chunks"]):
                                f.write(chunks_received[i])
                        
                        # Verify integrity
                        reconstructed_hash = calculate_md5(output_path)
                        if reconstructed_hash == metadata["md5_hash"]:
                            file_transfers[file_id]["download_status"] = "completed"
                            file_transfers[file_id]["download_path"] = output_path
                        else:
                            file_transfers[file_id]["download_status"] = "failed"
                            file_transfers[file_id]["error"] = "MD5 hash mismatch"
                        break
                        
        finally:
            consumer.close()
            metadata_consumer.close()
    
    background_tasks.add_task(reconstruct_file)
    
    return {
        "message": "File reconstruction started",
        "file_id": file_id
    }


@app.get("/download/{file_id}")
async def download_file(file_id: str):
    """Download the reconstructed file"""
    
    if file_id not in file_transfers:
        raise HTTPException(status_code=404, detail="File not found")
    
    transfer = file_transfers[file_id]
    
    if "download_path" not in transfer:
        raise HTTPException(status_code=404, detail="File not yet reconstructed. Try /consume/{file_id} first")
    
    if not os.path.exists(transfer["download_path"]):
        raise HTTPException(status_code=404, detail="File not found on disk")
    
    return FileResponse(
        transfer["download_path"],
        filename=transfer["metadata"]["original_filename"]
    )


@app.get("/files")
async def list_files():
    """List all tracked file transfers"""
    return {
        "files": [
            {
                "file_id": fid,
                "status": info["status"],
                "filename": info.get("metadata", {}).get("original_filename", "unknown"),
                "progress": f"{(info['uploaded_chunks'] / info['total_chunks'] * 100):.2f}%" if info["total_chunks"] > 0 else "0%"
            }
            for fid, info in file_transfers.items()
        ]
    }


@app.delete("/files/{file_id}")
async def delete_file(file_id: str):
    """Delete a file and its tracking data"""
    
    if file_id not in file_transfers:
        raise HTTPException(status_code=404, detail="File not found")
    
    # Clean up files
    upload_pattern = os.path.join(UPLOAD_DIR, f"{file_id}_*")
    download_pattern = os.path.join(DOWNLOAD_DIR, f"{file_id}_*")
    
    import glob
    for pattern in [upload_pattern, download_pattern]:
        for filepath in glob.glob(pattern):
            if os.path.exists(filepath):
                os.remove(filepath)
    
    # Remove tracking
    del file_transfers[file_id]
    
    return {"message": "File deleted successfully"}