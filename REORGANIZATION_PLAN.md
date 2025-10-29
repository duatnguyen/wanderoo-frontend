# Project Reorganization Plan

## Current Issues

1. **Duplicate structure**: `src/pages/admin/` contains 28 files, while `src/features/` has empty feature folders
2. **Feature-based structure not implemented**: Pages should be organized by feature, not by role
3. **Component organization**: Some components could be better organized

## Proposed Structure

```
src/
├── features/
│   ├── dashboard/
│   │   └── pages/
│   │       └── AdminDashboard.tsx
│   ├── products/
│   │   └── pages/
│   │       ├── AdminProducts.tsx
│   │       ├── AdminProductsNew.tsx
│   │       ├── AdminProductsCategories.tsx
│   │       └── AdminProductsCategoryDetail.tsx
│   ├── orders/
│   │   └── pages/
│   │       ├── AdminOrders.tsx
│   │       ├── AdminOrderDetail.tsx
│   │       └── AdminOrderOtherStatus.tsx
│   ├── warehouse/
│   │   └── pages/
│   │       ├── AdminWarehouseImports.tsx
│   │       ├── AdminWarehouseCreateImport.tsx
│   │       ├── AdminWarehouseImportDetail.tsx
│   │       ├── AdminWarehouseReturnsImport.tsx
│   │       ├── AdminWarehouseDetailReturnImport.tsx
│   │       ├── AdminWarehouseSupplier.tsx
│   │       ├── AdminSupplierNew.tsx
│   │       └── AdminSupplierDetail.tsx
│   ├── customers/
│   │   └── pages/
│   │       ├── AdminCustomers.tsx
│   │       └── AdminCustomerReviews.tsx
│   ├── discounts/
│   │   └── pages/
│   │       ├── AdminDiscounts.tsx
│   │       └── AdminCreateVoucher.tsx
│   ├── staff/
│   │   └── pages/
│   │       ├── AdminStaff.tsx
│   │       └── AdminStaffNew.tsx
│   ├── reports/
│   │   └── pages/
│   │       └── AdminReports.tsx
│   ├── settings/
│   │   └── pages/
│   │       ├── AdminSettings.tsx
│   │       ├── AdminShipping.tsx
│   │       ├── AdminPOS.tsx
│   │       ├── AdminWebsite.tsx
│   │       └── AdminAccounting.tsx
│   └── shared/  # Shared across features
│       └── components/
├── pages/
│   ├── auth/      # Authentication pages (shared)
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   └── user/      # User-facing pages
│       ├── Profile.tsx
│       └── UserHome.tsx
├── components/
│   ├── admin/     # Admin-specific shared components
│   ├── common/    # Shared across all
│   ├── ui/        # Reusable UI primitives
│   └── icons/     # Icon components
```

## Migration Steps

1. **Create feature folder structure**
2. **Move files to appropriate features**
3. **Update all imports in routes/admin.tsx**
4. **Update any other imports referencing old paths**
5. **Remove old `src/pages/admin/` folder**
6. **Update documentation**

## Benefits

- Better code organization by feature
- Easier to find related files
- Better scalability
- Follows modern React project structure patterns

## Risks

- Breaking imports (mitigated by systematic updates)
- Need to test all routes
- Temporary build errors during migration

## Execution Status

- [ ] Structure created
- [ ] Files moved
- [ ] Imports updated
- [ ] Old folders removed
- [ ] Documentation updated
