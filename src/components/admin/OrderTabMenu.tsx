import { cn } from '@/lib/utils';
import { CardContent } from '@/components/ui/card';

export interface TabItem {
    id: string;
    label: string;
    count?: number;
    color?: string;
}

interface OrderTabMenuProps {
    tabs: TabItem[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
    className?: string;
}

export function OrderTabMenu({ tabs, activeTab, onTabChange, className }: OrderTabMenuProps) {
    return (
        <CardContent className="p-0">
            <div className="flex items-center justify-between gap-2 bg-card dark:bg-card rounded-lg overflow-hidden p-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={cn(
                            "px-3 py-1 text-sm font-medium text-center transition-all duration-200 relative whitespace-nowrap rounded-md",
                            "hover:bg-gray-100 dark:hover:bg-gray-700",
                            activeTab === tab.id
                                ? "text-white bg-black dark:text-black dark:bg-white"
                                : "text-gray-600 dark:text-gray-400"
                        )}
                    >
                        <span className="flex items-center justify-center gap-1.5">
                            {tab.label}
                            {tab.count !== undefined && (
                                <span
                                    className={cn(
                                        "inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-xs font-medium min-w-[18px] h-4",
                                        activeTab === tab.id
                                            ? "bg-white text-black dark:bg-black dark:text-white"
                                            : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                                    )}
                                >
                                    {tab.count}
                                </span>
                            )}
                        </span>
                    </button>
                ))}
            </div>
        </CardContent>
    );
}

// Default tabs data cho đơn hàng
export const orderTabs: TabItem[] = [
    {
        id: 'all',
        label: 'Tất cả',
        count: 100
    },
    {
        id: 'pending',
        label: 'Chờ xác nhận',
        count: 15
    },
    {
        id: 'confirmed',
        label: 'Đã xác nhận',
        count: 25
    },
    {
        id: 'shipping',
        label: 'Đang giao',
        count: 30
    },
    {
        id: 'completed',
        label: 'Đã hoàn thành',
        count: 20
    },
    {
        id: 'returned',
        label: 'Trả hàng/Hoàn tiền/Hủy',
        count: 10
    }
];