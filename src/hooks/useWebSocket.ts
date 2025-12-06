// src/hooks/useWebSocket.ts - React hook for WebSocket connections
import { useEffect, useRef, useState, useCallback } from 'react';
import websocketClient, { WebSocketState, type MessageHandler } from '../api/websocketClient';

interface UseWebSocketOptions {
  /**
   * Auto connect on mount
   */
  autoConnect?: boolean;
  
  /**
   * Topics to subscribe to
   */
  topics?: string[];
  
  /**
   * Message handler for subscribed topics
   */
  onMessage?: MessageHandler;
  
  /**
   * Error handler
   */
  onError?: (error: Error | Event) => void;
  
  /**
   * Connection state change handler
   */
  onStateChange?: (state: WebSocketState) => void;
}

/**
 * React hook for WebSocket connections
 * 
 * @example
 * ```tsx
 * const { connect, disconnect, send, subscribe, state, isConnected } = useWebSocket({
 *   autoConnect: true,
 *   topics: ['/topic/orders'],
 *   onMessage: (message) => {
 *     console.log('Received:', message);
 *   },
 * });
 * ```
 */
export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const {
    autoConnect = false,
    topics = [],
    onMessage,
    onError,
    onStateChange,
  } = options;

  const [state, setState] = useState<WebSocketState>(websocketClient.getState());
  const [isConnected, setIsConnected] = useState(websocketClient.isConnected());
  const subscriptionsRef = useRef<Map<string, () => void>>(new Map());

  // Update state when WebSocket state changes
  useEffect(() => {
    const unsubscribe = websocketClient.onStateChange((newState) => {
      setState(newState);
      setIsConnected(newState === WebSocketState.CONNECTED);
      onStateChange?.(newState);
    });

    return unsubscribe;
  }, [onStateChange]);

  // Auto connect on mount if enabled
  useEffect(() => {
    if (autoConnect) {
      const token = localStorage.getItem('accessToken') || undefined;
      websocketClient.connect(token).catch((error) => {
        console.error('[useWebSocket] Connection error:', error);
        onError?.(error);
      });
    }

    return () => {
      // Cleanup: unsubscribe from all topics
      subscriptionsRef.current.forEach((unsubscribe) => unsubscribe());
      subscriptionsRef.current.clear();
    };
  }, [autoConnect, onError]);

  // Subscribe to topics with improved performance and deduplication
  useEffect(() => {
    if (!isConnected || topics.length === 0) {
      return;
    }

    // Create a message handler with throttling to prevent overload
    const throttledMessageHandler = (() => {
      let lastProcessTime = 0;
      const throttleMs = 100; // 100ms throttle
      let pendingMessage: any = null;
      let timeoutId: NodeJS.Timeout | null = null;

      return (message: any) => {
        const currentTime = Date.now();
        pendingMessage = message;

        // If enough time has passed, process immediately
        if (currentTime - lastProcessTime >= throttleMs) {
          lastProcessTime = currentTime;
          onMessage?.(message);
          pendingMessage = null;
        } else {
          // Otherwise, debounce to process the latest message
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          timeoutId = setTimeout(() => {
            if (pendingMessage) {
              lastProcessTime = Date.now();
              onMessage?.(pendingMessage);
              pendingMessage = null;
            }
            timeoutId = null;
          }, throttleMs - (currentTime - lastProcessTime));
        }
      };
    })();

    // Subscribe to new topics only
    const newSubscriptions = new Map<string, () => void>();
    
    topics.forEach((topic) => {
      if (subscriptionsRef.current.has(topic)) {
        return; // Already subscribed
      }

      try {
        const unsubscribe = websocketClient.subscribe(topic, throttledMessageHandler);
        subscriptionsRef.current.set(topic, unsubscribe);
        newSubscriptions.set(topic, unsubscribe);
        console.log(`[useWebSocket] Subscribed to topic: ${topic}`);
      } catch (error) {
        console.error(`[useWebSocket] Error subscribing to ${topic}:`, error);
        onError?.(error as Error);
      }
    });

    // Cleanup function only for new subscriptions
    return () => {
      newSubscriptions.forEach((unsubscribe, topic) => {
        unsubscribe();
        subscriptionsRef.current.delete(topic);
        console.log(`[useWebSocket] Unsubscribed from topic: ${topic}`);
      });
    };
  }, [isConnected, topics, onMessage, onError]);

  // Connect function
  const connect = useCallback((token?: string) => {
    return websocketClient.connect(token || localStorage.getItem('accessToken') || undefined);
  }, []);

  // Disconnect function
  const disconnect = useCallback(() => {
    subscriptionsRef.current.forEach((unsubscribe) => unsubscribe());
    subscriptionsRef.current.clear();
    websocketClient.disconnect();
  }, []);

  // Send message function
  const send = useCallback((destination: string, body: any, headers?: Record<string, string>) => {
    if (!isConnected) {
      throw new Error('WebSocket is not connected');
    }
    websocketClient.send(destination, body, headers);
  }, [isConnected]);

  // Subscribe function
  const subscribe = useCallback(<T = any>(
    destination: string,
    callback: MessageHandler<T>
  ) => {
    if (!isConnected) {
      throw new Error('WebSocket is not connected');
    }
    return websocketClient.subscribe(destination, callback);
  }, [isConnected]);

  // Subscribe to user-specific destination
  const subscribeToUser = useCallback(<T = any>(
    username: string,
    destination: string,
    callback: MessageHandler<T>
  ) => {
    if (!isConnected) {
      throw new Error('WebSocket is not connected');
    }
    return websocketClient.subscribeToUser(username, destination, callback);
  }, [isConnected]);

  return {
    state,
    isConnected,
    connect,
    disconnect,
    send,
    subscribe,
    subscribeToUser,
  };
};

export default useWebSocket;

