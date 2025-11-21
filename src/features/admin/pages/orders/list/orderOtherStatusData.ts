import type { OrderTableColumn } from "@/components/common";
import type { ChipStatusKey } from "@/components/ui/chip-status";

export type OrderCategory = "RETURN" | "CANCEL" | "FAILED";
export type ReturnStatus =
  | "PENDING_REVIEW"
  | "RETURNING"
  | "REFUNDED"
  | "INVALID";

export interface OrderProduct {
  id: string;
  name: string;
  variant?: string;
  quantity: number;
  price: number;
  image?: string;
  classification?: string;
}

export interface ShippingInfo {
  label: string;
  chip: ChipStatusKey;
  note?: string;
  timeline?: string[];
}

export interface OrderAddresses {
  receivingAddress: string;
  customerReturnAddress: string;
  shopWarehouseAddress: string;
}

export interface RefundAccountInfo {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  email?: string;
  note?: string;
}

export interface OtherStatusOrder {
  id: string;
  orderCode: string;
  relatedOrderCode?: string;
  customerId: string;
  customerName: string;
  source: "Website" | "POS";
  sourceNote: string;
  category: OrderCategory;
  statusKey: ReturnStatus;
  statusLabel: string;
  statusDescription: string;
  reason: string;
  reasonTags?: string[];
  optionDescription: string;
  options: string[];
  preferredResolution?: string;
  products: OrderProduct[];
  refundAmount: number;
  forwardShipping: ShippingInfo;
  returnShipping: ShippingInfo;
  lastUpdated: string;
  addresses?: OrderAddresses;
  refundAccount?: RefundAccountInfo;
  evidenceImages?: string[];
}

export const STATUS_CHIP_MAP: Record<ReturnStatus, ChipStatusKey> = {
  PENDING_REVIEW: "pending",
  RETURNING: "return",
  REFUNDED: "completed",
  INVALID: "cancelled",
};

export type TableColumnId =
  | "product"
  | "amount"
  | "reason"
  | "resolution"
  | "status"
  | "forward"
  | "return"
  | "source"
  | "action";

export type ReturnTableColumn = OrderTableColumn & { id: TableColumnId };

export const TABLE_COLUMNS: ReturnTableColumn[] = [
  {
    id: "product",
    title: "Sản phẩm",
    width: "flex-1",
    minWidth: "min-w-[320px]",
    className: "justify-start",
  },
  {
    id: "amount",
    title: "Số tiền",
    width: "w-[170px]",
    minWidth: "min-w-[160px]",
    className: "justify-start",
  },
  {
    id: "reason",
    title: "Lý do",
    width: "w-[210px]",
    minWidth: "min-w-[200px]",
    className: "justify-start",
  },
  {
    id: "resolution",
    title: "Phương án cho Người mua",
    width: "w-[230px]",
    minWidth: "min-w-[220px]",
    className: "justify-start",
  },
  {
    id: "status",
    title: "Trạng thái",
    width: "w-[180px]",
    minWidth: "min-w-[170px]",
    className: "justify-start",
  },
  {
    id: "forward",
    title: "Vận chuyển chiều giao hàng",
    width: "w-[220px]",
    minWidth: "min-w-[210px]",
    className: "justify-start",
  },
  {
    id: "return",
    title: "Vận chuyển hàng hoàn",
    width: "w-[220px]",
    minWidth: "min-w-[210px]",
    className: "justify-start",
  },
  {
    id: "source",
    title: "Nguồn đơn",
    width: "w-[140px]",
    minWidth: "min-w-[130px]",
    className: "justify-start",
  },
  {
    id: "action",
    title: "Thao tác",
    width: "w-[150px]",
    minWidth: "min-w-[140px]",
    className: "justify-start",
  },
];

