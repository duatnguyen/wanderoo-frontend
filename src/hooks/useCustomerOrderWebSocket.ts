// src/hooks/useCustomerOrderWebSocket.ts - Hook for customer order WebSocket updates
import { useCallback } from 'react';
import { useWebSocket } from './useWebSocket';
import type { CustomerOrderResponse } from '../types/orders';
import { toast } from 'sonner';

interface UseCustomerOrderWebSocketOptions {
  /**
   * Enable automatic connection
   */
  enabled?: boolean;
  
  /**
   * Handler for order updates
   */
  onOrderUpdate?: (order: CustomerOrderResponse) => void;
  
  /**
   * Handler for specific order detail updates (by order code)
   */
  onOrderDetailUpdate?: (order: CustomerOrderResponse) => void;
  
  /**
   * Order code to listen for specific updates
   */
  orderCode?: string;
  
  /**
   * Enable toast notifications for order updates
   */
  enableNotifications?: boolean;
  
  /**
   * Filter function to determine if order update should be processed
   */
  shouldProcessUpdate?: (order: CustomerOrderResponse) => boolean;
}

/**
 * Hook for listening to customer order WebSocket updates
 * 
 * @example
 * ```tsx
 * // Listen to all customer order updates
 * useCustomerOrderWebSocket({
 *   enabled: true,
 *   enableNotifications: true,
 *   onOrderUpdate: (order) => {
 *     console.log('Order updated:', order);
 *   }
 * });
 * 
 * // Listen to specific order updates
 * useCustomerOrderWebSocket({
 *   enabled: true,
 *   orderCode: 'ORD-123',
 *   onOrderDetailUpdate: (order) => {
 *     setOrderDetail(order);
 *   }
 * });
 * ```
 */
export const useCustomerOrderWebSocket = (options: UseCustomerOrderWebSocketOptions = {}) => {
  const {
    enabled = true,
    onOrderUpdate,
    onOrderDetailUpdate,
    orderCode,
    enableNotifications = false,
    shouldProcessUpdate,
  } = options;

  // Topics to subscribe to
  const topics = [];
  
  // Subscribe to general customer order updates
  topics.push('/topic/customer/orders/updates');
  
  // Subscribe to specific order detail updates if orderCode is provided
  if (orderCode) {
    topics.push(`/topic/orders/detail/${orderCode}`);
  }

  // WebSocket message handler
  const handleMessage = useCallback((message: CustomerOrderResponse) => {
    try {
      // Check if we should process this update
      if (shouldProcessUpdate && !shouldProcessUpdate(message)) {
        return;
      }

      // Handle specific order detail updates
      if (orderCode && message.code === orderCode) {
        onOrderDetailUpdate?.(message);
        
        if (enableNotifications) {
          toast.success('Cập nhật đơn hàng', {
            description: `Đơn hàng #${message.code} đã được cập nhật`,
            duration: 4000,
          });
        }
        return;
      }

      // Handle general order updates
      onOrderUpdate?.(message);
      
      // Show notifications if enabled
      if (enableNotifications) {
        // Determine notification message based on status
        let notificationMessage = '';
        let notificationDescription = '';
        
        switch (message.status) {
          case 'CONFIRMED':
            notificationMessage = 'Đơn hàng đã được xác nhận';
            notificationDescription = `Đơn hàng #${message.code} đã được xác nhận và đang chuẩn bị`;
            break;
          case 'PROCESSING':
            notificationMessage = 'Đơn hàng đang xử lý';
            notificationDescription = `Đơn hàng #${message.code} đang được chuẩn bị`;
            break;
          case 'SHIPPING':
            notificationMessage = 'Đơn hàng đang giao';
            notificationDescription = `Đơn hàng #${message.code} đang trên đường giao đến bạn`;
            break;
          case 'COMPLETE':
            notificationMessage = 'Đơn hàng hoàn thành';
            notificationDescription = `Đơn hàng #${message.code} đã được giao thành công`;
            break;
          case 'CANCELED':
            notificationMessage = 'Đơn hàng đã hủy';
            notificationDescription = `Đơn hàng #${message.code} đã bị hủy`;
            break;
          case 'SHIPPING_FAILED':
            notificationMessage = 'Giao hàng thất bại';
            notificationDescription = `Đơn hàng #${message.code} giao hàng thất bại`;
            break;
          case 'RETURNED':
            notificationMessage = 'Đơn hàng đã trả về';
            notificationDescription = `Đơn hàng #${message.code} đã được trả về kho`;
            break;
          default:
            // For shipping status updates
            if (message.shippingStatus) {
              switch (message.shippingStatus) {
                case 'READY_TO_PICK':
                  notificationMessage = 'Chờ lấy hàng';
                  notificationDescription = `Đơn hàng #${message.code} đang chờ lấy hàng`;
                  break;
                case 'PICKING':
                  notificationMessage = 'Đang lấy hàng';
                  notificationDescription = `Đơn hàng #${message.code} đang được lấy hàng`;
                  break;
                case 'TRANSPORTING':
                  notificationMessage = 'Đang vận chuyển';
                  notificationDescription = `Đơn hàng #${message.code} đang được vận chuyển`;
                  break;
                case 'DELIVERING':
                  notificationMessage = 'Đang giao hàng';
                  notificationDescription = `Đơn hàng #${message.code} đang được giao đến bạn`;
                  break;
                case 'DELIVERED':
                  notificationMessage = 'Đã giao hàng';
                  notificationDescription = `Đơn hàng #${message.code} đã được giao thành công`;
                  break;
                case 'DELIVERY_FAIL':
                  notificationMessage = 'Giao hàng thất bại';
                  notificationDescription = `Đơn hàng #${message.code} giao hàng thất bại`;
                  break;
                default:
                  notificationMessage = 'Cập nhật đơn hàng';
                  notificationDescription = `Đơn hàng #${message.code} đã được cập nhật`;
              }
            } else {
              notificationMessage = 'Cập nhật đơn hàng';
              notificationDescription = `Đơn hàng #${message.code} đã được cập nhật`;
            }
        }
        
        if (notificationMessage) {
          toast.info(notificationMessage, {
            description: notificationDescription,
            duration: 5000,
          });
        }
      }
      
    } catch (error) {
      console.error('[useCustomerOrderWebSocket] Error processing message:', error);
    }
  }, [onOrderUpdate, onOrderDetailUpdate, orderCode, enableNotifications, shouldProcessUpdate]);

  // Use WebSocket hook
  const {
    state,
    isConnected,
    connect,
    disconnect,
  } = useWebSocket({
    autoConnect: enabled,
    topics: enabled ? topics : [],
    onMessage: handleMessage,
    onError: (error) => {
      console.error('[useCustomerOrderWebSocket] WebSocket error:', error);
    },
    onStateChange: (newState) => {
      console.log('[useCustomerOrderWebSocket] WebSocket state changed:', newState);
    },
  });

  // Debug logging
  console.log('[useCustomerOrderWebSocket] Configuration:', {
    enabled,
    orderCode,
    topics,
    isConnected,
    state,
  });

  return {
    state,
    isConnected,
    connect,
    disconnect,
  };
};

export default useCustomerOrderWebSocket;