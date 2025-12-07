// lib/websocket/use-websocket.ts
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { WebSocketMessage } from '@/types/websocket';

interface UseWebSocketOptions {
  workspaceId: string;
  userId: string;
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export function useWebSocket({
  workspaceId,
  userId,
  onMessage,
  onConnect,
  onDisconnect,
}: UseWebSocketOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  // Store callbacks in refs to avoid stale closures
  const onMessageRef = useRef(onMessage);
  const onConnectRef = useRef(onConnect);
  const onDisconnectRef = useRef(onDisconnect);

  useEffect(() => {
    onMessageRef.current = onMessage;
    onConnectRef.current = onConnect;
    onDisconnectRef.current = onDisconnect;
  }, [onMessage, onConnect, onDisconnect]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    const attemptConnect = () => {
      try {
        const wsUrl = `ws://localhost:8000/ws/${workspaceId}?userId=${userId}`;
        
        console.log('Attempting WebSocket connection to:', wsUrl);
        
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          console.log('WebSocket connected');
          setIsConnected(true);
          setConnectionError(null);
          reconnectAttemptsRef.current = 0;
          onConnectRef.current?.();
        };

        ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            onMessageRef.current?.(message);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setConnectionError('Connection failed');
        };

        ws.onclose = () => {
          console.log('WebSocket disconnected');
          setIsConnected(false);
          onDisconnectRef.current?.();

          if (reconnectAttemptsRef.current < maxReconnectAttempts) {
            reconnectAttemptsRef.current++;
            const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000);
            console.log(`Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current})`);
            
            reconnectTimeoutRef.current = setTimeout(() => {
              attemptConnect(); // Call the inner function recursively
            }, delay);
          } else {
            setConnectionError('Maximum reconnection attempts reached');
          }
        };

        wsRef.current = ws;
      } catch (error) {
        console.error('Failed to create WebSocket:', error);
        setConnectionError('Failed to connect');
      }
    };

    attemptConnect();
  }, [workspaceId, userId]);

  const sendMessage = useCallback((message: Omit<WebSocketMessage, 'timestamp'>) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const fullMessage: WebSocketMessage = {
        ...message,
        timestamp: Date.now(),
      } as WebSocketMessage;
      wsRef.current.send(JSON.stringify(fullMessage));
    } else {
      console.warn('WebSocket is not connected. Message not sent:', message);
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    connectionError,
    sendMessage,
    reconnect: connect,
  };
}