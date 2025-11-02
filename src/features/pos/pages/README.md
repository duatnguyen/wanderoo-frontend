# POS Pages Structure

## 📁 Cấu trúc mới theo chức năng

### `/sales` - Bán hàng
- `POSSales.tsx` - Giao diện bán hàng chính với cart, product list

### `/orders` - Quản lý đơn hàng  
- `OrderManagement.tsx` - Tra cứu và quản lý đơn hàng đã tạo

### `/returns` - Trả hàng
- `ReturnOrderManagement.tsx` - Quản lý các đơn trả hàng
- `CreateReturnOrder.tsx` - Tạo đơn trả hàng mới

### `/inventory` - Kho hàng
- `InventoryLookup.tsx` - Tra cứu tồn kho sản phẩm

### `/cashbook` - Sổ quỹ
- `CashBook.tsx` - Quản lý sổ quỹ, theo dõi thu chi

## 🔄 Import Structure

Mỗi thư mục có file `index.ts` để export default component:

```typescript
// Before: Long import paths
import POSSales from "../../features/pos/pages/POSSales";

// After: Clean organized imports  
import POSSales from "../../features/pos/pages/sales";
import OrderManagement from "../../features/pos/pages/orders";
```

## ✅ Benefits

1. **Feature-based organization** - Dễ tìm và maintain
2. **Scalability** - Có thể thêm nhiều file vào mỗi feature
3. **Clean imports** - Import paths ngắn gọn hơn
4. **Future expansion** - Có thể thêm components, hooks, types cho mỗi feature

## 🚀 Usage in Routes

```typescript
// routes.pos.tsx
const POSSales = lazy(() => import("../../features/pos/pages/sales"));
const OrderManagement = lazy(() => import("../../features/pos/pages/orders")); 
// ... etc
```