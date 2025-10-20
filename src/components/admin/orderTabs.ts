import type { TabItem } from '@/components/admin/OrderTabMenu';

export const orderTabs: TabItem[] = [
    { id: 'all', label: 'Tất cả', count: 100 },
    { id: 'pending', label: 'Chờ xác nhận', count: 15 },
    { id: 'confirmed', label: 'Đã xác nhận', count: 25 },
    { id: 'shipping', label: 'Đang giao', count: 30 },
    { id: 'completed', label: 'Đã hoàn thành', count: 20 },
    { id: 'returned', label: 'Trả hàng/Hoàn tiền/Hủy', count: 10 },
];


