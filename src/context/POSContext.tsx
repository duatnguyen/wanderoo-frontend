import React, { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { OrderTab } from "../components/pos/POSHeader";
import type { POSSidebarItemId } from "../components/pos/POSSidebar";
import { useAuth } from "./AuthContext";

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

  // User
  user: {
    name: string;
    role: string;
  };
  isAuthenticated: boolean;
  isAuthLoading: boolean;
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
  const { user: authUser, isAuthenticated, isLoading } = useAuth();
  const [activeSidebarItem, setActiveSidebarItem] =
    useState<POSSidebarItemId>("cart");
  const [searchValue, setSearchValue] = useState("");
  const [orders, setOrders] = useState<OrderTab[]>([
    { id: "1", label: "Đơn 1" },
  ]);
  const [currentOrderId, setCurrentOrderId] = useState("1");
  const [productSelectHandler, setProductSelectHandlerState] =
    useState<POSProductSelectHandler | null>(null);

  const setProductSelectHandler = (handler: POSProductSelectHandler | null) => {
    setProductSelectHandlerState(() => handler);
  };

  const resolvedUser = useMemo(() => {
    if (authUser) {
      return {
        name: authUser.name || authUser.username,
        role: authUser.role || "USER",
      };
    }
    return user;
  }, [authUser, user]);

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
        user: resolvedUser,
        isAuthenticated,
        isAuthLoading: isLoading,
      }}
    >
      {children}
    </POSContext.Provider>
  );
};
