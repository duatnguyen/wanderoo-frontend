// src/api/websocketClient.ts - WebSocket client using STOMP over SockJS
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// Type definitions for @stomp/stompjs
// In @stomp/stompjs v7, IMessage and StompSubscription are not directly exported
// We'll define them based on the actual Client API
type StompMessage = {
  body: string;
  headers: Record<string, string>;
  command: string;
  ack?: () => void;
  nack?: () => void;
};

type StompSubscription = {
  id: string;
  unsubscribe: () => void;
};

// Base WebSocket URL
const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL ||
  (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080');

// WebSocket connection state
export const WebSocketState = {
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  DISCONNECTED: 'DISCONNECTED',
  ERROR: 'ERROR',
} as const;

export type WebSocketState = typeof WebSocketState[keyof typeof WebSocketState];

// WebSocket message handler type
export type MessageHandler<T = any> = (message: T) => void;

// WebSocket error handler type
export type ErrorHandler = (error: Error | Event) => void;

/**
 * WebSocket client wrapper for STOMP over SockJS
 */
class WebSocketClient {
  private client: Client | null = null;
  private subscriptions: Map<string, StompSubscription> = new Map();
  private state: WebSocketState = WebSocketState.DISCONNECTED;
  private stateListeners: Set<(state: WebSocketState) => void> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000; // 3 seconds

  /**
   * Get current connection state
   */
  getState(): WebSocketState {
    return this.state;
  }

  /**
   * Subscribe to state changes
   */
  onStateChange(listener: (state: WebSocketState) => void): () => void {
    this.stateListeners.add(listener);
    return () => {
      this.stateListeners.delete(listener);
    };
  }

  /**
   * Update state and notify listeners
   */
  private setState(newState: WebSocketState) {
    if (this.state !== newState) {
      this.state = newState;
      this.stateListeners.forEach((listener) => listener(newState));
    }
  }

  /**
   * Connect to WebSocket server
   */
  connect(token?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.client?.connected) {
        resolve();
        return;
      }

      // Disconnect existing client if any
      this.disconnect();

      // Create SockJS connection
      const socket = new SockJS(`${WS_BASE_URL}/ws`);

      // Create STOMP client
      this.client = new Client({
        webSocketFactory: () => socket,
        debug: (str) => {
          if (import.meta.env.DEV) {
            console.log('[STOMP]', str);
          }
        },
        reconnectDelay: this.reconnectDelay,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          console.log('[WebSocket] Connected');
          this.setState(WebSocketState.CONNECTED);
          this.reconnectAttempts = 0;
          resolve();
        },
        onStompError: (frame) => {
          console.error('[WebSocket] STOMP error:', frame);
          this.setState(WebSocketState.ERROR);
          reject(new Error(frame.headers['message'] || 'STOMP connection error'));
        },
        onWebSocketClose: () => {
          console.log('[WebSocket] Connection closed');
          this.setState(WebSocketState.DISCONNECTED);
          this.attemptReconnect();
        },
        onWebSocketError: (event) => {
          console.error('[WebSocket] WebSocket error:', event);
          this.setState(WebSocketState.ERROR);
          reject(new Error('WebSocket connection error'));
        },
      });

      // Add authentication headers if token is provided
      if (token) {
        this.client.configure({
          connectHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      // Set connecting state
      this.setState(WebSocketState.CONNECTING);

      // Activate client
      this.client.activate();
    });
  }

  /**
   * Attempt to reconnect to WebSocket server
   */
  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[WebSocket] Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * this.reconnectAttempts;

    console.log(`[WebSocket] Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms...`);

    setTimeout(() => {
      const token = localStorage.getItem('accessToken') || undefined;
      this.connect(token).catch((error) => {
        console.error('[WebSocket] Reconnect failed:', error);
      });
    }, delay);
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect() {
    if (this.client) {
      // Unsubscribe from all subscriptions
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
      this.subscriptions.clear();

      // Deactivate client
      if (this.client.connected) {
        this.client.deactivate();
      }
      this.client = null;
    }
    this.setState(WebSocketState.DISCONNECTED);
    this.reconnectAttempts = 0;
  }

  /**
   * Check if client is connected
   */
  isConnected(): boolean {
    return this.client?.connected ?? false;
  }

  /**
   * Subscribe to a topic
   */
  subscribe<T = any>(
    destination: string,
    callback: MessageHandler<T>
  ): () => void {
    if (!this.client?.connected) {
      throw new Error('WebSocket is not connected');
    }

    // Unsubscribe if already subscribed
    if (this.subscriptions.has(destination)) {
      this.subscriptions.get(destination)?.unsubscribe();
    }

    const subscription = this.client.subscribe(destination, (message: StompMessage) => {
      try {
        const body = message.body ? JSON.parse(message.body) : null;
        callback(body);
      } catch (error) {
        console.error('[WebSocket] Error parsing message:', error);
        callback(message.body as T);
      }
    });

    this.subscriptions.set(destination, subscription);

    // Return unsubscribe function
    return () => {
      subscription.unsubscribe();
      this.subscriptions.delete(destination);
    };
  }

  /**
   * Send message to a destination
   */
  send(destination: string, body: any, headers?: Record<string, string>): void {
    if (!this.client?.connected) {
      throw new Error('WebSocket is not connected');
    }

    this.client.publish({
      destination,
      body: JSON.stringify(body),
      headers,
    });
  }

  /**
   * Subscribe to user-specific destination
   */
  subscribeToUser<T = any>(
    username: string,
    destination: string,
    callback: MessageHandler<T>
  ): () => void {
    return this.subscribe(`/user/${username}${destination}`, callback);
  }
}

// Create singleton instance
const websocketClient = new WebSocketClient();

export default websocketClient;

