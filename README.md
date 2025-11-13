# Wanderoo Frontend - E-commerce Admin System

## 🏗️ **Tổng quan dự án**

Hệ thống frontend cho nền tảng e-commerce Wanderoo, được xây dựng với React 19, TypeScript và Vite. Hỗ trợ đa vai trò với interface admin, POS (Point of Sale), và khách hàng.

## � **Công nghệ sử dụng**

- **React 19.1.1** với TypeScript
- **Vite 7.1.12** - Build tool và dev server
- **React Router v7.9.1** - Routing với lazy loading
- **Tailwind CSS** - Styling framework
- **React Query/TanStack Query** - State management & caching

## 📁 **Cấu trúc project**

### 🎯 **Nguyên tắc tổ chức:**
- **Feature-based architecture**: Tổ chức theo business domain
- **Role-based components**: Admin, POS, Shop components riêng biệt
- **Lazy loading**: Tối ưu performance với code splitting
- **Clean imports**: Đường dẫn rõ ràng với index files

### 📋 **Cấu trúc chi tiết:**

```
📁 src/
├── 📁 app/                          # Cấu hình ứng dụng
│   ├── 📁 providers/                # Providers (Auth, Query)
│   └── 📁 router/                   # Routing configuration
├── 📁 components/                   # UI Components
│   ├── 📁 admin/                    # Admin-specific components
│   ├── 📁 pos/                      # POS-specific components
│   ├── 📁 shop/                     # Shop/Customer components
│   ├── 📁 common/                   # Shared components
│   ├── 📁 ui/                       # Base UI components
│   └── 📁 icons/                    # Icon components
├── 📁 features/                     # Feature modules
│   ├── 📁 admin/pages/              # Admin pages - Feature-based
│   │   ├── 📁 customers/            # Customer management
│   │   │   ├── 📁 list/             # List view
│   │   │   │   ├── AdminCustomers.tsx
│   │   │   │   ├── AdminAddCustomer.tsx
│   │   │   │   └── index.ts
│   │   │   ├── 📁 detail/           # Detail view
│   │   │   │   ├── AdminCustomerDetail.tsx
│   │   │   │   └── index.ts
│   │   │   ├── 📁 reviews/          # Reviews
│   │   │   │   ├── AdminCustomerReviews.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── 📁 discounts/            # Discount management
│   │   │   ├── 📁 list/
│   │   │   │   ├── AdminDiscounts.tsx
│   │   │   │   └── index.ts
│   │   │   ├── 📁 create/           # Voucher creation
│   │   │   │   ├── AdminCreateVoucher.tsx
│   │   │   │   ├── AdminCreateVoucherNewCustomer.tsx
│   │   │   │   ├── AdminCreateVoucherPrivate.tsx
│   │   │   │   ├── AdminCreateVoucherProduct.tsx
│   │   │   │   ├── AdminCreateVoucherReturningCustomer.tsx
│   │   │   │   ├── AdminCreateVoucherShopWide.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── 📁 orders/               # Order management
│   │   │   ├── 📁 list/
│   │   │   │   ├── AdminOrders.tsx
│   │   │   │   ├── AdminOrderOtherStatus.tsx
│   │   │   │   └── index.ts
│   │   │   ├── 📁 detail/
│   │   │   │   ├── AdminOrderDetail.tsx
│   │   │   │   ├── AdminOrderDetailPOS.tsx
│   │   │   │   ├── AdminOrderDetailWebsite.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── 📁 products/             # Product management
│   │   │   ├── 📁 list/
│   │   │   │   ├── AdminProducts.tsx
│   │   │   │   └── index.ts
│   │   │   ├── 📁 categories/
│   │   │   │   ├── AdminProductsCategories.tsx
│   │   │   │   ├── AdminProductsCategoryDetail.tsx
│   │   │   │   └── index.ts
│   │   │   ├── 📁 create/
│   │   │   │   ├── AdminProductsNew.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── 📁 staff/                # Staff management
│   │   │   ├── 📁 list/
│   │   │   │   ├── AdminStaff.tsx
│   │   │   │   └── index.ts
│   │   │   ├── 📁 detail/
│   │   │   │   ├── AdminStaffDetail.tsx
│   │   │   │   └── index.ts
│   │   │   ├── 📁 create/
│   │   │   │   ├── AdminStaffNew.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── 📁 warehouse/            # Warehouse management
│   │   │   ├── 📁 imports/
│   │   │   │   ├── AdminWarehouseImports.tsx
│   │   │   │   ├── AdminWarehouseCreateImport.tsx
│   │   │   │   ├── AdminWarehouseImportDetail.tsx
│   │   │   │   └── index.ts
│   │   │   ├── 📁 returns/
│   │   │   │   ├── AdminWarehouseReturnsImport.tsx
│   │   │   │   ├── AdminWarehouseCreateReturnImport.tsx
│   │   │   │   ├── AdminWarehouseDetailReturnImport.tsx
│   │   │   │   └── index.ts
│   │   │   ├── 📁 suppliers/
│   │   │   │   ├── AdminWarehouseSupplier.tsx
│   │   │   │   ├── AdminSupplierNew.tsx
│   │   │   │   ├── AdminSupplierDetail.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── 📁 dashboard/
│   │   │   └── AdminDashboard.tsx
│   │   ├── 📁 accounting/
│   │   │   └── AdminAccounting.tsx
│   │   ├── 📁 reports/
│   │   │   └── AdminReports.tsx
│   │   ├── 📁 settings/
│   │   │   └── AdminSettings.tsx
│   │   └── 📁 shipping/
│   │       └── AdminShipping.tsx
│   ├── 📁 pos/pages/                # POS pages - Feature-based
│   │   ├── 📁 sales/                # Sales operations
│   │   ├── 📁 orders/               # Order management
│   │   ├── 📁 returns/              # Return processing
│   │   ├── 📁 inventory/            # Inventory check
│   │   └── 📁 cashbook/             # Cash management
│   ├── 📁 shop/                     # Customer-facing pages
│   └── 📁 warehouse/                # Warehouse operations
├── 📁 layouts/                      # Layout components
│   ├── AdminLayout.tsx
│   ├── POSLayout.tsx
│   └── UserLayout.tsx
├── 📁 hooks/                        # Custom hooks
├── 📁 api/                          # API layer
│   ├── apiClient.ts                 # Axios client with interceptors
│   └── endpoints/                   # Domain-specific API functions
│       ├── authApi.ts              # Authentication APIs
│       ├── userApi.ts              # User management APIs
│       ├── productApi.ts           # Product management APIs
│       └── orderApi.ts             # Order & POS APIs
├── 📁 types/                        # TypeScript definitions
└── 📁 utils/                        # Utility functions
```

