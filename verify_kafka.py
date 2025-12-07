#!/usr/bin/env python3
"""
Verify Apache Kafka setup is working correctly
"""

import time
from kafka import KafkaProducer, KafkaConsumer, KafkaAdminClient
from kafka.admin import NewTopic
from kafka.errors import KafkaError
import json

BOOTSTRAP_SERVERS = 'localhost:9093'

def check_connection():
    """Check if we can connect to Kafka"""
    print("🔍 Checking Kafka connection...")
    try:
        admin = KafkaAdminClient(
            bootstrap_servers=BOOTSTRAP_SERVERS,
            request_timeout_ms=5000
        )
        print("✅ Successfully connected to Kafka!")
        admin.close()
        return True
    except Exception as e:
        print(f"❌ Failed to connect: {e}")
        return False

def list_topics():
    """List all topics"""
    print("\n📋 Listing topics...")
    try:
        admin = KafkaAdminClient(bootstrap_servers=BOOTSTRAP_SERVERS)
        topics = admin.list_topics()
        if topics:
            print(f"✅ Found {len(topics)} topics:")
            for topic in topics:
                print(f"   - {topic}")
        else:
            print("ℹ️  No topics found (will be auto-created on first use)")
        admin.close()
        return True
    except Exception as e:
        print(f"❌ Failed to list topics: {e}")
        return False

def test_producer():
    """Test producing a message"""
    print("\n📤 Testing producer...")
    try:
        producer = KafkaProducer(
            bootstrap_servers=BOOTSTRAP_SERVERS,
            value_serializer=lambda v: json.dumps(v).encode('utf-8'),
            request_timeout_ms=5000
        )
        
        test_message = {
            "test": "Hello from Apache Kafka!",
            "timestamp": time.time()
        }
        
        future = producer.send('test-topic', test_message)
        result = future.get(timeout=10)
        
        print(f"✅ Message sent successfully!")
        print(f"   Topic: {result.topic}")
        print(f"   Partition: {result.partition}")
        print(f"   Offset: {result.offset}")
        
        producer.flush()
        producer.close()
        return True
        
    except Exception as e:
        print(f"❌ Failed to produce message: {e}")
        return False

def test_consumer():
    """Test consuming a message"""
    print("\n📥 Testing consumer...")
    try:
        consumer = KafkaConsumer(
            'test-topic',
            bootstrap_servers=BOOTSTRAP_SERVERS,
            value_deserializer=lambda m: json.loads(m.decode('utf-8')),
            auto_offset_reset='earliest',
            consumer_timeout_ms=5000,
            group_id='test-group'
        )
        
        messages = []
        for message in consumer:
            messages.append(message.value)
            if len(messages) >= 1:  # Just get one message
                break
        
        if messages:
            print(f"✅ Message received successfully!")
            print(f"   Content: {messages[0]}")
        else:
            print("⚠️  No messages to consume (this is OK if you just started)")
        
        consumer.close()
        return True
        
    except Exception as e:
        print(f"❌ Failed to consume message: {e}")
        return False

def check_kafka_version():
    """Check Kafka version info"""
    print("\n📊 Checking Kafka cluster info...")
    try:
        admin = KafkaAdminClient(bootstrap_servers=BOOTSTRAP_SERVERS)
        cluster_metadata = admin._client.cluster
        
        print(f"✅ Cluster ID: {cluster_metadata.cluster_id()}")
        print(f"   Brokers: {len(cluster_metadata.brokers())}")
        
        for broker in cluster_metadata.brokers():
            print(f"   - Broker {broker.nodeId}: {broker.host}:{broker.port}")
        
        admin.close()
        return True
    except Exception as e:
        print(f"❌ Failed to get cluster info: {e}")
        return False

def main():
    print("=" * 60)
    print("🚀 Apache Kafka Setup Verification")
    print("=" * 60)
    
    results = []
    
    # Run checks
    results.append(("Connection", check_connection()))
    time.sleep(1)
    
    results.append(("Cluster Info", check_kafka_version()))
    time.sleep(1)
    
    results.append(("List Topics", list_topics()))
    time.sleep(1)
    
    results.append(("Producer", test_producer()))
    time.sleep(2)
    
    results.append(("Consumer", test_consumer()))
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 VERIFICATION SUMMARY")
    print("=" * 60)
    
    for test_name, passed in results:
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{test_name:20s}: {status}")
    
    all_passed = all(result[1] for result in results)
    
    print("\n" + "=" * 60)
    if all_passed:
        print("🎉 All checks passed! Apache Kafka is ready to use.")
        print("\nYou can now:")
        print("  1. Start the FastAPI app: docker-compose up fastapi-app")
        print("  2. Access API docs: http://localhost:8000/docs")
        print("  3. Upload files via the API")
    else:
        print("⚠️  Some checks failed. Please review the errors above.")
        print("\nCommon fixes:")
        print("  1. Ensure Kafka is running: docker-compose ps")
        print("  2. Wait 30s after starting: docker-compose logs kafka")
        print("  3. Check ports aren't in use: lsof -i :9092")
    print("=" * 60)

if __name__ == "__main__":
    main()