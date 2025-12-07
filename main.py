# main.py
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict
import json
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Checkmark Collaboration API")

# CORS configuration - allow Next.js dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store active connections per workspace
# Format: {workspace_id: {user_id: websocket}}
connections: Dict[str, Dict[str, WebSocket]] = {}


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, Dict[str, WebSocket]] = {}

    async def connect(self, websocket: WebSocket, workspace_id: str, user_id: str):
        """Accept and store a new WebSocket connection"""
        await websocket.accept()
        
        if workspace_id not in self.active_connections:
            self.active_connections[workspace_id] = {}
        
        self.active_connections[workspace_id][user_id] = websocket
        logger.info(f"User {user_id} connected to workspace {workspace_id}")
        logger.info(f"Total connections in workspace: {len(self.active_connections[workspace_id])}")

    def disconnect(self, workspace_id: str, user_id: str):
        """Remove a WebSocket connection"""
        if workspace_id in self.active_connections:
            if user_id in self.active_connections[workspace_id]:
                del self.active_connections[workspace_id][user_id]
                logger.info(f"User {user_id} disconnected from workspace {workspace_id}")
                
                # Clean up empty workspaces
                if not self.active_connections[workspace_id]:
                    del self.active_connections[workspace_id]
                    logger.info(f"Workspace {workspace_id} is now empty")

    async def broadcast(self, workspace_id: str, message: dict, exclude_user: str = None):
        """Send message to all users in a workspace except the sender"""
        if workspace_id not in self.active_connections:
            return

        dead_connections = []
        
        for user_id, websocket in self.active_connections[workspace_id].items():
            if user_id == exclude_user:
                continue
                
            try:
                await websocket.send_json(message)
            except Exception as e:
                logger.error(f"Error sending to {user_id}: {e}")
                dead_connections.append(user_id)
        
        # Clean up dead connections
        for user_id in dead_connections:
            self.disconnect(workspace_id, user_id)

    async def send_personal(self, workspace_id: str, user_id: str, message: dict):
        """Send message to a specific user"""
        if workspace_id in self.active_connections:
            if user_id in self.active_connections[workspace_id]:
                try:
                    await self.active_connections[workspace_id][user_id].send_json(message)
                except Exception as e:
                    logger.error(f"Error sending personal message to {user_id}: {e}")
                    self.disconnect(workspace_id, user_id)


manager = ConnectionManager()


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "service": "Checkmark Collaboration API",
        "timestamp": datetime.now().isoformat()
    }


@app.get("/workspaces/{workspace_id}/stats")
async def workspace_stats(workspace_id: str):
    """Get current stats for a workspace"""
    if workspace_id in manager.active_connections:
        users = list(manager.active_connections[workspace_id].keys())
        return {
            "workspace_id": workspace_id,
            "connected_users": len(users),
            "user_ids": users
        }
    return {
        "workspace_id": workspace_id,
        "connected_users": 0,
        "user_ids": []
    }


@app.websocket("/ws/{workspace_id}")
async def websocket_endpoint(websocket: WebSocket, workspace_id: str, userId: str):
    """
    WebSocket endpoint for real-time collaboration
    
    Query params:
    - userId: User identifier
    
    Message format:
    {
        "type": "presence_join" | "presence_leave" | "cursor_move" | "chart_update",
        "payload": { ... },
        "userId": "user-id",
        "workspaceId": "workspace-id",
        "timestamp": 1234567890
    }
    """
    await manager.connect(websocket, workspace_id, userId)
    
    try:
        # Send welcome message
        await websocket.send_json({
            "type": "connection_established",
            "payload": {
                "userId": userId,
                "workspaceId": workspace_id,
                "message": "Connected successfully"
            },
            "userId": "system",
            "workspaceId": workspace_id,
            "timestamp": int(datetime.now().timestamp() * 1000)
        })
        
        # Listen for messages
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            logger.info(f"Received {message.get('type')} from {userId} in {workspace_id}")
            
            # Broadcast to other users in the workspace
            await manager.broadcast(
                workspace_id=workspace_id,
                message=message,
                exclude_user=userId
            )
            
    except WebSocketDisconnect:
        manager.disconnect(workspace_id, userId)
        
        # Notify others that user left
        await manager.broadcast(
            workspace_id=workspace_id,
            message={
                "type": "presence_leave",
                "payload": {"userId": userId},
                "userId": userId,
                "workspaceId": workspace_id,
                "timestamp": int(datetime.now().timestamp() * 1000)
            }
        )
    except Exception as e:
        logger.error(f"WebSocket error for {userId} in {workspace_id}: {e}")
        manager.disconnect(workspace_id, userId)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        # reload=True,  # Auto-reload on code changes
        log_level="info"
    )