export const otherStatusOrders: OtherStatusOrder[] = [
  {
    id: "RET-23001",
    orderCode: "WEB-2023301",
    relatedOrderCode: "JSSJQWSHW",
    customerId: "KH-20321",
    customerName: "Lê Thị Mai",
    source: "Website",
    sourceNote: "Khách đặt qua website chính thức",
    category: "RETURN",
    statusKey: "PENDING_REVIEW",
    statusLabel: "Đang chờ xét duyệt",
    statusDescription:
      "Yêu cầu đang được bộ phận vận hành kiểm tra chứng cứ và tồn kho.",
    reason:
      "Khách phản hồi sản phẩm giao không đúng mô tả và thiếu phụ kiện trong hộp.",
    reasonTags: ["Sai mô tả", "Thiếu phụ kiện"],
    optionDescription: "Có 2 phương án do người mua chọn:",
    options: ["Trả hàng & hoàn tiền", "Hoàn tiền ngay"],
    preferredResolution: "Trả hàng & hoàn tiền",
    products: [
      {
        id: "P-01",
        name: "Giày thể thao Wanderoo Runner Pro",
        variant: "Màu Đỏ / Size 39",
        quantity: 1,
        price: 899000,
        image: "https://placehold.co/60x60/png",
        classification: "Giày thể thao",
      },
      {
        id: "P-02",
        name: "Tất cổ cao Everyday Performance",
        variant: "Free size",
        quantity: 2,
        price: 325000,
        image: "https://placehold.co/60x60/png",
        classification: "Phụ kiện",
      },
    ],
    refundAmount: 1549000,
    forwardShipping: {
      label: "Đã hoàn thành",
      chip: "completed",
      note: "Các trạng thái sau:",
      timeline: [
        "Chờ xử lý hàng",
        "Đang giao",
        "Đã hoàn thành",
        "Giao thất bại",
      ],
    },
    returnShipping: {
      label: "Đã hoàn thành",
      chip: "completed",
      note: "Bưu tá đã nhận lại hàng từ khách và chờ nhập kho.",
    },
    lastUpdated: "20/11/2025 10:15",
    addresses: {
      receivingAddress: "12 Nguyễn Du, Phường Bến Nghé, Quận 1, TP. HCM",
      customerReturnAddress:
        "Kho Wanderoo - 555 Điện Biên Phủ, Quận 3, TP. HCM",
      shopWarehouseAddress:
        "Trung tâm hoàn hàng Wanderoo - 48 Tân Kỳ Tân Quý, Quận Tân Phú, TP. HCM",
    },
    refundAccount: {
      bankName: "MB Bank",
      accountNumber: "0788 345 678",
      accountHolder: "LE THI MAI",
      email: "lethimai@email.com",
    },
    evidenceImages: [
      "https://placehold.co/80x80/png",
      "https://placehold.co/80x80/png",
      "https://placehold.co/80x80/png",
    ],
  },
  {
    id: "RET-23002",
    orderCode: "POS-563820",
    relatedOrderCode: "POS-563820",
    customerId: "KH-56718",
    customerName: "Trần Quốc Toàn",
    source: "POS",
    sourceNote: "Phiếu tạo trực tiếp tại cửa hàng Wanderoo Hub",
    category: "RETURN",
    statusKey: "REFUNDED",
    statusLabel: "Đã hoàn tiền 1 phần",
    statusDescription:
      "Đã hoàn 50% giá trị đơn bằng tiền mặt theo yêu cầu khách.",
    reason: "Khách trả vì sai size so với đặt giữ hàng online.",
    optionDescription: "Có 1 phương án do người mua chọn:",
    options: ["Trả hàng & hoàn tiền"],
    preferredResolution: "Trả hàng & hoàn tiền",
    products: [
      {
        id: "P-03",
        name: "Áo khoác gió Wanderoo City Ride",
        variant: "Màu Navy / Size M",
        quantity: 1,
        price: 899000,
        image: "https://placehold.co/60x60/png",
        classification: "Áo khoác",
      },
    ],
    refundAmount: 450000,
    forwardShipping: {
      label: "Với ở POS sẽ luôn đã hoàn thành",
      chip: "completed",
      note: "POS xử lý giao/nhận hàng ngay tại quầy.",
    },
    returnShipping: {
      label: "Hoàn tiền tại quầy",
      chip: "return",
      note: "Nhân viên đã xác nhận hoàn tiền trực tiếp.",
    },
    lastUpdated: "18/11/2025 14:42",
    addresses: {
      receivingAddress: "140 Nguyễn Thị Minh Khai, Quận 3, TP. HCM",
      customerReturnAddress: "Quầy Wanderoo Hub - 22 Nguyễn Huệ, Quận 1",
      shopWarehouseAddress:
        "Trung tâm hoàn hàng Wanderoo - 48 Tân Kỳ Tân Quý, Quận Tân Phú, TP. HCM",
    },
    refundAccount: {
      bankName: "Vietcombank",
      accountNumber: "0011 8899 5566",
      accountHolder: "TRAN QUOC TOAN",
    },
  },
  {
    id: "CAN-7821",
    orderCode: "WEB-88901",
    relatedOrderCode: "WEB-88901",
    customerId: "KH-90821",
    customerName: "Đặng Quỳnh Nhi",
    source: "Website",
    sourceNote: "Khách tự hủy trước khi đóng gói.",
    category: "CANCEL",
    statusKey: "INVALID",
    statusLabel: "Yêu cầu bị hủy",
    statusDescription: "Đơn đã hủy theo yêu cầu khách, chờ hoàn tiền tự động.",
    reason: "Khách thay đổi kế hoạch mua sắm, muốn hủy toàn bộ đơn.",
    optionDescription: "Có 1 phương án áp dụng:",
    options: ["Hoàn tiền về phương thức thanh toán ban đầu"],
    products: [
      {
        id: "P-04",
        name: "Bộ quần áo chạy bộ Wanderoo Sprint",
        variant: "Màu Đen / Size L",
        quantity: 1,
        price: 1099000,
        image: "https://placehold.co/60x60/png",
        classification: "Trang phục thể thao",
      },
    ],
    refundAmount: 1099000,
    forwardShipping: {
      label: "Chưa giao hàng",
      chip: "pending",
      note: "Đơn hủy trước khi bàn giao cho đối tác vận chuyển.",
    },
    returnShipping: {
      label: "Không áp dụng",
      chip: "default",
      note: "Đơn chưa rời kho nên không có hàng hoàn.",
    },
    lastUpdated: "17/11/2025 09:05",
    addresses: {
      receivingAddress: "112 Hoàng Hoa Thám, Ba Đình, Hà Nội",
      customerReturnAddress: "Kho tổng Wanderoo - 25 Láng Hạ, Đống Đa",
      shopWarehouseAddress:
        "Trung tâm hoàn hàng Wanderoo - 230 Phạm Văn Đồng, Bắc Từ Liêm",
    },
    refundAccount: {
      bankName: "MB Bank",
      accountNumber: "0886 777 221",
      accountHolder: "DANG QUYNH NHI",
      email: "dangnhi@gmail.com",
    },
  },
  {
    id: "FAIL-1290",
    orderCode: "WEB-77612",
    relatedOrderCode: "WEB-77612",
    customerId: "KH-67110",
    customerName: "Phạm Hữu Duy",
    source: "Website",
    sourceNote: "Giao qua đối tác GHTK",
    category: "FAILED",
    statusKey: "RETURNING",
    statusLabel: "Đang trả hàng",
    statusDescription: "Đơn giao không thành công, đang đưa hàng quay lại kho.",
    reason: "Người nhận không nghe máy trong 3 lần giao hàng.",
    optionDescription: "Có 2 phương án dự phòng:",
    options: [
      "Giữ hàng tại kho chờ khách xác nhận lại",
      "Hoàn tiền khi hàng quay về",
    ],
    products: [
      {
        id: "P-05",
        name: "Túi đeo chéo Wanderoo Urban Flow",
        variant: "Màu Olive",
        quantity: 1,
        price: 659000,
        image: "https://placehold.co/60x60/png",
        classification: "Phụ kiện",
      },
    ],
    refundAmount: 659000,
    forwardShipping: {
      label: "Đang giao lần 3",
      chip: "shipping",
      note: "Đối tác đã cố gắng giao 2/3 lần quy định.",
    },
    returnShipping: {
      label: "Đang hoàn hàng",
      chip: "return",
      note: "Đối tác đang đưa hàng trở lại kho Wanderoo.",
    },
    lastUpdated: "19/11/2025 08:20",
    addresses: {
      receivingAddress: "75 Nguyễn Văn Lượng, Gò Vấp, TP. HCM",
      customerReturnAddress: "Kho Wanderoo - 555 Điện Biên Phủ, Quận 3",
      shopWarehouseAddress:
        "Trung tâm hoàn hàng Wanderoo - 48 Tân Kỳ Tân Quý, Quận Tân Phú",
    },
    refundAccount: {
      bankName: "VPBank",
      accountNumber: "1386 2200 8899",
      accountHolder: "PHAM HUU DUY",
    },
  },
  {
    id: "RET-23003",
    orderCode: "WEB-445612",
    relatedOrderCode: "WEB-445612",
    customerId: "KH-33456",
    customerName: "Nguyễn Văn An",
    source: "Website",
    sourceNote: "Khách đặt qua website, thanh toán qua MoMo",
    category: "RETURN",
    statusKey: "RETURNING",
    statusLabel: "Đang trả hàng",
    statusDescription:
      "Yêu cầu đã được xét duyệt - Đã giao thành công đơn trả hàng - Chờ kiểm hàng",
    reason:
      "Sản phẩm bị lỗi sản xuất, có vết nứt trên thân giày và đế bị bong tróc.",
    reasonTags: ["Lỗi sản xuất", "Hư hỏng"],
    optionDescription: "Có 1 phương án do người mua chọn:",
    options: ["Trả hàng & hoàn tiền"],
    preferredResolution: "Trả hàng & hoàn tiền",
    products: [
      {
        id: "P-06",
        name: "Giày chạy bộ Wanderoo Trail Master",
        variant: "Màu Xám / Size 42",
        quantity: 1,
        price: 1299000,
        image: "https://placehold.co/60x60/png",
        classification: "Giày thể thao",
      },
    ],
    refundAmount: 1299000,
    forwardShipping: {
      label: "Đã hoàn thành",
      chip: "completed",
      note: "Đã giao thành công đến khách hàng",
      timeline: [
        "Đơn hàng đã được xác nhận",
        "Đã đóng gói và bàn giao",
        "Đang vận chuyển",
        "Đã giao thành công",
      ],
    },
    returnShipping: {
      label: "Đã hoàn thành",
      chip: "completed",
      note: "Bưu tá đã nhận lại hàng từ khách và chờ nhập kho.",
      timeline: [
        "Khách đã gửi hàng trả",
        "Đối tác đã nhận hàng",
        "Đang vận chuyển về kho",
        "Đã nhận hàng tại kho - Chờ kiểm hàng",
      ],
    },
    lastUpdated: "21/11/2025 14:30",
    addresses: {
      receivingAddress: "88 Lê Lợi, Phường Bến Nghé, Quận 1, TP. HCM",
      customerReturnAddress:
        "Kho Wanderoo - 555 Điện Biên Phủ, Quận 3, TP. HCM",
      shopWarehouseAddress:
        "Trung tâm hoàn hàng Wanderoo - 48 Tân Kỳ Tân Quý, Quận Tân Phú, TP. HCM",
    },
    refundAccount: {
      bankName: "Techcombank",
      accountNumber: "1903 4567 8901",
      accountHolder: "NGUYEN VAN AN",
      email: "nguyenvanan@gmail.com",
    },
    evidenceImages: [
      "https://placehold.co/80x80/png",
      "https://placehold.co/80x80/png",
    ],
  },
  {
    id: "RET-23004",
    orderCode: "WEB-778923",
    relatedOrderCode: "WEB-778923",
    customerId: "KH-44567",
    customerName: "Hoàng Thị Lan",
    source: "Website",
    sourceNote: "Đặt hàng qua ứng dụng mobile",
    category: "RETURN",
    statusKey: "PENDING_REVIEW",
    statusLabel: "Đang chờ xét duyệt",
    statusDescription:
      "Yêu cầu mới được tạo, đang chờ bộ phận CSKH xem xét và phản hồi.",
    reason:
      "Khách hàng nhận được sản phẩm không đúng màu sắc như đã đặt, muốn đổi hoặc trả hàng.",
    reasonTags: ["Sai màu sắc", "Không đúng mô tả"],
    optionDescription: "Có 2 phương án do người mua chọn:",
    options: ["Đổi sản phẩm đúng màu", "Trả hàng & hoàn tiền"],
    preferredResolution: "Đổi sản phẩm đúng màu",
    products: [
      {
        id: "P-07",
        name: "Áo thun thể thao Wanderoo Active",
        variant: "Màu Xanh Navy / Size L",
        quantity: 2,
        price: 399000,
        image: "https://placehold.co/60x60/png",
        classification: "Trang phục thể thao",
      },
      {
        id: "P-08",
        name: "Quần short chạy bộ Wanderoo",
        variant: "Màu Đen / Size M",
        quantity: 1,
        price: 549000,
        image: "https://placehold.co/60x60/png",
        classification: "Trang phục thể thao",
      },
    ],
    refundAmount: 1347000,
    forwardShipping: {
      label: "Đã hoàn thành",
      chip: "completed",
      note: "Giao hàng thành công",
    },
    returnShipping: {
      label: "Chưa bắt đầu",
      chip: "pending",
      note: "Chờ xét duyệt yêu cầu trả hàng",
    },
    lastUpdated: "22/11/2025 09:15",
    addresses: {
      receivingAddress: "234 Nguyễn Trãi, Thanh Xuân, Hà Nội",
      customerReturnAddress: "Kho tổng Wanderoo - 25 Láng Hạ, Đống Đa, Hà Nội",
      shopWarehouseAddress:
        "Trung tâm hoàn hàng Wanderoo - 230 Phạm Văn Đồng, Bắc Từ Liêm, Hà Nội",
    },
    refundAccount: {
      bankName: "BIDV",
      accountNumber: "6501 2345 6789",
      accountHolder: "HOANG THI LAN",
      email: "hoangthilan@email.com",
    },
    evidenceImages: [
      "https://placehold.co/80x80/png",
      "https://placehold.co/80x80/png",
      "https://placehold.co/80x80/png",
      "https://placehold.co/80x80/png",
    ],
  },
  {
    id: "RET-23005",
    orderCode: "POS-892341",
    relatedOrderCode: "POS-892341",
    customerId: "KH-55678",
    customerName: "Võ Minh Tuấn",
    source: "POS",
    sourceNote: "Mua tại cửa hàng Wanderoo Hub Quận 7",
    category: "RETURN",
    statusKey: "REFUNDED",
    statusLabel: "Đã hoàn tiền toàn bộ",
    statusDescription:
      "Đã hoàn 100% giá trị đơn hàng về tài khoản ngân hàng của khách hàng.",
    reason: "Sản phẩm bị lỗi kỹ thuật, không thể sử dụng được.",
    optionDescription: "Có 1 phương án đã áp dụng:",
    options: ["Trả hàng & hoàn tiền"],
    preferredResolution: "Trả hàng & hoàn tiền",
    products: [
      {
        id: "P-09",
        name: "Đồng hồ thông minh Wanderoo Smart Watch",
        variant: "Màu Đen",
        quantity: 1,
        price: 2499000,
        image: "https://placehold.co/60x60/png",
        classification: "Phụ kiện điện tử",
      },
    ],
    refundAmount: 2499000,
    forwardShipping: {
      label: "Với ở POS sẽ luôn đã hoàn thành",
      chip: "completed",
      note: "Giao nhận tại quầy",
    },
    returnShipping: {
      label: "Đã hoàn tiền",
      chip: "completed",
      note: "Hoàn tiền trực tiếp tại quầy và đã nhận lại sản phẩm",
    },
    lastUpdated: "20/11/2025 16:45",
    addresses: {
      receivingAddress:
        "Cửa hàng Wanderoo Hub - 123 Nguyễn Thị Thập, Quận 7, TP. HCM",
      customerReturnAddress:
        "Cửa hàng Wanderoo Hub - 123 Nguyễn Thị Thập, Quận 7, TP. HCM",
      shopWarehouseAddress:
        "Trung tâm hoàn hàng Wanderoo - 48 Tân Kỳ Tân Quý, Quận Tân Phú, TP. HCM",
    },
    refundAccount: {
      bankName: "ACB",
      accountNumber: "1234 5678 9012",
      accountHolder: "VO MINH TUAN",
    },
  },
  {
    id: "RET-23006",
    orderCode: "WEB-334567",
    relatedOrderCode: "WEB-334567",
    customerId: "KH-66789",
    customerName: "Phan Thị Hương",
    source: "Website",
    sourceNote: "Đặt hàng online, thanh toán COD",
    category: "RETURN",
    statusKey: "RETURNING",
    statusLabel: "Đang trả hàng",
    statusDescription:
      "Yêu cầu đã được xét duyệt - Đã giao thành công đơn trả hàng - Chờ kiểm hàng",
    reason:
      "Sản phẩm không vừa size, khách đã thử nhưng quá chật, không thể sử dụng.",
    reasonTags: ["Không vừa size"],
    optionDescription: "Có 2 phương án do người mua chọn:",
    options: ["Đổi size khác", "Trả hàng & hoàn tiền"],
    preferredResolution: "Trả hàng & hoàn tiền",
    products: [
      {
        id: "P-10",
        name: "Giày sneaker Wanderoo Urban Classic",
        variant: "Màu Trắng / Size 38",
        quantity: 1,
        price: 799000,
        image: "https://placehold.co/60x60/png",
        classification: "Giày thể thao",
      },
      {
        id: "P-11",
        name: "Balo thể thao Wanderoo Sport",
        variant: "Màu Xám",
        quantity: 1,
        price: 899000,
        image: "https://placehold.co/60x60/png",
        classification: "Phụ kiện",
      },
    ],
    refundAmount: 1698000,
    forwardShipping: {
      label: "Đã hoàn thành",
      chip: "completed",
      note: "Giao hàng thành công",
      timeline: [
        "Xác nhận đơn hàng",
        "Đóng gói",
        "Vận chuyển",
        "Giao thành công",
      ],
    },
    returnShipping: {
      label: "Đã hoàn thành",
      chip: "completed",
      note: "Bưu tá đã nhận lại hàng từ khách và chờ nhập kho.",
      timeline: [
        "Khách đã gửi hàng",
        "Đối tác nhận hàng",
        "Vận chuyển về kho",
        "Đã nhận tại kho - Chờ kiểm hàng",
      ],
    },
    lastUpdated: "21/11/2025 11:20",
    addresses: {
      receivingAddress: "456 Trần Hưng Đạo, Phường 5, Quận 5, TP. HCM",
      customerReturnAddress:
        "Kho Wanderoo - 555 Điện Biên Phủ, Quận 3, TP. HCM",
      shopWarehouseAddress:
        "Trung tâm hoàn hàng Wanderoo - 48 Tân Kỳ Tân Quý, Quận Tân Phú, TP. HCM",
    },
    refundAccount: {
      bankName: "Sacombank",
      accountNumber: "0601 2345 6789",
      accountHolder: "PHAN THI HUONG",
      email: "phanhuong@gmail.com",
    },
    evidenceImages: ["https://placehold.co/80x80/png"],
  },
  {
    id: "RET-23007",
    orderCode: "WEB-112233",
    relatedOrderCode: "WEB-112233",
    customerId: "KH-77890",
    customerName: "Lý Văn Đức",
    source: "Website",
    sourceNote: "Khách hàng VIP, đặt qua hotline",
    category: "RETURN",
    statusKey: "INVALID",
    statusLabel: "Yêu cầu không hợp lệ",
    statusDescription:
      "Yêu cầu trả hàng đã bị từ chối do không đáp ứng điều kiện chính sách trả hàng.",
    reason:
      "Khách yêu cầu trả hàng vì không thích sản phẩm sau khi đã sử dụng 2 tuần.",
    reasonTags: ["Không thích sản phẩm"],
    optionDescription: "Yêu cầu đã bị từ chối:",
    options: [
      "Sản phẩm đã qua sử dụng, không đủ điều kiện trả hàng theo chính sách",
    ],
    products: [
      {
        id: "P-12",
        name: "Giày leo núi Wanderoo Mountain Pro",
        variant: "Màu Nâu / Size 41",
        quantity: 1,
        price: 1599000,
        image: "https://placehold.co/60x60/png",
        classification: "Giày thể thao",
      },
    ],
    refundAmount: 0,
    forwardShipping: {
      label: "Đã hoàn thành",
      chip: "completed",
      note: "Đã giao hàng thành công",
    },
    returnShipping: {
      label: "Không áp dụng",
      chip: "default",
      note: "Yêu cầu trả hàng không được chấp nhận",
    },
    lastUpdated: "19/11/2025 15:30",
    addresses: {
      receivingAddress: "789 Lý Tự Trọng, Phường Bến Nghé, Quận 1, TP. HCM",
      customerReturnAddress:
        "Kho Wanderoo - 555 Điện Biên Phủ, Quận 3, TP. HCM",
      shopWarehouseAddress:
        "Trung tâm hoàn hàng Wanderoo - 48 Tân Kỳ Tân Quý, Quận Tân Phú, TP. HCM",
    },
  },
  {
    id: "CAN-7822",
    orderCode: "WEB-998877",
    relatedOrderCode: "WEB-998877",
    customerId: "KH-88901",
    customerName: "Trịnh Thị Mai",
    source: "Website",
    sourceNote: "Khách hủy đơn sau khi đã thanh toán",
    category: "CANCEL",
    statusKey: "INVALID",
    statusLabel: "Đã hủy",
    statusDescription:
      "Đơn hàng đã được hủy theo yêu cầu khách, tiền sẽ được hoàn về tài khoản trong 3-5 ngày làm việc.",
    reason: "Khách hàng thay đổi ý định, không muốn mua nữa.",
    optionDescription: "Có 1 phương án áp dụng:",
    options: ["Hoàn tiền về phương thức thanh toán ban đầu"],
    products: [
      {
        id: "P-13",
        name: "Áo khoác gió Wanderoo Windbreaker",
        variant: "Màu Xanh / Size XL",
        quantity: 1,
        price: 1199000,
        image: "https://placehold.co/60x60/png",
        classification: "Áo khoác",
      },
      {
        id: "P-14",
        name: "Mũ lưỡi trai Wanderoo Cap",
        variant: "Màu Đen",
        quantity: 1,
        price: 299000,
        image: "https://placehold.co/60x60/png",
        classification: "Phụ kiện",
      },
    ],
    refundAmount: 1498000,
    forwardShipping: {
      label: "Chưa giao hàng",
      chip: "pending",
      note: "Đơn hủy trước khi đóng gói",
    },
    returnShipping: {
      label: "Không áp dụng",
      chip: "default",
      note: "Đơn chưa rời kho",
    },
    lastUpdated: "22/11/2025 10:00",
    addresses: {
      receivingAddress: "321 Điện Biên Phủ, Phường 25, Bình Thạnh, TP. HCM",
      customerReturnAddress:
        "Kho Wanderoo - 555 Điện Biên Phủ, Quận 3, TP. HCM",
      shopWarehouseAddress:
        "Trung tâm hoàn hàng Wanderoo - 48 Tân Kỳ Tân Quý, Quận Tân Phú, TP. HCM",
    },
    refundAccount: {
      bankName: "Vietinbank",
      accountNumber: "711A 1234 5678",
      accountHolder: "TRINH THI MAI",
      email: "trinhthimai@email.com",
    },
  },
  {
    id: "CAN-7823",
    orderCode: "POS-445566",
    relatedOrderCode: "POS-445566",
    customerId: "KH-99012",
    customerName: "Đỗ Văn Hùng",
    source: "POS",
    sourceNote: "Hủy đơn tại quầy trước khi thanh toán",
    category: "CANCEL",
    statusKey: "INVALID",
    statusLabel: "Đã hủy",
    statusDescription:
      "Đơn hàng đã được hủy tại quầy, không có phát sinh hoàn tiền.",
    reason: "Khách hàng thay đổi ý định mua hàng.",
    optionDescription: "Đơn hàng đã hủy:",
    options: ["Không có hoàn tiền do chưa thanh toán"],
    products: [
      {
        id: "P-15",
        name: "Quần jogger Wanderoo Comfort",
        variant: "Màu Xám / Size L",
        quantity: 2,
        price: 649000,
        image: "https://placehold.co/60x60/png",
        classification: "Trang phục thể thao",
      },
    ],
    refundAmount: 0,
    forwardShipping: {
      label: "Với ở POS sẽ luôn đã hoàn thành",
      chip: "completed",
      note: "Đơn hủy tại quầy",
    },
    returnShipping: {
      label: "Không áp dụng",
      chip: "default",
      note: "Đơn hủy trước khi thanh toán",
    },
    lastUpdated: "21/11/2025 13:15",
    addresses: {
      receivingAddress:
        "Cửa hàng Wanderoo Hub - 22 Nguyễn Huệ, Quận 1, TP. HCM",
      customerReturnAddress:
        "Cửa hàng Wanderoo Hub - 22 Nguyễn Huệ, Quận 1, TP. HCM",
      shopWarehouseAddress:
        "Trung tâm hoàn hàng Wanderoo - 48 Tân Kỳ Tân Quý, Quận Tân Phú, TP. HCM",
    },
  },
  {
    id: "FAIL-1291",
    orderCode: "WEB-556677",
    relatedOrderCode: "WEB-556677",
    customerId: "KH-11223",
    customerName: "Bùi Thị Linh",
    source: "Website",
    sourceNote: "Giao hàng qua đối tác GHN",
    category: "FAILED",
    statusKey: "RETURNING",
    statusLabel: "Đang trả hàng",
    statusDescription:
      "Giao hàng thất bại sau 3 lần thử, đơn hàng đang được đưa về kho.",
    reason: "Địa chỉ giao hàng không chính xác, không tìm thấy người nhận.",
    optionDescription: "Có 2 phương án dự phòng:",
    options: [
      "Liên hệ lại khách để xác nhận địa chỉ và giao lại",
      "Hoàn tiền khi hàng quay về kho",
    ],
    products: [
      {
        id: "P-16",
        name: "Giày bóng đá Wanderoo Football Pro",
        variant: "Màu Trắng / Size 40",
        quantity: 1,
        price: 999000,
        image: "https://placehold.co/60x60/png",
        classification: "Giày thể thao",
      },
      {
        id: "P-17",
        name: "Tất thể thao Wanderoo Sport Socks",
        variant: "Màu Trắng / Size 39-42",
        quantity: 3,
        price: 199000,
        image: "https://placehold.co/60x60/png",
        classification: "Phụ kiện",
      },
    ],
    refundAmount: 1596000,
    forwardShipping: {
      label: "Giao thất bại",
      chip: "cancelled",
      note: "Đã thử giao 3 lần nhưng không thành công",
      timeline: [
        "Lần 1: Không có người nhận",
        "Lần 2: Địa chỉ không chính xác",
        "Lần 3: Không liên hệ được",
        "Giao thất bại - Đang trả hàng",
      ],
    },
    returnShipping: {
      label: "Đang hoàn hàng",
      chip: "return",
      note: "Đối tác đang đưa hàng trở lại kho Wanderoo",
      timeline: ["Đã nhận hàng từ điểm giao", "Đang vận chuyển về kho"],
    },
    lastUpdated: "22/11/2025 08:45",
    addresses: {
      receivingAddress: "123 Nguyễn Văn Cừ, Long Biên, Hà Nội",
      customerReturnAddress: "Kho tổng Wanderoo - 25 Láng Hạ, Đống Đa, Hà Nội",
      shopWarehouseAddress:
        "Trung tâm hoàn hàng Wanderoo - 230 Phạm Văn Đồng, Bắc Từ Liêm, Hà Nội",
    },
    refundAccount: {
      bankName: "Agribank",
      accountNumber: "1504 1234 5678",
      accountHolder: "BUI THI LINH",
      email: "buithilinh@gmail.com",
    },
  },
  {
    id: "FAIL-1292",
    orderCode: "WEB-223344",
    relatedOrderCode: "WEB-223344",
    customerId: "KH-33445",
    customerName: "Vũ Đình Khôi",
    source: "Website",
    sourceNote: "Giao hàng qua đối tác Viettel Post",
    category: "FAILED",
    statusKey: "RETURNING",
    statusLabel: "Đang trả hàng",
    statusDescription:
      "Khách hàng từ chối nhận hàng, đơn hàng đang được trả về kho.",
    reason: "Khách hàng không muốn nhận hàng nữa, yêu cầu hủy đơn.",
    optionDescription: "Có 1 phương án:",
    options: ["Hoàn tiền khi hàng quay về kho"],
    products: [
      {
        id: "P-18",
        name: "Balo du lịch Wanderoo Travel",
        variant: "Màu Xanh Navy",
        quantity: 1,
        price: 1399000,
        image: "https://placehold.co/60x60/png",
        classification: "Phụ kiện",
      },
    ],
    refundAmount: 1399000,
    forwardShipping: {
      label: "Khách từ chối",
      chip: "cancelled",
      note: "Khách hàng từ chối nhận hàng",
      timeline: [
        "Đã đóng gói",
        "Đang vận chuyển",
        "Khách từ chối nhận",
        "Đang trả hàng",
      ],
    },
    returnShipping: {
      label: "Đang hoàn hàng",
      chip: "return",
      note: "Đối tác đang đưa hàng trở lại kho",
    },
    lastUpdated: "21/11/2025 17:30",
    addresses: {
      receivingAddress: "567 Hoàng Diệu, Phường 12, Quận 4, TP. HCM",
      customerReturnAddress:
        "Kho Wanderoo - 555 Điện Biên Phủ, Quận 3, TP. HCM",
      shopWarehouseAddress:
        "Trung tâm hoàn hàng Wanderoo - 48 Tân Kỳ Tân Quý, Quận Tân Phú, TP. HCM",
    },
    refundAccount: {
      bankName: "TPBank",
      accountNumber: "0234 5678 9012",
      accountHolder: "VU DINH KHOI",
    },
  },
  {
    id: "RET-23008",
    orderCode: "WEB-667788",
    relatedOrderCode: "WEB-667788",
    customerId: "KH-44556",
    customerName: "Lê Văn Hải",
    source: "Website",
    sourceNote: "Đặt hàng online, thanh toán qua thẻ tín dụng",
    category: "RETURN",
    statusKey: "REFUNDED",
    statusLabel: "Đã hoàn tiền toàn bộ",
    statusDescription:
      "Đã hoàn 100% giá trị đơn hàng về thẻ tín dụng của khách hàng, giao dịch hoàn tất.",
    reason:
      "Sản phẩm bị hư hỏng trong quá trình vận chuyển, bao bì bị rách và sản phẩm bị trầy xước.",
    reasonTags: ["Hư hỏng vận chuyển"],
    optionDescription: "Có 1 phương án đã áp dụng:",
    options: ["Trả hàng & hoàn tiền"],
    preferredResolution: "Trả hàng & hoàn tiền",
    products: [
      {
        id: "P-19",
        name: "Giày cao cổ Wanderoo High Top",
        variant: "Màu Đen / Size 43",
        quantity: 1,
        price: 1199000,
        image: "https://placehold.co/60x60/png",
        classification: "Giày thể thao",
      },
    ],
    refundAmount: 1199000,
    forwardShipping: {
      label: "Đã hoàn thành",
      chip: "completed",
      note: "Đã giao hàng nhưng bị hư hỏng",
    },
    returnShipping: {
      label: "Đã hoàn thành",
      chip: "completed",
      note: "Đã nhận lại hàng và hoàn tiền",
    },
    lastUpdated: "20/11/2025 12:00",
    addresses: {
      receivingAddress: "890 Võ Văn Tần, Phường 6, Quận 3, TP. HCM",
      customerReturnAddress:
        "Kho Wanderoo - 555 Điện Biên Phủ, Quận 3, TP. HCM",
      shopWarehouseAddress:
        "Trung tâm hoàn hàng Wanderoo - 48 Tân Kỳ Tân Quý, Quận Tân Phú, TP. HCM",
    },
    refundAccount: {
      bankName: "HSBC",
      accountNumber: "1234 5678 9012 3456",
      accountHolder: "LE VAN HAI",
      email: "levanhai@email.com",
    },
    evidenceImages: [
      "https://placehold.co/80x80/png",
      "https://placehold.co/80x80/png",
    ],
  },
];
