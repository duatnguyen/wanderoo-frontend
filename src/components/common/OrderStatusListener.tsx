// src/components/common/OrderStatusListener.tsx - Component for listening to order status updates
import React from 'react';
import { useCustomerOrderWebSocket } from '../../hooks/useCustomerOrderWebSocket';
import { useAuth } from '../../context/AuthContext';
import type { CustomerOrderResponse } from '../../types/orders';

interface OrderStatusListenerProps {
  /**
   * Enable toast notifications
   */
  enableNotifications?: boolean;
  
  /**
   * Handler for order updates
   */
  onOrderUpdate?: (order: CustomerOrderResponse) => void;
  
  /**
   * Filter to only listen for user's own orders
   */
  userOrdersOnly?: boolean;
}

/**
 * Component that listens to WebSocket order updates for customers
 * This should be included in the main app layout to listen for real-time updates
 */
export const OrderStatusListener: React.FC<OrderStatusListenerProps> = ({
  enableNotifications = true,
  onOrderUpdate,
  userOrdersOnly = true,
}) => {
  const { user } = useAuth();
  
  // Filter to only process orders that belong to the current user
  const shouldProcessUpdate = React.useCallback((order: CustomerOrderResponse) => {
    if (!userOrdersOnly) {
      return true;
    }
    
    // Only process orders that belong to the current user
    return Boolean(user && order.userInfo?.id === user.id);
  }, [user, userOrdersOnly]);

  // Use customer order WebSocket hook
  const { isConnected } = useCustomerOrderWebSocket({
    enabled: !!user, // Only enable if user is logged in
    enableNotifications,
    onOrderUpdate,
    shouldProcessUpdate,
  });

  // This component doesn't render anything, it just listens for WebSocket updates
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-gray-800 text-white text-xs px-2 py-1 rounded">
        WS: {isConnected ? '🟢' : '🔴'}
      </div>
    );
  }

  return null;
};

export default OrderStatusListener;