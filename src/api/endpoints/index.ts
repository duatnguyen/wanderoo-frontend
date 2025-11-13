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
} from './authApi';

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
} from './userApi';

// Cart API exports
export {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from './cartApi';

// Discount API exports
export {
  getDiscounts,
  getDiscountMetadata,
  getDiscountDetail,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  deleteAllDiscounts,
} from './discountApi';

// Inventory API exports
export {
  getInventory,
} from './inventoryApi';

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
} from './attributeApi';

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
} from './productApi';

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
} from './orderApi';