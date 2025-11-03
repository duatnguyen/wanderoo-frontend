// src/pages/admin/AdminOrderDetail.tsx
// Wrapper component để tự động route đến đúng component dựa trên source của đơn hàng
import React from "react";
import { useParams, useLocation } from "react-router-dom";
import AdminOrderDetailPOS from "./AdminOrderDetailPOS";
import AdminOrderDetailWebsite from "./AdminOrderDetailWebsite";

const AdminOrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();

  // Get source from location state if available (when navigating from order list)
  const sourceFromState = (location.state as { source?: string })?.source;

  // Get source - priority: location state > default to Website
  // In production, you would fetch order data from API based on orderId
  const orderSource = sourceFromState || "Website";

  // Render appropriate component based on source
  if (orderSource === "POS") {
    return <AdminOrderDetailPOS />;
  }

  return <AdminOrderDetailWebsite />;
};

export default AdminOrderDetail;
