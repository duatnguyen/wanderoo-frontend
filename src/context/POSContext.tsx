import React, { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { OrderTab } from "../components/pos/POSHeader";
import type { POSSidebarItemId } from "../components/pos/POSSidebar";

export type POSProductSelectHandler = (product: {
  id: string;
  name: string;
  price: number;
  available?: number | null;
  attributes?: string | null;
  imageUrl?: string;
}) => void;

type POSContextType = {
  // Sidebar
  activeSidebarItem: POSSidebarItemId;
  setActiveSidebarItem: (item: POSSidebarItemId) => void;

  // Header
  searchValue: string;
  setSearchValue: (value: string) => void;
  orders: OrderTab[];
  setOrders: React.Dispatch<React.SetStateAction<OrderTab[]>>;
  currentOrderId: string;
  setCurrentOrderId: (id: string) => void;
  productSelectHandler: POSProductSelectHandler | null;
  setProductSelectHandler: (handler: POSProductSelectHandler | null) => void;

  // Order handlers (for sales page)
  orderHandlers: {
    onOrderAdd?: () => void;
    onOrderClose?: (orderId: string) => void;
    onOrderSelect?: (orderId: string) => void;
  };
  setOrderHandlers: (handlers: {
    onOrderAdd?: () => void;
    onOrderClose?: (orderId: string) => void;
    onOrderSelect?: (orderId: string) => void;
  }) => void;

  // User
  user: {
    name: string;
    role: string;
  };
};

const POSContext = createContext<POSContextType | undefined>(undefined);

export const usePOSContext = () => {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error("usePOSContext must be used within POSProvider");
  }
  return context;
};

type POSProviderProps = {
  children: ReactNode;
  user?: {
    name: string;
    role: string;
  };
};

export const POSProvider: React.FC<POSProviderProps> = ({
  children,
  user = { name: "Admin", role: "Admin" },
}) => {
  const [activeSidebarItem, setActiveSidebarItem] =
    useState<POSSidebarItemId>("cart");
  const [searchValue, setSearchValue] = useState("");
  const [orders, setOrders] = useState<OrderTab[]>([
    { id: "1", label: "Đơn 1" },
  ]);
  const [currentOrderId, setCurrentOrderId] = useState("1");
  const [productSelectHandler, setProductSelectHandlerState] =
    useState<POSProductSelectHandler | null>(null);
  const [orderHandlers, setOrderHandlersState] = useState<{
    onOrderAdd?: () => void;
    onOrderClose?: (orderId: string) => void;
    onOrderSelect?: (orderId: string) => void;
  }>({});

  const setProductSelectHandler = useCallback(
    (handler: POSProductSelectHandler | null) => {
      setProductSelectHandlerState(handler);
    },
    []
  );
  const setOrderHandlers = useCallback(
    (handlers: {
      onOrderAdd?: () => void;
      onOrderClose?: (orderId: string) => void;
      onOrderSelect?: (orderId: string) => void;
    }) => {
      setOrderHandlersState(handlers);
    },
    []
  );

  return (
    <POSContext.Provider
      value={{
        activeSidebarItem,
        setActiveSidebarItem,
        searchValue,
        setSearchValue,
        orders,
        setOrders,
        currentOrderId,
        setCurrentOrderId,
        productSelectHandler,
        setProductSelectHandler,
        orderHandlers,
        setOrderHandlers,
        user,
      }}
    >
      {children}
    </POSContext.Provider>
  );
};
