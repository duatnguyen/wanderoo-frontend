import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { POSSidebar } from "../features/pos/components/POSSidebar";
import { POSHeader, type OrderTab } from "../features/pos/components/POSHeader";
import { POSProvider, usePOSContext } from "../features/pos/context/POSContext";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { POSSidebarItemId } from "../features/pos/components/POSSidebar";

const POSLayoutContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isOrderManagementPage = location.pathname.includes("/orders");
  const isReturnOrderPage = location.pathname.includes("/returns");

  const {
    activeSidebarItem,
    setActiveSidebarItem,
    searchValue,
    setSearchValue,
    orders,
    setOrders,
    currentOrderId,
    setCurrentOrderId,
    user,
  } = usePOSContext();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isInventoryPage = location.pathname.includes("/inventory");

  // Update active sidebar item based on route
  useEffect(() => {
    if (isOrderManagementPage) {
      setActiveSidebarItem("invoices" as POSSidebarItemId);
    } else if (location.pathname.includes("/sales")) {
      setActiveSidebarItem("cart" as POSSidebarItemId);
    } else if (isInventoryPage) {
      setActiveSidebarItem("products" as POSSidebarItemId);
    } else if (isReturnOrderPage) {
      setActiveSidebarItem("receipts" as POSSidebarItemId);
    }
  }, [
    location.pathname,
    isOrderManagementPage,
    isInventoryPage,
    isReturnOrderPage,
    setActiveSidebarItem,
  ]);

  const handleAddOrder = () => {
    const newOrderId = String(orders.length + 1);
    const newOrder: OrderTab = { id: newOrderId, label: `Đơn ${newOrderId}` };
    setOrders([...orders, newOrder]);
    setCurrentOrderId(newOrderId);
  };

  const handleCloseOrder = (orderId: string) => {
    if (orders.length === 1) {
      return;
    }
    const newOrders = orders.filter((o) => o.id !== orderId);
    setOrders(newOrders);
    if (currentOrderId === orderId) {
      setCurrentOrderId(newOrders[0]?.id || "1");
    }
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-gray-50 justify-between">
      {/* Header */}
      <POSHeader
        pageTitle={
          isOrderManagementPage
            ? "Quản lý đơn hàng"
            : isInventoryPage
            ? "Tra cứu tồn kho"
            : isReturnOrderPage
            ? "Trả hàng"
            : "Bán hàng"
        }
        searchValue={
          location.pathname.includes("/sales") ? searchValue : undefined
        }
        onSearchChange={
          location.pathname.includes("/sales")
            ? (e) => setSearchValue(e.target.value)
            : undefined
        }
        currentOrderId={
          location.pathname.includes("/sales") ? currentOrderId : undefined
        }
        orders={location.pathname.includes("/sales") ? orders : undefined}
        onOrderSelect={
          location.pathname.includes("/sales") ? setCurrentOrderId : undefined
        }
        onOrderClose={
          location.pathname.includes("/sales") ? handleCloseOrder : undefined
        }
        onOrderAdd={
          location.pathname.includes("/sales") ? handleAddOrder : undefined
        }
        user={user}
        className="flex-shrink-0"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-[64px] sm:top-[80px] left-2 z-50 p-2 bg-white rounded-md shadow-md border border-gray-200"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? (
            <X className="w-5 h-5 text-[#454545]" />
          ) : (
            <Menu className="w-5 h-5 text-[#454545]" />
          )}
        </button>

        {/* Sidebar */}
        <div
          className={cn(
            "flex-shrink-0 transition-all duration-300 ease-in-out",
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0",
            "fixed lg:static inset-y-0 left-0 z-40",
            "lg:w-[75px]"
          )}
        >
          <div className="h-full">
            <POSSidebar
              activeItem={activeSidebarItem}
              onItemClick={(item) => {
                setActiveSidebarItem(item);
                setSidebarOpen(false); // Close on mobile after selection

                // Navigate based on sidebar item
                if (item === "invoices") {
                  navigate("/pos/orders");
                } else if (item === "cart") {
                  navigate("/pos/sales");
                } else if (item === "products") {
                  navigate("/pos/inventory");
                } else if (item === "receipts") {
                  navigate("/pos/returns");
                }
                // Add more navigation cases as needed
              }}
              className="h-full"
            />
          </div>
        </div>

        {/* Sidebar Overlay for Mobile */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Page Content */}
        <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const POSLayout: React.FC = () => {
  return (
    <POSProvider>
      <POSLayoutContent />
    </POSProvider>
  );
};

export default POSLayout;
