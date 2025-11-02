# Admin Pages Structure Reorganization

## 📁 Cấu trúc mới sau tái tổ chức

### 🎯 **Nguyên tắc tổ chức:**
- **Feature-based**: Mỗi feature có các sub-modules theo chức năng
- **Scalable**: Có thể mở rộng thêm components, hooks, types
- **Clean imports**: Đường dẫn ngắn gọn và rõ ràng

### 📋 **Cấu trúc chi tiết:**

```
📁 src/features/admin/
├── 📁 accounting/
│   └── pages/
│       └── AdminAccounting.tsx       # Kế toán
├── 📁 customers/
│   └── pages/
│       ├── list/                     # Danh sách KH
│       │   ├── AdminCustomers.tsx
│       │   ├── AdminAddCustomer.tsx  
│       │   └── index.ts
│       ├── detail/                   # Chi tiết KH
│       │   ├── AdminCustomerDetail.tsx
│       │   └── index.ts
│       ├── reviews/                  # Đánh giá KH
│       │   ├── AdminCustomerReviews.tsx
│       │   └── index.ts
│       └── index.ts                  # Export tổng
├── 📁 dashboard/
│   └── pages/
│       └── AdminDashboard.tsx        # Dashboard chính
├── 📁 discounts/
│   └── pages/
│       ├── list/                     # Danh sách discount
│       │   ├── AdminDiscounts.tsx
│       │   └── index.ts
│       ├── create/                   # Tạo voucher
│       │   ├── AdminCreateVoucher.tsx
│       │   ├── AdminCreateVoucherNewCustomer.tsx
│       │   ├── AdminCreateVoucherPrivate.tsx
│       │   ├── AdminCreateVoucherProduct.tsx
│       │   ├── AdminCreateVoucherReturningCustomer.tsx
│       │   ├── AdminCreateVoucherShopWide.tsx
│       │   └── index.ts
│       └── index.ts
├── 📁 orders/
│   └── pages/
│       ├── list/                     # Danh sách đơn hàng
│       │   ├── AdminOrders.tsx
│       │   ├── AdminOrderOtherStatus.tsx
│       │   └── index.ts
│       ├── detail/                   # Chi tiết đơn hàng
│       │   ├── AdminOrderDetail.tsx
│       │   ├── AdminOrderDetailPOS.tsx
│       │   ├── AdminOrderDetailWebsite.tsx
│       │   └── index.ts
│       └── index.ts
├── 📁 products/
│   └── pages/
│       ├── list/                     # Danh sách sản phẩm
│       │   ├── AdminProducts.tsx
│       │   └── index.ts
│       ├── categories/               # Quản lý danh mục
│       │   ├── AdminProductsCategories.tsx
│       │   ├── AdminProductsCategoryDetail.tsx
│       │   └── index.ts
│       ├── create/                   # Tạo sản phẩm
│       │   ├── AdminProductsNew.tsx
│       │   └── index.ts
│       └── index.ts
├── 📁 reports/
│   └── pages/
│       └── AdminReports.tsx          # Báo cáo
├── 📁 settings/
│   └── pages/
│       └── AdminSettings.tsx         # Cài đặt
├── 📁 shipping/
│   └── pages/
│       └── AdminShipping.tsx         # Vận chuyển
├── 📁 staff/
│   └── pages/
│       ├── list/                     # Danh sách nhân viên
│       │   ├── AdminStaff.tsx
│       │   └── index.ts
│       ├── detail/                   # Chi tiết nhân viên
│       │   ├── AdminStaffDetail.tsx
│       │   └── index.ts
│       ├── create/                   # Tạo nhân viên
│       │   ├── AdminStaffNew.tsx
│       │   └── index.ts
│       └── index.ts
└── 📁 warehouse/
    └── pages/
        ├── imports/                  # Nhập kho
        │   ├── AdminWarehouseImports.tsx
        │   ├── AdminWarehouseCreateImport.tsx
        │   ├── AdminWarehouseImportDetail.tsx
        │   └── index.ts
        ├── suppliers/                # Nhà cung cấp
        │   ├── AdminWarehouseSupplier.tsx
        │   ├── AdminSupplierNew.tsx
        │   ├── AdminSupplierDetail.tsx
        │   └── index.ts
        ├── returns/                  # Trả hàng NCC
        │   ├── AdminWarehouseReturnsImport.tsx
        │   ├── AdminWarehouseCreateReturnImport.tsx
        │   ├── AdminWarehouseDetailReturnImport.tsx
        │   └── index.ts
        └── index.ts
```

## 🔄 **Import Examples - Cách sử dụng mới:**

### Before (Cũ):
```typescript
const AdminCustomers = lazy(() => import("../../features/admin/customers/pages/AdminCustomers"));
```

### After (Mới):
```typescript
const AdminCustomers = lazy(() => import("../../features/admin/customers/pages/list").then(module => ({ default: module.AdminCustomers })));
```

## ✅ **Benefits - Lợi ích:**

1. **📂 Better Organization**: Dễ tìm file theo logic business
2. **🚀 Scalability**: Có thể thêm components, hooks, types cho mỗi sub-feature
3. **🔄 Maintainability**: Dễ maintain và debug
4. **👥 Team Collaboration**: Nhiều dev có thể work parallel trên các feature khác nhau
5. **📦 Code Splitting**: Better lazy loading performance

## 🔧 **Next Steps - Các bước tiếp theo:**

1. ✅ **Structure Created** - Đã tạo cấu trúc mới
2. 🔄 **Update Routes** - Cần cập nhật routes.admin.tsx (In Progress)
3. 📋 **Create Index Files** - Tạo index.ts cho tất cả modules
4. 🧪 **Test Import Paths** - Test tất cả import paths
5. 📚 **Update Documentation** - Cập nhật docs

## ⚠️ **Migration Status:**
- ✅ Files moved to new structure
- 🔄 Routes.admin.tsx being updated
- ⏳ Index files partially created
- ⏳ Testing required