## 🔄 **Routing và Import Examples**

### Lazy Loading Pattern:
```typescript
// Admin routes với lazy loading
const AdminCustomers = lazy(() => 
  import("../../features/admin/pages/customers/list")
  .then(module => ({ default: module.AdminCustomers }))
);

// POS routes
const POSSales = lazy(() => 
  import("../../features/pos/pages/sales/POSSales")
);
```

### Clean Import với Index Files:
```typescript
// Export từ module
export { AdminCustomers } from './AdminCustomers';
export { AdminAddCustomer } from './AdminAddCustomer';

// Import tổng hợp
import { AdminCustomers, AdminAddCustomer } from '../customers/list';
```

## 🎮 **Các tính năng chính**

### 👨‍💼 **Admin Interface**
- **Dashboard**: Tổng quan thống kê
- **Product Management**: Quản lý sản phẩm và danh mục
- **Order Management**: Xử lý đơn hàng 
- **Customer Management**: Quản lý khách hàng và reviews
- **Staff Management**: Quản lý nhân viên
- **Warehouse**: Nhập/xuất kho, nhà cung cấp
- **Discounts**: Tạo và quản lý voucher/mã giảm giá
- **Reports**: Báo cáo thống kê
- **Settings**: Cấu hình hệ thống

### � **POS (Point of Sale)**
- **Sales**: Bán hàng trực tiếp
- **Orders**: Quản lý đơn hàng POS
- **Returns**: Xử lý trả hàng
- **Inventory**: Kiểm tra kho
- **Cashbook**: Quản lý thu chi

### �️ **Customer Interface**
- Product catalog và tìm kiếm
- Shopping cart và checkout
- User profiles và order history

## � **Development Commands**

```bash
# Cài đặt dependencies
npm install

# Chạy dev server
npm run dev

# Build production
npm run build

# Preview build
npm run preview

# Lint code
npm run lint
```

## ✅ **Tình trạng dự án**

- ✅ **Cấu trúc mới**: Hoàn thành tái tổ chức feature-based
- ✅ **Admin Pages**: Đã di chuyển và cấu hình xong
- ✅ **POS Pages**: Đã tái cấu trúc 
- ✅ **Routes**: Admin và POS routes đã cập nhật
- ✅ **Components**: 35+ components được tổ chức tốt
- ✅ **TypeScript**: Không còn lỗi compilation