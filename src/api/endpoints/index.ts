// src/api/endpoints/index.ts - Centralized API exports for easy importing
// Auth API exports
export {
  login,
  register,
  refreshToken,
  logout,
  getCurrentUser,
  authLogin,
  authRegister,
  authMe,
} from "./authApi";

// User API exports
export {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getUserAddresses,
  setDefaultAddress,
  addAddress,
  getAddressById,
  updateAddress,
  deleteAddress,
} from "./userApi";

// Cart API exports
export {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "./cartApi";

// Discount API exports
export {
  getDiscounts,
  getDiscountMetadata,
  getDiscountDetail,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  deleteAllDiscounts,
} from "./discountApi";

// Inventory API exports
export { getInventory } from "./inventoryApi";

// Attribute API exports
export {
  getCategoryParentList,
  createCategoryParent,
  updateCategoryParent,
  getCategoryChildListByParent,
  getCategoryChildList,
  createCategoryChild,
  updateCategoryChild,
  enableAllCategories,
  disableAllCategories,
  getBrandList,
} from "./attributeApi";

// Product API exports
export {
  getProductDetail,
  getProductVariants,
  createProduct,
  getAllProducts,
  getActiveProducts,
  getInactiveProducts,
  getAdminProductDetail,
  getProductVariantsAdmin,
  getVariantDetail,
  updateProduct,
  updateVariant,
  disableProduct,
  enableProduct,
  updateSellingQuantity,
  createProductPrivate,
  getAllProductsPrivate,
  getActiveProductsPrivate,
  getInactiveProductsPrivate,
  getProductDetailPrivate,
  getProductVariantsPrivate,
  getVariantDetailPrivate,
  updateProductPrivate,
  updateVariantPrivate,
  disableProductsPrivate,
  enableProductsPrivate,
  updateSellingQuantityPrivate,
} from "./productApi";

// Order API exports
export {
  getOrderMetadata,
  getCustomerOrders,
  getCustomerOrderDetail,
  createOrder,
  cancelOrder,
  getAdminCustomerOrders,
  getAdminCustomerOrderDetail,
  createAdminCustomerOrder,
  updateAdminCustomerOrder,
  confirmOrderAndCreateShipping,
  cancelAdminOrder,
  getOrderDetailsByOrderId,
  getOrderDetailItem,
  createOrderDetail,
  updateOrderDetail,
  getOrderHistoriesByOrderId,
  getOrderHistoryByOrderAndHistoryId,
} from "./orderApi";

// Review API exports
export {
  getReviews,
  getReviewDetail,
  createReview,
  updateReview,
  deleteReview,
} from "./reviewApi";

// Sale POS API exports
export {
  searchProducts,
  searchCustomers,
  getAvailableDiscounts,
  getDraftOrderDetail,
  getOrCreateDraftOrders,
  createNewDraftOrder,
  updateItemQuantity,
  addItemToOrder,
  assignCustomerToOrder,
  applyDiscountToOrder,
  removeOrderDiscount,
  updateOrderNote,
  checkoutOrder,
  removeItemFromDraftOrder,
  deleteDraftOrder,
} from "./saleApi";

// Shipping API exports
export {
  getProvinces,
  getDistricts,
  getDistrictsByPath,
  getWards,
  getWardsByPath,
  calculateShippingFee,
  getStations,
  getStationsByPath,
  getPickShifts,
  createShippingOrder,
  updateShippingOrder,
  updateShippingOrderByCode,
  getShippingOrderDetail,
  getOrderDetail,
  getOrderByClientCode,
  getOrderByClientCodePath,
  previewOrder,
  trackShippingOrder,
  getShippingStatus,
  trackByTrackingNumber,
  cancelShippingOrder,
  cancelMultipleShippingOrders,
  getUserOrdersWithShipping,
  getAllOrdersForUser,
  generatePrintToken,
  printOrderA5,
  printOrder80x80,
  printOrder52x70,
  printSingleOrder,
  switchStatusToStoring,
  handleShippingWebhook,
} from "./shippingApi";

// Warehouse API exports
export {
  // Provider APIs
  getProviderList,
  deleteProvider,
  deleteAllProviders,
  createProvider,
  getProviderDetail,
  getProviderStats,
  updateProvider,
  // Invoice APIs
  getImportInvoices,
  getImportInvoicesPending,
  getImportInvoicesDone,
  getExportInvoices,
  getExportInvoicesPending,
  getExportInvoicesDone,
} from "./warehouseApi";

// POS APIs
export {
  getPosOrderList,
  getPosOrderDetail,
  // POS return APIs
  createPosReturnOrder,
  getPosReturnOrderList,
  getPosReturnOrderDetail,
  cancelPosReturnOrder,
  completePosReturnOrder,
} from "./posApi";
