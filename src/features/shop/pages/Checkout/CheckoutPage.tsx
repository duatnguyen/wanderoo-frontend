import React, { useState, useMemo, useEffect } from "react";
import Header from "../../../../components/shop/Header";
import Footer from "../../../../components/shop/Footer";
import Button from "../../../../components/shop/Button";
import { Textarea } from "../../../../components/shop/Input";
import { useCart } from "../../../../context/CartContext";
import { getProductById } from "../../data/productsData";
import ShippingAddress from "../../../../components/shop/Checkout/ShippingAddress";
import ProductsTable from "../../../../components/shop/Checkout/ProductsTable";
import VoucherSelectionModal from "../../../../components/shop/Checkout/VoucherSelectionModal";
import { formatCurrencyVND } from "./utils/formatCurrency";

type CheckoutItem = {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  price: number;
  quantity: number;
  variant?: string;
};

type AddressOption = {
  id: number;
  name: string;
  phone: string;
  address: string;
  isDefault?: boolean;
  region: string;
  detailAddress: string;
};

type EditFormState = {
  name: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  setAsDefault: boolean;
  detailAddress: string;
};

type PaymentMethod = {
  id: "cod" | "bank_transfer";
  title: string;
  description: string;
};

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "cod",
    title: "Thanh toán khi nhận hàng",
    description:
      "Thanh toán trực tiếp với nhân viên giao hàng sau khi nhận sản phẩm.",
  },
  {
    id: "bank_transfer",
    title: "Chuyển khoản ngân hàng qua mã QR",
    description:
      "Quét mã QR bằng ứng dụng ngân hàng để thanh toán nhanh chóng, an toàn.",
  },
];

const locationOptions: Record<string, Record<string, string[]>> = {
  "Hà Nội": {
    "Quận Hoàn Kiếm": ["Phường Đinh Tiên Hoàng", "Phường Hàng Trống"],
    "Quận Thanh Xuân": ["Phường Thanh Xuân Trung", "Phường Nhân Chính"],
    "Quận Nam Từ Liêm": ["Phường Tây Mỗ", "Phường Mễ Trì"],
  },
  "TP. HCM": {
    "Quận Bình Tân": ["Phường Bình Hưng Hòa A", "Phường Bình Hưng Hòa B"],
  },
};

const parseRegion = (
  region: string
): Pick<EditFormState, "province" | "district" | "ward"> => {
  if (!region) {
    return { province: "", district: "", ward: "" };
  }

  const parts = region
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  let ward = "";
  let district = "";
  let province = "";

  parts.forEach((part) => {
    if (!ward && (part.startsWith("Phường") || part.startsWith("Xã"))) {
      ward = part;
      return;
    }

    if (
      !district &&
      (part.startsWith("Quận") ||
        part.startsWith("Huyện") ||
        part.startsWith("Thành phố"))
    ) {
      district = part;
      return;
    }

    if (!province) {
      province = part;
    }
  });

  if (!province && parts.length) {
    province = parts[parts.length - 1];
  }

  return { province, district, ward };
};

