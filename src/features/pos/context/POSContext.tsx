import React, { createContext, useContext, useState, ReactNode } from "react";
import type { OrderTab } from "../components/POSHeader";
import type { POSSidebarItemId } from "../components/POSSidebar";

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
        user,
      }}
    >
      {children}
    </POSContext.Provider>
  );
};

