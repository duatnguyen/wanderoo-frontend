# POS Router System Documentation

## Overview
Hệ thống router POS đã được tái cấu trúc để cung cấp navigation có tổ chức và type-safe cho ứng dụng Point of Sale.

## Cấu trúc Files

```
src/app/router/
├── index.tsx                 # Main router configuration
├── routes.pos.tsx           # POS-specific routes
├── routes.admin.tsx         # Admin routes  
├── routes.user.tsx          # User routes
├── routes.constants.ts      # Route constants and paths
├── router.utils.ts          # Navigation utilities and hooks
└── guards/
    ├── AuthGuard.tsx       # Authentication guard
    ├── RoleGuard.tsx       # Role-based access guard
    └── POSGuard.tsx        # POS-specific access guard
```

## POS Routes

### Cấu trúc Routes
```
/pos/                        # Base POS route (redirects to sales)
├── sales                    # Main POS sales interface
├── orders                   # Order management
├── inventory                # Inventory lookup
├── returns/                 # Return order management
│   ├── (index)             # Return orders list
│   └── create/:orderId     # Create return for specific order
├── cashbook                # Cash book / financial management
└── *                       # Catch-all (redirects to sales)
```

### Route Constants
Sử dụng các constants từ `routes.constants.ts`:

```typescript
import { POS_ROUTES } from '@/app/router/routes.constants';

// Navigation examples:
navigate(POS_ROUTES.SALES);                    // /pos/sales
navigate(POS_ROUTES.ORDERS);                   // /pos/orders
navigate(POS_ROUTES.RETURNS.BASE);             // /pos/returns
navigate(POS_ROUTES.RETURNS.CREATE('12345')); // /pos/returns/create/12345
```

## Navigation Hooks

### usePOSNavigation()
Hook chuyên dụng cho POS navigation:

```typescript
import { usePOSNavigation } from '@/app/router/router.utils';

const MyComponent = () => {
  const posNav = usePOSNavigation();
  
  // Navigation methods
  const handleGoToSales = () => posNav.goToSales();
  const handleGoToOrders = () => posNav.goToOrders();
  const handleCreateReturn = (orderId: string) => posNav.goToCreateReturn(orderId);
  
  // Current route checks
  const isOnSalesPage = posNav.isOnSales();
  const isOnOrdersPage = posNav.isOnOrders();
  
  // Current path
  const currentPath = posNav.currentPath;
};
```

### Các Navigation Hooks khác
- `useAdminNavigation()` - Admin navigation
- `useUserNavigation()` - User navigation  
- `useAuthNavigation()` - Auth navigation

## Breadcrumb System

### Breadcrumb Component
```typescript
import { Breadcrumb, POSBreadcrumb } from '@/components/common';

// General breadcrumb
<Breadcrumb className="my-4" showHome={true} />

// POS-specific breadcrumb with styling
<POSBreadcrumb className="border-b" />
```

### useBreadcrumb Hook
```typescript
import { useBreadcrumb } from '@/app/router/router.utils';

const MyComponent = () => {
  const { breadcrumbs, currentPath } = useBreadcrumb();
  
  // breadcrumbs array contains:
  // [{ label: 'POS System', path: '/pos' }, { label: 'Sales', path: '/pos/sales' }]
};
```

## Route Guards

### POSGuard
Bảo vệ các routes POS với authentication và authorization:

```typescript
// Tự động áp dụng trong router config
{
  path: "/pos",
  element: (
    <POSGuard>
      <POSLayout />
    </POSGuard>
  ),
  children: posRoutes,
}
```

### Guard Utilities
```typescript
import { routeGuards } from '@/app/router/router.utils';

// Auth checks
const isAuthenticated = routeGuards.requireAuth(user);
const hasAdminRole = routeGuards.requireRole(user, 'admin');
const hasPOSPermission = routeGuards.requirePermission(user, 'pos_access');
```

## Best Practices

### 1. Sử dụng Route Constants
```typescript
// ✅ Good
navigate(POS_ROUTES.SALES);

// ❌ Avoid
navigate('/pos/sales');
```

### 2. Sử dụng Navigation Hooks
```typescript
// ✅ Good
const posNav = usePOSNavigation();
posNav.goToOrders();

// ❌ Avoid
navigate('/pos/orders');
```

### 3. Type-safe Route Parameters
```typescript
// ✅ Good
const createReturnPath = POS_ROUTES.RETURNS.CREATE(orderId);

// ❌ Avoid
const createReturnPath = `/pos/returns/create/${orderId}`;
```

### 4. Route Checks
```typescript
// ✅ Good
const posNav = usePOSNavigation();
if (posNav.isOnSales()) {
  // Do something specific to sales page
}

// ❌ Avoid
if (location.pathname === '/pos/sales') {
  // Less maintainable
}
```

## Lazy Loading

Tất cả POS pages đều được lazy load để tối ưu performance:

```typescript
const POSSales = lazy(() => import("../../features/pos/pages/POSSales"));

// Wrapped with LazyWrapper for consistent loading UI
<LazyWrapper>
  <POSSales />
</LazyWrapper>
```

## Integration với Layout

POS routes tích hợp với `POSLayout` để cung cấp:
- Consistent sidebar navigation
- Header with current page info
- Breadcrumb navigation
- Context management (POSContext)

## Future Enhancements

1. **Authentication Integration**: Kết nối với hệ thống auth thực tế
2. **Permission-based Routes**: Fine-grained permissions cho từng tính năng
3. **Route Analytics**: Tracking user navigation patterns
4. **Deep Linking**: Support cho bookmark và share URLs
5. **Route Preloading**: Preload critical routes for better performance

## Troubleshooting

### Common Issues

1. **Route not found**: Kiểm tra route path trong `routes.pos.tsx`
2. **Navigation không hoạt động**: Đảm bảo sử dụng navigation hooks đúng cách
3. **Breadcrumb không hiển thị**: Kiểm tra breadcrumb logic trong `router.utils.ts`
4. **Permission denied**: Kiểm tra POSGuard và user permissions

### Debug Tips

```typescript
// Log current route info
const posNav = usePOSNavigation();
console.log('Current path:', posNav.currentPath);

// Log breadcrumb data
const { breadcrumbs } = useBreadcrumb();
console.log('Breadcrumbs:', breadcrumbs);
```