const CheckoutPage: React.FC = () => {
  const { cartItems, getCartCount } = useCart();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [addresses, setAddresses] = useState<AddressOption[]>(() => [
    {
      id: 1,
      name: "Lê Minh Trang",
      phone: "(+84) 912 334 556",
      detailAddress: "Số 215 Nguyễn Trãi",
      region: "Quận Thanh Xuân, Hà Nội",
      address: "Số 215 Nguyễn Trãi\nQuận Thanh Xuân, Hà Nội",
      isDefault: true,
    },
    {
      id: 2,
      name: "Nguyễn Đức Hải",
      phone: "(+84) 934 778 900",
      detailAddress: "Chung cư Green Town, Block B2",
      region: "Phường Bình Hưng Hòa B, Quận Bình Tân, TP. HCM",
      address:
        "Chung cư Green Town, Block B2\nPhường Bình Hưng Hòa B, Quận Bình Tân, TP. HCM",
    },
    {
      id: 3,
      name: "Võ Thanh Hà",
      phone: "(+84) 963 112 450",
      detailAddress: "Tầng 12, Tòa S2, Vinhomes Smart City",
      region: "Phường Tây Mỗ, Quận Nam Từ Liêm, Hà Nội",
      address:
        "Tầng 12, Tòa S2, Vinhomes Smart City\nPhường Tây Mỗ, Quận Nam Từ Liêm, Hà Nội",
    },
  ]);
  const [selectedAddressId, setSelectedAddressId] = useState<number>(
    () => addresses[0]?.id ?? 0
  );
  const [pendingAddressId, setPendingAddressId] = useState<number>(selectedAddressId);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressOption | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>({
    name: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    setAsDefault: false,
    detailAddress: "",
  });
  const [selectedVoucherId, setSelectedVoucherId] = useState<string | null>(null);
  const [isPaymentMethodModalOpen, setIsPaymentMethodModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    PaymentMethod["id"]
  >(PAYMENT_METHODS[0].id);
  const [pendingPaymentMethod, setPendingPaymentMethod] = useState<
    PaymentMethod["id"]
  >(PAYMENT_METHODS[0].id);

  const voucherSections = useMemo(
    () => [
      {
        id: "shipping",
        title: "Voucher miễn phí vận chuyển",
        subtitle: "Có thể chọn 1 voucher",
        vouchers: [
          {
            id: "voucher-3",
            code: "FREESHIP30",
            title: "Miễn phí vận chuyển tối đa 30.000đ",
            description: "Áp dụng cho đơn hàng Freeship Cồng Kềnh",
            expiry: "12.12.2025",
            minimumOrder: "500.000đ",
          },
          {
            id: "voucher-4",
            code: "FREESHIP15",
            title: "Miễn phí vận chuyển tối đa 15.000đ",
            description: "Áp dụng cho mọi đơn hàng đủ điều kiện",
            expiry: "12.12.2025",
            minimumOrder: "200.000đ",
          },
          {
            id: "voucher-5",
            code: "FREESHIP10",
            title: "Miễn phí vận chuyển tối đa 10.000đ",
            description: "Áp dụng cho đơn hàng dưới 3kg",
            expiry: "31.12.2025",
            minimumOrder: "150.000đ",
          },
          {
            id: "voucher-6",
            code: "FREESHIPVIP",
            title: "Miễn phí vận chuyển cho thành viên VIP",
            description: "Áp dụng cho mọi đơn hàng trong tháng",
            expiry: "30.09.2025",
            minimumOrder: "0đ",
          },
        ],
      },
      {
        id: "discount",
        title: "Voucher giảm giá",
        subtitle: "Có thể chọn 1 voucher",
        vouchers: [
          {
            id: "voucher-1",
            code: "WD10PCT",
            title: "Giảm 10% tối đa 250.000đ",
            description: "Áp dụng cho tất cả sản phẩm đủ điều kiện",
            expiry: "15.11.2025",
            minimumOrder: "1.500.000đ",
          },
          {
            id: "voucher-2",
            code: "WD50K",
            title: "Giảm 50% tối đa 100.000đ",
            description: "Áp dụng cho sản phẩm Wanderoo chính hãng",
            expiry: "30.11.2025",
            minimumOrder: "0đ",
          },
          {
            id: "voucher-7",
            code: "WD30K",
            title: "Giảm 30.000đ cho đơn từ 300.000đ",
            description: "Áp dụng cho bộ sưu tập Camping Season",
            expiry: "20.12.2025",
            minimumOrder: "300.000đ",
          },
          {
            id: "voucher-8",
            code: "WDNEW",
            title: "Giảm 15% cho khách hàng mới",
            description: "Áp dụng đơn hàng đầu tiên trên Wanderoo",
            expiry: "31.12.2025",
            minimumOrder: "200.000đ",
          },
        ],
      },
    ],
    []
  );

  useEffect(() => {
    if (editingAddress) {
      const { province, district, ward } = parseRegion(editingAddress.region);

      setEditForm({
        name: editingAddress.name,
        phone: editingAddress.phone,
        province,
        district,
        ward,
        setAsDefault: false,
        detailAddress: editingAddress.detailAddress,
      });
    }
  }, [editingAddress]);

  const selectedAddress =
    addresses.find((address) => address.id === selectedAddressId) ?? addresses[0];

  // Map cart items to checkout items with product data
  const checkoutItems: CheckoutItem[] = useMemo(() => {
    return cartItems
      .map((cartItem) => {
        const product = getProductById(cartItem.productId);
        if (!product) return null;

        return {
          id: cartItem.productId.toString(),
          name: product.name,
          description: product.description,
          imageUrl: product.imageUrl || "",
          price: product.price,
          quantity: cartItem.quantity,
          variant: cartItem.variant,
        } as CheckoutItem;
      })
      .filter((item): item is CheckoutItem => item !== null);
  }, [cartItems]);

  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = 15000;
  const discountCode = 0;
  const total = subtotal + shippingFee - discountCode;
  const selectedPaymentMethodInfo =
    PAYMENT_METHODS.find((method) => method.id === selectedPaymentMethod) ??
    PAYMENT_METHODS[0];

  useEffect(() => {
    if (isPaymentMethodModalOpen) {
      setPendingPaymentMethod(selectedPaymentMethod);
    }
  }, [isPaymentMethodModalOpen, selectedPaymentMethod]);

  const handleOpenAddressModal = () => {
    setPendingAddressId(selectedAddressId);
    setIsAddressModalOpen(true);
  };

  const handleConfirmAddress = () => {
    setSelectedAddressId(pendingAddressId);
    setIsAddressModalOpen(false);
  };

  const handleCloseAddressModal = () => {
    setIsAddressModalOpen(false);
  };

  const handleOpenEditModal = (address: AddressOption) => {
    setEditingAddress(address);
    setIsEditModalOpen(true);
    setIsAddressModalOpen(false);
  };

  const handleCloseEditModal = (reopenList = false) => {
    setIsEditModalOpen(false);
    setEditingAddress(null);
    if (reopenList) {
      setIsAddressModalOpen(true);
    }
  };

  const handleChangeEditForm = (
    field: keyof EditFormState,
    value: string | boolean
  ) => {
    setEditForm((prev) => {
      if (field === "province") {
        return { ...prev, province: value as string, district: "", ward: "" };
      }

      if (field === "district") {
        return { ...prev, district: value as string, ward: "" };
      }

      if (field === "setAsDefault") {
        return { ...prev, setAsDefault: Boolean(value) };
      }

      return {
      ...prev,
      [field]: value,
      } as EditFormState;
    });
  };

  const provinceOptions = useMemo(() => Object.keys(locationOptions), []);

  const districtOptions = useMemo(() => {
    if (!editForm.province) return [];
    return Object.keys(locationOptions[editForm.province] || {});
  }, [editForm.province]);

  const wardOptions = useMemo(() => {
    if (!editForm.province || !editForm.district) return [];
    return locationOptions[editForm.province]?.[editForm.district] || [];
  }, [editForm.province, editForm.district]);

  const handleSaveEditAddress = () => {
    if (!editingAddress) return;

    const region = [editForm.ward, editForm.district, editForm.province]
      .filter(Boolean)
      .join(", ");

    setAddresses((prev) => {
      const updated = prev.map((addr) => {
        if (addr.id === editingAddress.id) {
          return {
              ...addr,
              name: editForm.name,
              phone: editForm.phone,
            region,
              detailAddress: editForm.detailAddress,
            address: region
              ? `${editForm.detailAddress}\n${region}`
              : editForm.detailAddress,
            isDefault: editForm.setAsDefault ? true : addr.isDefault,
          };
        }

        if (editForm.setAsDefault) {
          return {
            ...addr,
            isDefault: false,
          };
        }

        return addr;
      });

      return updated;
    });

    if (editingAddress.id === selectedAddressId) {
      setSelectedAddressId(editingAddress.id);
    }
    if (editingAddress.id === pendingAddressId) {
      setPendingAddressId(editingAddress.id);
    }

    if (editForm.setAsDefault) {
      setSelectedAddressId(editingAddress.id);
      setPendingAddressId(editingAddress.id);
    }

    handleCloseEditModal(false);
  };

  const handleOpenVoucherModal = () => {
    setIsVoucherModalOpen(true);
  };

  const handleCloseVoucherModal = () => {
    setIsVoucherModalOpen(false);
  };

  const handleApplyVoucher = (voucherId: string | null) => {
    setSelectedVoucherId(voucherId);
  };

  const handleConfirmPaymentMethod = () => {
    setSelectedPaymentMethod(pendingPaymentMethod);
    setIsPaymentMethodModalOpen(false);
  };

  const handleClosePaymentMethodModal = () => {
    setPendingPaymentMethod(selectedPaymentMethod);
    setIsPaymentMethodModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        cartCount={getCartCount()}
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <main className="flex-1">
        {/* Checkout Content */}
        <section className="w-full bg-gray-50 py-8">
          <div className="max-w-[1200px] mx-auto px-4">
            <h1 className="text-[24px] font-bold text-[#E04D30] mb-1">
              Thanh toán
            </h1>

            <div className="space-y-6">
              <ShippingAddress
                name={selectedAddress?.name || ""}
                phone={selectedAddress?.phone || ""}
                address={selectedAddress?.address || ""}
                isDefault={Boolean(selectedAddress?.isDefault)}
                onChange={handleOpenAddressModal}
              />

              <ProductsTable items={checkoutItems} />

              {/* Discount Code, Notes, and Shipping Method */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden text-[14px]">
                {/* Header */}
                <div className="border-b border-gray-200 px-6 py-3">
                  <div className="grid grid-cols-12 items-center">
                    <div className="col-span-6" />
                    <div className="col-span-12 md:col-span-6 md:col-start-7 flex items-center justify-between pl-6">
                      <div className="font-medium text-gray-900">Mã giảm giá:</div>
                        <button
                        onClick={handleOpenVoucherModal}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                        >
                          Chọn mã giảm giá
                        </button>
                      </div>
                    </div>
                </div>
                {/* Body */}
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Left - Notes */}
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <label className="shrink-0 font-medium text-gray-700">
                        Lời nhắn:
                      </label>
                      <div className="flex-1">
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Lưu ý cho shop"
                      rows={6}
                          className="h-24 w-full"
                    />
                      </div>
                    </div>
                  </div>
                  {/* Right - Shipping method */}
                  <div className="p-6 md:border-l md:border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">
                        Phương thức vận chuyển:
                      </span>
                      <span className="text-gray-900">Giao hàng tận nơi</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method and Order Summary */}
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 py-5 border-b border-gray-200 gap-4">
                  <p className="text-[14px] font-semibold text-gray-900">
                        Phương thức thanh toán
                  </p>
                  <div className="flex items-center gap-3 md:gap-6 text-[14px] text-gray-800">
                    <span>{selectedPaymentMethodInfo.title}</span>
                    <button
                      onClick={() => setIsPaymentMethodModalOpen(true)}
                      className="text-[#1B5CF0] hover:text-[#164aba] text-[14px] font-semibold transition-colors tracking-wide"
                    >
                      Thay đổi
                    </button>
                    </div>
                </div>
                <div className="bg-[#FFFCF5] px-6 py-5 text-[14px] text-gray-700">
                  <div className="md:max-w-[360px] md:ml-auto space-y-2">
                    <div className="grid grid-cols-2 gap-x-4 items-center">
                      <span className="text-gray-700 whitespace-nowrap">
                        Tổng tiền hàng
                      </span>
                      <span className="text-gray-900 font-semibold text-right">
                        {formatCurrencyVND(subtotal)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 items-center">
                      <span className="text-gray-700 whitespace-nowrap">
                        Tổng tiền phí vận chuyển
                      </span>
                      <span className="text-gray-900 font-semibold text-right">
                        {formatCurrencyVND(shippingFee)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 items-center">
                      <span className="text-gray-700 whitespace-nowrap">
                        Tổng cộng Voucher giảm giá
                      </span>
                      <span
                        className={`font-semibold text-right ${
                          discountCode > 0 ? "text-[#E04D30]" : "text-gray-900"
                        }`}
                      >
                        {discountCode > 0
                          ? `-${formatCurrencyVND(Math.abs(discountCode))}`
                          : `-${formatCurrencyVND(0)}`}
                      </span>
                    </div>
                  </div>
                  <div className="md:max-w-[360px] md:ml-auto flex items-center justify-between pt-3">
                    <span className="text-[14px] text-gray-900 whitespace-nowrap">
                      Tổng thanh toán
                    </span>
                    <span className="text-[16px] font-bold text-[#E04D30] whitespace-nowrap">
                      {formatCurrencyVND(total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <div className="flex justify-end">
                <Button
                  variant="primary"
                  size="lg"
                  className="px-20 bg-[#E04D30] hover:bg-[#c53b1d]"
                  onClick={() => {
                    console.log("Place order");
                    // Navigate to order confirmation page
                  }}
                >
                  Đặt hàng
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Address Selection Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={handleCloseAddressModal}
          />
          <div className="relative w-full max-w-[520px] bg-white rounded-xl shadow-2xl overflow-hidden text-[14px]">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-[20px] font-semibold text-gray-900">Địa chỉ của tôi</h3>
            </div>
            <div className="max-h-[420px] overflow-y-auto">
              {addresses.map((address) => (
                <label
                  key={address.id}
                  className="flex items-start gap-3 px-6 py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors text-[14px]"
                >
                  <input
                    type="radio"
                    name="address"
                    className="mt-1 h-4 w-4 text-[#E04D30] border-gray-300"
                    checked={pendingAddressId === address.id}
                    onChange={() => setPendingAddressId(address.id)}
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 text-[14px] text-gray-900">
                      <span className="font-semibold">{address.name}</span>
                      <span className="-mx-1 text-gray-400">|</span>
                      <span className="text-gray-900">{address.phone}</span>
                      {address.isDefault && (
                        <span className="px-3 py-1 border border-[#E04D30] text-[#E04D30] text-[12px] rounded h-6 inline-flex items-center">
                          Mặc định
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-gray-700 text-[14px] whitespace-pre-line leading-relaxed">
                      {address.address}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-700 text-[14px] font-medium whitespace-nowrap"
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                      event.preventDefault();
                      event.stopPropagation();
                      handleOpenEditModal(address);
                    }}
                  >
                    Cập nhật
                  </button>
                </label>
              ))}
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleCloseAddressModal}
                className="px-4 py-2 text-[14px] text-gray-700 font-medium hover:text-gray-900 transition-colors"
              >
                Hủy
              </button>
              <Button variant="primary" onClick={handleConfirmAddress} className="px-6">
                Xác nhận
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Address Edit Modal */}
      {isEditModalOpen && editingAddress && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => handleCloseEditModal()} />
          <div className="relative w-full max-w-[520px] bg-white rounded-xl shadow-2xl overflow-hidden text-[14px]">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-[20px] font-semibold text-gray-900">
                Cập nhật địa chỉ (dùng thông tin trước sáp nhập)
              </h3>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 mb-2">Họ và tên</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => handleChangeEditForm("name", e.target.value)}
                    className="w-full h-11 border border-gray-300 rounded-lg px-3 text-[14px] text-gray-900 focus:outline-none focus:border-[#E04D30]"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-2">Số điện thoại</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => handleChangeEditForm("phone", e.target.value)}
                    className="w-full h-11 border border-gray-300 rounded-lg px-3 text-[14px] text-gray-900 focus:outline-none focus:border-[#E04D30]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <label className="block text-gray-600 mb-2">Tỉnh/Thành phố</label>
                  <select
                    value={editForm.province}
                    onChange={(e) => handleChangeEditForm("province", e.target.value)}
                    className="w-full h-11 border border-gray-300 rounded-lg pr-10 pl-3 text-[14px] text-gray-900 focus:outline-none focus:border-[#E04D30] appearance-none bg-white"
                  >
                    <option value="">Chọn Tỉnh/Thành phố</option>
                    {provinceOptions.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute bottom-3 right-3 flex h-5 w-5 items-center justify-center text-gray-400">
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      />
                    </svg>
                  </span>
                </div>
                <div className="relative">
                  <label className="block text-gray-600 mb-2">Quận/Huyện</label>
                  <select
                    value={editForm.district}
                    onChange={(e) => handleChangeEditForm("district", e.target.value)}
                    className="w-full h-11 border border-gray-300 rounded-lg pr-10 pl-3 text-[14px] text-gray-900 focus:outline-none focus:border-[#E04D30] appearance-none bg-white disabled:bg-gray-100"
                    disabled={!editForm.province}
                  >
                    <option value="">Chọn Quận/Huyện</option>
                    {districtOptions.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute bottom-3 right-3 flex h-5 w-5 items-center justify-center text-gray-400">
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      />
                    </svg>
                  </span>
                </div>
                <div className="relative">
                  <label className="block text-gray-600 mb-2">Phường/Xã</label>
                  <select
                    value={editForm.ward}
                    onChange={(e) => handleChangeEditForm("ward", e.target.value)}
                    className="w-full h-11 border border-gray-300 rounded-lg pr-10 pl-3 text-[14px] text-gray-900 focus:outline-none focus:border-[#E04D30] appearance-none bg-white disabled:bg-gray-100"
                    disabled={!editForm.district}
                  >
                    <option value="">Chọn Phường/Xã</option>
                    {wardOptions.map((ward) => (
                      <option key={ward} value={ward}>
                        {ward}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute bottom-3 right-3 flex h-5 w-5 items-center justify-center text-gray-400">
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      />
                    </svg>
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-gray-600 mb-2">Địa chỉ cụ thể</label>
                <textarea
                  value={editForm.detailAddress}
                  onChange={(e) => handleChangeEditForm("detailAddress", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[14px] text-gray-900 h-20 resize-none focus:outline-none focus:border-[#E04D30]"
                />
              </div>
              {!editingAddress.isDefault && (
                <div className="flex items-center gap-2 -mt-1">
                  <input
                    type="checkbox"
                    id="set-default-address"
                    checked={editForm.setAsDefault}
                    onChange={(e) =>
                      handleChangeEditForm("setAsDefault", e.target.checked)
                    }
                    className={`h-4 w-4 rounded border ${editForm.setAsDefault ? "border-[#E04D30] bg-[#E04D30]" : "border-gray-300 bg-white"} appearance-none flex items-center justify-center focus:outline-none focus:ring-0`}
                    style={{
                      backgroundImage: editForm.setAsDefault
                        ? "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22 fill=%22white%22%3E%3Cpath d=%22M12.78 4.22a.75.75 0 010 1.06l-5.25 5.25a.75.75 0 01-1.06 0L3.22 7.28a.75.75 0 011.06-1.06L6.97 8.91l4.72-4.69a.75.75 0 011.09 0z%22/%3E%3C/svg%3E')"
                        : "none",
                      backgroundSize: "0.75rem",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                  <label
                    htmlFor="set-default-address"
                    className="text-[14px] text-gray-700 select-none cursor-pointer"
                  >
                    Đặt làm địa chỉ mặc định
                  </label>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
              <button
                onClick={() => handleCloseEditModal(true)}
                className="px-4 py-2 text-[14px] text-gray-700 font-medium hover:text-gray-900 transition-colors"
              >
                Trở lại
              </button>
              <Button variant="primary" onClick={handleSaveEditAddress} className="px-6">
                Hoàn thành
              </Button>
            </div>
          </div>
        </div>
      )}

      {isPaymentMethodModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={handleClosePaymentMethodModal}
          />
          <div className="relative w-full max-w-[520px] bg-white rounded-xl shadow-2xl overflow-hidden text-[14px]">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-[20px] font-semibold text-gray-900">
                Phương thức thanh toán
              </h3>
              <button
                type="button"
                onClick={handleClosePaymentMethodModal}
                className="text-[36px] leading-none text-gray-400 hover:text-gray-600 transition-colors font-normal"
              >
                ×
              </button>
            </div>
            <div className="px-6 py-5 space-y-5">
              <div className="grid gap-3">
                {PAYMENT_METHODS.map((method) => {
                  const isActive = pendingPaymentMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPendingPaymentMethod(method.id)}
                      className={`relative text-left px-5 py-4 border rounded-xl transition-all ${
                        isActive
                          ? "border-[#E04D30] bg-[#FFF5F0] shadow-sm"
                          : "border-gray-200 bg-white hover:border-[#E04D30]/60"
                      }`}
                    >
                      <span
                        className={`absolute top-4 right-4 text-[12px] font-semibold ${
                          isActive ? "text-[#E04D30]" : "text-transparent"
                        }`}
                      >
                        ✓
                      </span>
                      <div className="text-[15px] font-semibold text-gray-900">
                        {method.title}
                      </div>
                      <div className="mt-2 text-[13px] text-gray-600 leading-relaxed">
                        {method.description}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={handleClosePaymentMethodModal}>
                  Hủy
                </Button>
                <Button
                  variant="primary"
                  className="bg-[#E04D30] hover:bg-[#c53b1d]"
                  onClick={handleConfirmPaymentMethod}
                >
                  Xác nhận
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <VoucherSelectionModal
        isOpen={isVoucherModalOpen}
        onClose={handleCloseVoucherModal}
        onApply={handleApplyVoucher}
        selectedVoucherId={selectedVoucherId}
        sections={voucherSections}
      />

      <Footer />
    </div>
  );
};

export default CheckoutPage;
