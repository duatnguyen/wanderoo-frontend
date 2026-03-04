// src/api/websocketExample.ts - Example usage of WebSocket client
/**
 * This file contains examples of how to use the WebSocket client
 * 
 * Example 1: Using the hook in a component
 * ```tsx
 * import { useWebSocket } from '@/hooks/useWebSocket';
 * 
 * function OrderNotifications() {
 *   const { isConnected, subscribe, state } = useWebSocket({
 *     autoConnect: true,
 *     topics: ['/topic/orders'],
 *     onMessage: (message) => {
 *       console.log('New order:', message);
 *     },
 *   });
 * 
 *   return (
 *     <div>
 *       Status: {state}
 *       {isConnected ? 'Connected' : 'Disconnected'}
 *     </div>
 *   );
 * }
 * ```
 * 
 * Example 2: Using the context
 * ```tsx
 * import { useWebSocketContext } from '@/context/WebSocketContext';
 * 
 * function OrderComponent() {
 *   const { send, subscribe, isConnected } = useWebSocketContext();
 * 
 *   useEffect(() => {
 *     if (isConnected) {
 *       const unsubscribe = subscribe('/topic/orders', (message) => {
 *         console.log('Order update:', message);
 *       });
 *       return unsubscribe;
 *     }
 *   }, [isConnected, subscribe]);
 * 
 *   const handleSendMessage = () => {
 *     send('/app/orders/update', { orderId: 123, status: 'SHIPPING' });
 *   };
 * 
 *   return <button onClick={handleSendMessage}>Update Order</button>;
 * }
 * ```
 * 
 * Example 3: Direct client usage
 * ```ts
 * import websocketClient from '@/api/websocketClient';
 * 
 * // Connect
 * await websocketClient.connect(token);
 * 
 * // Subscribe to topic
 * const unsubscribe = websocketClient.subscribe('/topic/orders', (message) => {
 *   console.log('Order:', message);
 * });
 * 
 * // Send message
 * websocketClient.send('/app/orders/update', { orderId: 123 });
 * 
 * // Unsubscribe
 * unsubscribe();
 * 
 * // Disconnect
 * websocketClient.disconnect();
 * ```
 */

export {};

