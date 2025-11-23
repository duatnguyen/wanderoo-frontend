// Shared orders data for OrdersTab and OrderDetailTab

export type OrderStatus =
  | "all"
  | "pending"
  | "confirmed"
  | "shipping"
  | "delivered"
  | "cancelled"
  | "return";

export type OrderProduct = {
  id: string;
  imageUrl: string;
  name: string;
  price: number;
  originalPrice?: number;
  variant?: string;
  variantColor?: string;
};

export type Order = {
  id: string;
  orderDate: string;
  status: OrderStatus;
  statusLabel: string;
  products: OrderProduct[];
  totalPayment: number;
};

// Mock orders data - shared between OrdersTab and OrderDetailTab
export const ordersData: Order[] = [
  // Pending orders
  {
    id: "WB0303168601",
    orderDate: "28/08/2025",
    status: "pending",
    statusLabel: "Chờ xác nhận",
    products: [
      {
        id: "p1",
        imageUrl: "",
        name: "Ba lô trekking 40L chống nước",
        price: 850000,
        originalPrice: 1200000,
        variant: "Đen",
        variantColor: "gray",
      },
      {
        id: "p2",
        imageUrl: "",
        name: "Giày leo núi cao cổ",
        price: 1200000,
        originalPrice: 1500000,
        variant: "Nâu, Size 42",
      },
    ],
    totalPayment: 2050000,
  },
  {
    id: "WB0303168602",
    orderDate: "27/08/2025",
    status: "pending",
    statusLabel: "Chờ xác nhận",
    products: [
      {
        id: "p3",
        imageUrl: "",
        name: "Túi ngủ mùa đông 3 mùa",
        price: 650000,
        originalPrice: 890000,
      },
    ],
    totalPayment: 650000,
  },

  // Confirmed orders
  {
    id: "WB0303168603",
    orderDate: "26/08/2025",
    status: "confirmed",
    statusLabel: "Đã xác nhận",
    products: [
      {
        id: "c1",
        imageUrl: "",
        name: "Bếp gas du lịch mini",
        price: 450000,
        originalPrice: 650000,
        variant: "Cam",
        variantColor: "orange",
      },
      {
        id: "c2",
        imageUrl: "",
        name: "Bộ nồi nấu ăn 3 món",
        price: 320000,
        originalPrice: 450000,
      },
      {
        id: "c3",
        imageUrl: "",
        name: "Đèn pin LED siêu sáng",
        price: 280000,
        originalPrice: 380000,
      },
    ],
    totalPayment: 1050000,
  },
  {
    id: "WB0303168604",
    orderDate: "25/08/2025",
    status: "confirmed",
    statusLabel: "Đã xác nhận",
    products: [
      {
        id: "c4",
        imageUrl: "",
        name: "Ghế xếp du lịch nhẹ",
        price: 320000,
        originalPrice: 450000,
      },
    ],
    totalPayment: 320000,
  },

  // Shipping orders
  {
    id: "WB0303168605",
    orderDate: "24/08/2025",
    status: "shipping",
    statusLabel: "Đang vận chuyển",
    products: [
      {
        id: "s1",
        imageUrl: "",
        name: "Áo khoác gió chống nước",
        price: 750000,
        originalPrice: 950000,
        variant: "Xanh navy",
        variantColor: "blue",
      },
      {
        id: "s2",
        imageUrl: "",
        name: "Quần leo núi chống nước",
        price: 680000,
        originalPrice: 850000,
        variant: "Đen, Size M",
      },
      {
        id: "s3",
        imageUrl: "",
        name: "Mũ chống nắng",
        price: 150000,
        originalPrice: 200000,
      },
      {
        id: "s4",
        imageUrl: "",
        name: "Găng tay leo núi",
        price: 180000,
        originalPrice: 250000,
      },
    ],
    totalPayment: 1760000,
  },
  {
    id: "WB0303168606",
    orderDate: "23/08/2025",
    status: "shipping",
    statusLabel: "Đang vận chuyển",
    products: [
      {
        id: "s5",
        imageUrl: "",
        name: "Bộ dụng cụ đa năng",
        price: 180000,
        originalPrice: 250000,
      },
      {
        id: "s6",
        imageUrl: "",
        name: "Bình nước thể thao 1L",
        price: 120000,
        originalPrice: 180000,
      },
    ],
    totalPayment: 300000,
  },

  // Delivered orders
  {
    id: "WB0303168523",
    orderDate: "22/08/2025",
    status: "delivered",
    statusLabel: "Đã giao hàng",
    products: [
      {
        id: "d1",
        imageUrl: "",
        name: "Lều mái vòm cho 2 người - MT500 xám (SIMOND)",
        price: 1200000,
        originalPrice: 1500000,
      },
      {
        id: "d2",
        imageUrl: "",
        name: "Túi ngủ mùa đông giữ nhiệt",
        price: 890000,
        originalPrice: 1200000,
      },
      {
        id: "d3",
        imageUrl: "",
        name: "Thảm cắm trại chống thấm",
        price: 450000,
        originalPrice: 650000,
      },
      {
        id: "d4",
        imageUrl: "",
        name: "Đèn lều LED",
        price: 250000,
        originalPrice: 350000,
      },
      {
        id: "d5",
        imageUrl: "",
        name: "Dây căng lều",
        price: 80000,
        originalPrice: 120000,
      },
    ],
    totalPayment: 2870000,
  },
  {
    id: "WB0303168524",
    orderDate: "21/08/2025",
    status: "delivered",
    statusLabel: "Đã giao hàng",
    products: [
      {
        id: "d6",
        imageUrl: "",
        name: "Lều cắm trại 222 người - MH100 trắng/Xanh (QUECHUA)",
        price: 199000,
        originalPrice: 230000,
      },
    ],
    totalPayment: 199000,
  },
  {
    id: "WB0303168525",
    orderDate: "20/08/2025",
    status: "delivered",
    statusLabel: "Đã giao hàng",
    products: [
      {
        id: "d7",
        imageUrl: "",
        name: "Lều cắm trại 3 người - MH100 trắng/Xanh",
        price: 199000,
        originalPrice: 330000,
        variant: "Đen",
        variantColor: "gray",
      },
      {
        id: "d8",
        imageUrl: "",
        name: "Gậy leo núi có đệm lò xo",
        price: 450000,
        originalPrice: 600000,
        variant: "Xám",
      },
    ],
    totalPayment: 649000,
  },
  {
    id: "WB0303168615",
    orderDate: "19/08/2025",
    status: "delivered",
    statusLabel: "Đã giao hàng",
    products: [
      {
        id: "d9",
        imageUrl: "",
        name: "Ba lô leo núi 35L siêu nhẹ",
        price: 1250000,
        originalPrice: 1650000,
        variant: "Xanh navy",
      },
      {
        id: "d10",
        imageUrl: "",
        name: "Bộ quần áo trekking chống thấm",
        price: 820000,
        originalPrice: 1090000,
        variant: "Đen, Size L",
      },
    ],
    totalPayment: 2070000,
  },
  {
    id: "WB0303168616",
    orderDate: "18/08/2025",
    status: "delivered",
    statusLabel: "Đã giao hàng",
    products: [
      {
        id: "d11",
        imageUrl: "",
        name: "Đèn lều sạc năng lượng mặt trời",
        price: 360000,
        originalPrice: 520000,
      },
      {
        id: "d12",
        imageUrl: "",
        name: "Bộ dụng cụ sửa chữa đa năng 12 món",
        price: 480000,
        originalPrice: 720000,
      },
      {
        id: "d13",
        imageUrl: "",
        name: "Thảm ngủ chống ẩm cao cấp",
        price: 650000,
        originalPrice: 890000,
      },
    ],
    totalPayment: 1490000,
  },

  // Cancelled orders
  {
    id: "WB0303168522",
    orderDate: "19/08/2025",
    status: "cancelled",
    statusLabel: "Đã hủy",
    products: [
      {
        id: "ca1",
        imageUrl: "",
        name: "Lều Dã Ngoại Bền Đẹp Rằn ri - Đồ Câu Simano",
        price: 199000,
        originalPrice: 230000,
        variant: "xanh",
        variantColor: "green",
      },
    ],
    totalPayment: 199000,
  },
  {
    id: "WB0303168607",
    orderDate: "18/08/2025",
    status: "cancelled",
    statusLabel: "Đã hủy",
    products: [
      {
        id: "ca2",
        imageUrl: "",
        name: "Ba lô du lịch 50L",
        price: 1290000,
        originalPrice: 1800000,
        variant: "Xanh",
        variantColor: "blue",
      },
      {
        id: "ca3",
        imageUrl: "",
        name: "Vali du lịch 24 inch",
        price: 2200000,
        originalPrice: 3000000,
      },
      {
        id: "ca4",
        imageUrl: "",
        name: "Túi đựng giày du lịch",
        price: 150000,
        originalPrice: 200000,
      },
    ],
    totalPayment: 3640000,
  },

  // Return/Refund orders
  {
    id: "WB0303168608",
    orderDate: "17/08/2025",
    status: "return",
    statusLabel: "Yêu cầu đang được xem xét",
    products: [
      {
        id: "r1",
        imageUrl: "",
        name: "Giày thể thao leo núi CAMEL CROWN",
        price: 1000000,
        originalPrice: 1300000,
        variant: "Xám, Size 38",
      },
      {
        id: "r2",
        imageUrl: "",
        name: "Tất xỏ ngón chạy bộ",
        price: 120000,
        originalPrice: 180000,
        variant: "Đen, Size 36",
      },
    ],
    totalPayment: 1120000,
  },
  {
    id: "WB0303168609",
    orderDate: "16/08/2025",
    status: "return",
    statusLabel: "Chấp nhận yêu cầu",
    products: [
      {
        id: "r3",
        imageUrl: "",
        name: "Bếp nướng BBQ đa năng",
        price: 650000,
        originalPrice: 1200000,
      },
      {
        id: "r4",
        imageUrl: "",
        name: "Bộ đồ nấu ăn du lịch 8 món",
        price: 450000,
        originalPrice: 850000,
      },
      {
        id: "r5",
        imageUrl: "",
        name: "Kìm đa năng",
        price: 180000,
        originalPrice: 250000,
      },
      {
        id: "r6",
        imageUrl: "",
        name: "Dao đa năng",
        price: 120000,
        originalPrice: 180000,
      },
      {
        id: "r7",
        imageUrl: "",
        name: "Đèn pin cầm tay",
        price: 200000,
        originalPrice: 300000,
      },
    ],
    totalPayment: 1600000,
  },
  {
    id: "WB0303168613",
    orderDate: "16/08/2025",
    status: "return",
    statusLabel: "Yêu cầu đang được xem xét",
    products: [
      {
        id: "r13a",
        imageUrl: "",
        name: "Bộ quần áo trekking ấm",
        price: 780000,
        originalPrice: 990000,
        variant: "Xanh rêu, Size M",
      },
      {
        id: "r13b",
        imageUrl: "",
        name: "Tất len giữ nhiệt",
        price: 95000,
        originalPrice: 130000,
        variant: "Xám, Size 39-41",
      },
    ],
    totalPayment: 875000,
  },
  {
    id: "WB0303168614",
    orderDate: "15/08/2025",
    status: "return",
    statusLabel: "Chấp nhận yêu cầu",
    products: [
      {
        id: "r14a",
        imageUrl: "",
        name: "Đèn pin đội đầu chống nước",
        price: 450000,
        originalPrice: 620000,
      },
      {
        id: "r14b",
        imageUrl: "",
        name: "Áo khoác gió siêu nhẹ",
        price: 690000,
        originalPrice: 980000,
        variant: "Cam, Size L",
      },
    ],
    totalPayment: 1140000,
  },
  {
    id: "WB0303168610",
    orderDate: "15/08/2025",
    status: "return",
    statusLabel: "Trả hàng",
    products: [
      {
        id: "r8",
        imageUrl: "",
        name: "Bộ áo mưa du lịch",
        price: 320000,
        originalPrice: 450000,
        variant: "Xanh navy",
      },
      {
        id: "r9",
        imageUrl: "",
        name: "Giày trekking chống nước",
        price: 980000,
        originalPrice: 1250000,
        variant: "Đen, Size 41",
      },
    ],
    totalPayment: 1300000,
  },
  {
    id: "WB0303168611",
    orderDate: "14/08/2025",
    status: "return",
    statusLabel: "Kiểm tra hàng hoàn",
    products: [
      {
        id: "r10",
        imageUrl: "",
        name: "Áo khoác giữ nhiệt UltraWarm",
        price: 1150000,
        originalPrice: 1490000,
        variant: "Xám, Size L",
      },
      {
        id: "r11",
        imageUrl: "",
        name: "Quần trekking softshell",
        price: 780000,
        originalPrice: 1020000,
        variant: "Đen, Size 32",
      },
    ],
    totalPayment: 1930000,
  },
  {
    id: "WB0303168612",
    orderDate: "13/08/2025",
    status: "return",
    statusLabel: "Đã hoàn tiền",
    products: [
      {
        id: "r12",
        imageUrl: "",
        name: "Thảm ngủ hơi NatureHike",
        price: 890000,
        originalPrice: 1190000,
      },
      {
        id: "r13",
        imageUrl: "",
        name: "Bếp cồn mini",
        price: 280000,
        originalPrice: 420000,
      },
    ],
    totalPayment: 1170000,
  },
];

// Helper function to get order by ID
export const getOrderById = (orderId: string): Order | undefined => {
  return ordersData.find((order) => order.id === orderId);
};
