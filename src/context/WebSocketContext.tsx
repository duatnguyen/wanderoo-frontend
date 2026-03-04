// src/context/WebSocketContext.tsx - WebSocket context provider
import React, { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import websocketClient, { WebSocketState, type MessageHandler } from '../api/websocketClient';

interface WebSocketContextType {
  state: WebSocketState;
  isConnected: boolean;
  connect: (token?: string) => Promise<void>;
  disconnect: () => void;
  send: (destination: string, body: any, headers?: Record<string, string>) => void;
  subscribe: <T = any>(destination: string, callback: MessageHandler<T>) => () => void;
  subscribeToUser: <T = any>(username: string, destination: string, callback: MessageHandler<T>) => () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
  children: ReactNode;
  /**
   * Auto connect on mount
   */
  autoConnect?: boolean;
}

/**
 * WebSocket context provider
 * Provides WebSocket connection and messaging functionality to the entire app
 */
export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ 
  children, 
  autoConnect = false 
}) => {
  const [state, setState] = useState<WebSocketState>(websocketClient.getState());
  const [isConnected, setIsConnected] = useState(websocketClient.isConnected());

  // Update state when WebSocket state changes
  useEffect(() => {
    const unsubscribe = websocketClient.onStateChange((newState) => {
      setState(newState);
      setIsConnected(newState === WebSocketState.CONNECTED);
    });

    return unsubscribe;
  }, []);

  // Auto connect on mount if enabled
  useEffect(() => {
    if (autoConnect) {
      const token = localStorage.getItem('accessToken') || undefined;
      websocketClient.connect(token).catch((error) => {
        console.error('[WebSocketProvider] Connection error:', error);
      });
    }

    return () => {
      // Cleanup on unmount
      if (autoConnect) {
        websocketClient.disconnect();
      }
    };
  }, [autoConnect]);

  // Connect function
  const connect = useCallback((token?: string) => {
    return websocketClient.connect(token || localStorage.getItem('accessToken') || undefined);
  }, []);

  // Disconnect function
  const disconnect = useCallback(() => {
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

  const value: WebSocketContextType = {
    state,
    isConnected,
    connect,
    disconnect,
    send,
    subscribe,
    subscribeToUser,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

/**
 * Hook to use WebSocket context
 * @throws Error if used outside WebSocketProvider
 */
export const useWebSocketContext = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
};

export default WebSocketContext;

