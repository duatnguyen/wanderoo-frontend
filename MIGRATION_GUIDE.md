# Migration Guide - Feature-Based Organization

## Overview

Reorganizing admin pages from `src/pages/admin/` to feature-based structure in `src/features/`.

## Import Path Updates Required

When moving files, update import paths:

### Old → New Import Paths

**Types:**

- Old: `../../types/admin`
- New: `../../../../types/admin`

**Components:**

- Old: `../../components/...`
- New: `../../../components/...`

**Utils/Hooks:**

- Old: `../../utils/...` or `../../hooks/...`
- New: `../../../../utils/...` or `../../../../hooks/...`

**Using @ alias:**

- Paths using `@/components/...` or `@/types/...` don't need changes!

## File Mapping

### Dashboard

- `AdminDashboard.tsx` → `features/dashboard/pages/AdminDashboard.tsx` ✅

### Discounts

- `AdminDiscounts.tsx` → `features/discounts/pages/AdminDiscounts.tsx`
- `AdminCreateVoucher.tsx` → `features/discounts/pages/AdminCreateVoucher.tsx`

### Products

- `AdminProducts.tsx` → `features/products/pages/AdminProducts.tsx`
- `AdminProductsNew.tsx` → `features/products/pages/AdminProductsNew.tsx`
- `AdminProductsCategories.tsx` → `features/products/pages/AdminProductsCategories.tsx`
- `AdminProductsCategoryDetail.tsx` → `features/products/pages/AdminProductsCategoryDetail.tsx`

### Orders

- `AdminOrders.tsx` → `features/orders/pages/AdminOrders.tsx`
- `AdminOrderDetail.tsx` → `features/orders/pages/AdminOrderDetail.tsx`
- `AdminOrderOtherStatus.tsx` → `features/orders/pages/AdminOrderOtherStatus.tsx`

### Warehouse

- `AdminWarehouseImports.tsx` → `features/warehouse/pages/AdminWarehouseImports.tsx`
- `AdminWarehouseCreateImport.tsx` → `features/warehouse/pages/AdminWarehouseCreateImport.tsx`
- `AdminWarehouseImportDetail.tsx` → `features/warehouse/pages/AdminWarehouseImportDetail.tsx`
- `AdminWarehouseReturnsImport.tsx` → `features/warehouse/pages/AdminWarehouseReturnsImport.tsx`
- `AdminWarehouseDetailReturnImport.tsx` → `features/warehouse/pages/AdminWarehouseDetailReturnImport.tsx`
- `AdminWarehouseSupplier.tsx` → `features/warehouse/pages/AdminWarehouseSupplier.tsx`
- `AdminSupplierNew.tsx` → `features/warehouse/pages/AdminSupplierNew.tsx`
- `AdminSupplierDetail.tsx` → `features/warehouse/pages/AdminSupplierDetail.tsx`

### Customers

- `AdminCustomers.tsx` → `features/customers/pages/AdminCustomers.tsx`
- `AdminCustomerReviews.tsx` → `features/customers/pages/AdminCustomerReviews.tsx`

### Staff

- `AdminStaff.tsx` → `features/staff/pages/AdminStaff.tsx`
- `AdminStaffNew.tsx` → `features/staff/pages/AdminStaffNew.tsx`

### Reports

- `AdminReports.tsx` → `features/reports/pages/AdminReports.tsx`

### Settings

- `AdminSettings.tsx` → `features/settings/pages/AdminSettings.tsx`
- `AdminShipping.tsx` → `features/settings/pages/AdminShipping.tsx`
- `AdminPOS.tsx` → `features/settings/pages/AdminPOS.tsx`
- `AdminWebsite.tsx` → `features/settings/pages/AdminWebsite.tsx`
- `AdminAccounting.tsx` → `features/settings/pages/AdminAccounting.tsx`

## Router Updates

Update `src/app/router/routes.admin.tsx` imports:

```typescript
// OLD
const AdminDashboard = lazy(() => import("../../pages/admin/AdminDashboard"));

// NEW
const AdminDashboard = lazy(
  () => import("../../features/dashboard/pages/AdminDashboard")
);
```

## Status

- [x] Dashboard migrated
- [ ] Discounts (2 files)
- [ ] Products (4 files)
- [ ] Orders (3 files)
- [ ] Warehouse (8 files)
- [ ] Customers (2 files)
- [ ] Staff (2 files)
- [ ] Reports (1 file)
- [ ] Settings (5 files)
- [ ] Router updated
- [ ] Old files removed
