import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../../../components/shop/Header";
import Footer from "../../../../components/shop/Footer";
import Button from "../../../../components/shop/Button";
import { Textarea } from "../../../../components/shop/Input";
import { useAuth } from "../../../../context/AuthContext";
import ShippingAddress from "../../../../components/shop/Checkout/ShippingAddress";
import ProductsTable from "../../../../components/shop/Checkout/ProductsTable";
import VoucherSelectionModal from "../../../../components/shop/Checkout/VoucherSelectionModal";
import { formatCurrencyVND } from "./utils/formatCurrency";
import {
  getUserAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from "../../../../api/endpoints/userApi";
import { getCart, removeCartItem } from "../../../../api/endpoints/cartApi";
import { createOrder } from "../../../../api/endpoints/orderApi";
import { createVNPayPayment } from "../../../../api/endpoints/paymentApi";
import type { AddressResponse, AddressUpdateRequest } from "../../../../types/auth";
import type { BackendCartResponse, CustomerOrderPublicCreateRequest, SelectedCartWithShippingResponse } from "../../../../types/api";
import { toast } from "sonner";

type CheckoutItem = {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  price: number;
  quantity: number;
  variant?: string;
  cartId?: number; // For checkbox selection
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
  id: "CASH" | "BANKING";
  title: string;
  description: string;
};

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "CASH",
    title: "Thanh toán khi nhận hàng",
    description:
      "Thanh toán trực tiếp với nhân viên giao hàng sau khi nhận sản phẩm.",
  },
  {
    id: "BANKING",
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
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [addresses, setAddresses] = useState<AddressOption[]>([]);
  const [cartData, setCartData] = useState<BackendCartResponse[]>([]);
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [totalProductPrice, setTotalProductPrice] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<number>(
    () => addresses[0]?.id ?? 0
  );
  const [pendingAddressId, setPendingAddressId] =
    useState<number>(selectedAddressId);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressOption | null>(
    null
  );
  const [editForm, setEditForm] = useState<EditFormState>({
    name: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    setAsDefault: false,
    detailAddress: "",
  });
  const [selectedVoucherId, setSelectedVoucherId] = useState<string | null>(
    null
  );
  const [isPaymentMethodModalOpen, setIsPaymentMethodModalOpen] =
    useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    PaymentMethod["id"]
  >(PAYMENT_METHODS[0].id);
  const [pendingPaymentMethod, setPendingPaymentMethod] = useState<
    PaymentMethod["id"]
  >(PAYMENT_METHODS[0].id);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

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

  // Fetch addresses and cart data
  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch addresses
        const addressResponse = await getUserAddresses();
        const addressList = addressResponse.addresses || [];

        // Map AddressResponse to AddressOption
        const mappedAddresses: AddressOption[] = addressList.map((addr: AddressResponse) => {
          const region = [
            addr.wardName,
            addr.districtName,
            addr.provinceName
          ].filter(Boolean).join(", ");

          const fullAddress = addr.fullAddress || `${addr.street}, ${region}`;

          // Use receiverName/receiverPhone if available, otherwise fallback to name/phone
          const displayName = addr.receiverName || addr.name;
          const displayPhone = addr.receiverPhone || addr.phone;

          return {
            id: addr.id,
            name: displayName,
            phone: displayPhone,
            detailAddress: addr.street,
            region: region,
            address: fullAddress,
            isDefault: addr.isDefault === true || addr.isDefault === "Địa chỉ mặc định",
          };
        });

        setAddresses(mappedAddresses);

        // Set default address if exists
        const defaultAddress = mappedAddresses.find(addr => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
          setPendingAddressId(defaultAddress.id);
        } else if (mappedAddresses.length > 0) {
          setSelectedAddressId(mappedAddresses[0].id);
          setPendingAddressId(mappedAddresses[0].id);
        }

        // Check if we have selected items from CartPage
        const locationState = location.state as { selectedCartItems?: SelectedCartWithShippingResponse } | null;

        if (locationState?.selectedCartItems) {
          // Use the data passed from CartPage directly
          setCartData(locationState.selectedCartItems.cartItems);
          setTotalProductPrice(locationState.selectedCartItems.totalProductPrice);
          setShippingFee(locationState.selectedCartItems.estimatedShippingFee);
          setTotalPrice(locationState.selectedCartItems.totalPrice);
        } else {
          // If no selected items, fetch all cart items
          const cartResponse = await getCart({ page: 1, size: 100 });
          setCartData(cartResponse.carts || []);
          // For all cart items, calculate shipping manually (fallback)
          const totalProduct = cartResponse.carts?.reduce((sum, item) => sum + item.totalPrice, 0) || 0;
          setTotalProductPrice(totalProduct);
          setShippingFee(30000); // Default shipping fee
          setTotalPrice(totalProduct + 30000);
        }
      } catch (err: any) {
        console.error("Error fetching checkout data:", err);
        setError(err?.response?.data?.message || "Không thể tải dữ liệu thanh toán");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, location.state]);

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
    addresses.find((address) => address.id === selectedAddressId) ??
    addresses[0];

  // Map cart items from API to checkout items
  const checkoutItems: CheckoutItem[] = useMemo(() => {
    return cartData.map((cartItem) => {
      // Map attributes to variant string
      // Format: "name: value, name: value"
      const variant = cartItem.attributes
        ?.map(attr => `${attr.name}: ${attr.value}`)
        .join(", ") || undefined;

      return {
        id: cartItem.id.toString(),
        name: cartItem.productName,
        description: cartItem.attributes?.map(attr => `${attr.name}: ${attr.value}`).join(", ") || "",
        imageUrl: cartItem.imageUrl || "",
        price: cartItem.productPrice,
        quantity: cartItem.quantity,
        variant: variant,
        cartId: cartItem.id, // Store cartId for checkbox selection
      } as CheckoutItem & { cartId: number };
    });
  }, [cartData]);

  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discountCode = 0;
  const total = totalPrice > 0 ? totalPrice : (subtotal + shippingFee - discountCode);
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

  const handleConfirmAddress = async () => {
    try {
      // If address changed, optionally set as default
      if (pendingAddressId !== selectedAddressId) {
        // Optionally set as default - you can add a checkbox for this
        // await setDefaultAddress(pendingAddressId);
      }
      setSelectedAddressId(pendingAddressId);
      setIsAddressModalOpen(false);
    } catch (err: any) {
      console.error("Error confirming address:", err);
      setError(err?.response?.data?.message || "Không thể xác nhận địa chỉ");
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
      return;
    }

    try {
      await deleteAddress(addressId);

      // If deleted address was selected, select another one
      if (addressId === selectedAddressId) {
        const remainingAddresses = addresses.filter(a => a.id !== addressId);
        if (remainingAddresses.length > 0) {
          const defaultAddr = remainingAddresses.find(a => a.isDefault) || remainingAddresses[0];
          setSelectedAddressId(defaultAddr.id);
          setPendingAddressId(defaultAddr.id);
        } else {
          setSelectedAddressId(0);
          setPendingAddressId(0);
        }
      }

      // Refresh addresses
      await refreshAddresses();
    } catch (err: any) {
      console.error("Error deleting address:", err);
      setError(err?.response?.data?.message || "Không thể xóa địa chỉ");
    }
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

  // Refresh addresses from API
  const refreshAddresses = async () => {
    try {
      const addressResponse = await getUserAddresses();
      const addressList = addressResponse.addresses || [];

      const mappedAddresses: AddressOption[] = addressList.map((addr: AddressResponse) => {
        const region = [
          addr.wardName,
          addr.districtName,
          addr.provinceName
        ].filter(Boolean).join(", ");

        const fullAddress = addr.fullAddress || `${addr.street}, ${region}`;

        // Use receiverName/receiverPhone if available, otherwise fallback to name/phone
        const displayName = addr.receiverName || addr.name;
        const displayPhone = addr.receiverPhone || addr.phone;

        return {
          id: addr.id,
          name: displayName,
          phone: displayPhone,
          detailAddress: addr.street,
          region: region,
          address: fullAddress,
          isDefault: addr.isDefault === true || addr.isDefault === "Địa chỉ mặc định",
        };
      });

      setAddresses(mappedAddresses);

      // Update selected address if needed
      const defaultAddress = mappedAddresses.find(addr => addr.isDefault);
      if (defaultAddress && !mappedAddresses.find(a => a.id === selectedAddressId)) {
        setSelectedAddressId(defaultAddress.id);
        setPendingAddressId(defaultAddress.id);
      }
    } catch (err: any) {
      console.error("Error refreshing addresses:", err);
      setError("Không thể tải lại danh sách địa chỉ");
    }
  };

  const handleSaveEditAddress = async () => {
    if (!editingAddress) return;

    try {
      // Parse province, district, ward from region
      const { province, district, ward } = parseRegion(editingAddress.region);

      // TODO: Map province/district/ward to actual IDs and codes from location API
      // For now, using the text values - these should be fetched from location API
      const updateData: AddressUpdateRequest = {
        id: editingAddress.id,
        name: editForm.name,
        phone: editForm.phone,
        street: editForm.detailAddress,
        wardName: ward,
        districtName: district,
        provinceName: province,
        // Note: These fields should be fetched from location API
        // For now, trying to preserve existing values if available
        wardCode: "", // Should be fetched from location API based on wardName
        districtId: 0, // Should be fetched from location API based on districtName
        fullAddress: `${editForm.detailAddress}, ${[ward, district, province].filter(Boolean).join(", ")}`,
      };

      await updateAddress(updateData);

      // Set as default if requested
      if (editForm.setAsDefault) {
        await setDefaultAddress(editingAddress.id);
      }

      // Refresh addresses
      await refreshAddresses();

      // Update selected address
      if (editForm.setAsDefault || editingAddress.id === selectedAddressId) {
        setSelectedAddressId(editingAddress.id);
        setPendingAddressId(editingAddress.id);
      }

      handleCloseEditModal(false);
    } catch (err: any) {
      console.error("Error updating address:", err);
      setError(err?.response?.data?.message || "Không thể cập nhật địa chỉ");
    }
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

  const handlePlaceOrder = async () => {
    if (!user || !selectedAddress) {
      setError("Vui lòng đăng nhập và chọn địa chỉ giao hàng");
      return;
    }

    if (checkoutItems.length === 0) {
      setError("Giỏ hàng của bạn đang trống");
      return;
    }

    try {
      setIsPlacingOrder(true);
      setError(null);

      // Prepare order data
      const orderData: CustomerOrderPublicCreateRequest = {
        customerId: user.id,
        addressId: selectedAddress.id,
        discountId: selectedVoucherId ? parseInt(selectedVoucherId.split("-")[1]) : undefined,
        paymentMethod: selectedPaymentMethod === "BANKING" ? "BANKING" : "CASH",
        shippingFee: shippingFee,
        totalProductPrice: subtotal,
        totalOrderPrice: total,
        notes: notes || undefined,
        items: checkoutItems.map((item) => {
          const cartItem = cartData.find(c => c.id.toString() === item.id);
          if (!cartItem || !cartItem.productDetailId) {
            throw new Error(`Không tìm thấy thông tin sản phẩm: ${item.name}`);
          }
          return {
            productDetailId: cartItem.productDetailId,
            quantity: item.quantity,
          };
        }),
      };

      // Create order
      const orderResponse = await createOrder(orderData);
      const orderId = orderResponse.order.id;
      const orderCode = orderResponse.order.code;

      // Remove selected cart items after successful order creation
      try {
        const cartIdsToDelete = checkoutItems
          .map((item) => item.cartId)
          .filter((id): id is number => id !== undefined);

        // Delete all selected cart items in parallel
        await Promise.all(
          cartIdsToDelete.map((cartId) => removeCartItem(cartId))
        );

        console.log(`Đã xóa ${cartIdsToDelete.length} sản phẩm khỏi giỏ hàng`);
      } catch (deleteError: any) {
        console.error("Lỗi khi xóa cart items:", deleteError);
        // Don't fail the order creation if cart deletion fails
        // The order was already created successfully
      }

      // If payment method is banking, redirect to VNPay
      if (selectedPaymentMethod === "BANKING") {
        const paymentResponse = await createVNPayPayment(orderId);
        if (paymentResponse.url) {
          // Show success toast before redirecting
          toast.success("Đặt hàng thành công!", {
            description: "Đơn hàng đã được tạo. Đang chuyển hướng đến trang thanh toán...",
            duration: 2000,
          });
          // Small delay to show toast before redirect
          setTimeout(() => {
            window.location.href = paymentResponse.url;
          }, 500);
          return;
        } else {
          setError("Không thể tạo URL thanh toán. Vui lòng thử lại.");
          toast.error("Lỗi thanh toán", {
            description: "Đơn hàng đã được tạo nhưng không thể tạo URL thanh toán. Vui lòng thử lại hoặc liên hệ hỗ trợ.",
            duration: 5000,
          });
          // Navigate to order detail even if payment URL creation fails
          navigate(`/user/profile/orders/${orderCode}?newOrder=true`);
        }
      } else {
        // CASH - Order created successfully, navigate to order detail page
        navigate(`/user/profile/orders/${orderCode}?newOrder=true`);
      }
    } catch (err: any) {
      console.error("Error placing order:", err);
      const errorMessage = err?.response?.data?.message || "Không thể đặt hàng. Vui lòng thử lại.";
      setError(errorMessage);
      toast.error("Đặt hàng thất bại", {
        description: errorMessage,
        duration: 4000,
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        cartCount={cartData.reduce((sum, item) => sum + item.quantity, 0)}
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <main className="flex-1">
        {/* Checkout Content */}
        <section className="w-full bg-gray-50 py-8">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="mb-6">
              <button
                onClick={() => navigate("/shop/cart")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                <span className="text-sm">Quay lại giỏ hàng</span>
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">
                Thanh toán
              </h1>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {loading ? (
              <div className="text-center py-16">
                <p className="text-gray-600 text-lg">Đang tải dữ liệu...</p>
              </div>
            ) : checkoutItems.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-600 text-lg mb-4">
                  Giỏ hàng của bạn đang trống
                </p>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => window.location.href = "/shop/cart"}
                >
                  Quay lại giỏ hàng
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-4">
                  <ShippingAddress
                    name={selectedAddress?.name || ""}
                    phone={selectedAddress?.phone || ""}
                    address={selectedAddress?.address || ""}
                    isDefault={Boolean(selectedAddress?.isDefault)}
                    onChange={handleOpenAddressModal}
                  />

                  <ProductsTable items={checkoutItems} />

                  {/* Notes and Voucher */}
                  <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lời nhắn
                      </label>
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Lưu ý cho shop (tùy chọn)"
                        rows={4}
                        className="w-full"
                      />
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="text-sm text-gray-700">Mã giảm giá</span>
                      <button
                        onClick={handleOpenVoucherModal}
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        Chọn mã giảm giá
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column - Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white border border-gray-200 rounded-lg p-5 sticky top-4">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Tóm tắt đơn hàng
                    </h2>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tổng tiền hàng</span>
                        <span className="text-gray-900 font-semibold">
                          {formatCurrencyVND(subtotal)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Phí vận chuyển</span>
                        <span className="text-gray-900 font-semibold">
                          {formatCurrencyVND(shippingFee)}
                        </span>
                      </div>
                      {discountCode > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Giảm giá</span>
                          <span className="text-[#E04D30] font-semibold">
                            -{formatCurrencyVND(discountCode)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-200 pt-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-base font-semibold text-gray-900">
                          Tổng thanh toán
                        </span>
                        <span className="text-xl font-bold text-[#E04D30]">
                          {formatCurrencyVND(total)}
                        </span>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="border-t border-gray-200 pt-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Thanh toán</span>
                        <button
                          onClick={() => setIsPaymentMethodModalOpen(true)}
                          className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          Thay đổi
                        </button>
                      </div>
                      <p className="text-sm text-gray-900">
                        {selectedPaymentMethodInfo.title}
                      </p>
                    </div>

                    {/* Place Order Button */}
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full bg-[#E04D30] hover:bg-[#c53b1d] text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                      onClick={handlePlaceOrder}
                      disabled={isPlacingOrder || !selectedAddress || checkoutItems.length === 0}
                    >
                      {isPlacingOrder ? "Đang xử lý..." : "Đặt hàng"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
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
          <div className="relative w-full max-w-[520px] bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Địa chỉ của tôi
              </h3>
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
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                          Mặc định
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-gray-700 text-[14px] whitespace-pre-line leading-relaxed">
                      {address.address}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
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
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-700 text-[14px] font-medium whitespace-nowrap"
                      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                        event.preventDefault();
                        event.stopPropagation();
                        handleDeleteAddress(address.id);
                      }}
                    >
                      Xóa
                    </button>
                  </div>
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
              <Button
                variant="primary"
                onClick={handleConfirmAddress}
                className="px-6"
              >
                Xác nhận
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Address Edit Modal */}
      {isEditModalOpen && editingAddress && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => handleCloseEditModal()}
          />
          <div className="relative w-full max-w-[520px] bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Cập nhật địa chỉ
              </h3>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 mb-2">Họ và tên</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      handleChangeEditForm("name", e.target.value)
                    }
                    className="w-full h-11 border border-gray-300 rounded-lg px-3 text-[14px] text-gray-900 focus:outline-none focus:border-[#E04D30]"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) =>
                      handleChangeEditForm("phone", e.target.value)
                    }
                    className="w-full h-11 border border-gray-300 rounded-lg px-3 text-[14px] text-gray-900 focus:outline-none focus:border-[#E04D30]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <label className="block text-gray-600 mb-2">
                    Tỉnh/Thành phố
                  </label>
                  <select
                    value={editForm.province}
                    onChange={(e) =>
                      handleChangeEditForm("province", e.target.value)
                    }
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
                    onChange={(e) =>
                      handleChangeEditForm("district", e.target.value)
                    }
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
                    onChange={(e) =>
                      handleChangeEditForm("ward", e.target.value)
                    }
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
                <label className="block text-gray-600 mb-2">
                  Địa chỉ cụ thể
                </label>
                <textarea
                  value={editForm.detailAddress}
                  onChange={(e) =>
                    handleChangeEditForm("detailAddress", e.target.value)
                  }
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
              <Button
                variant="primary"
                onClick={handleSaveEditAddress}
                className="px-6"
              >
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
          <div className="relative w-full max-w-[520px] bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Phương thức thanh toán
              </h3>
              <button
                type="button"
                onClick={handleClosePaymentMethodModal}
                className="text-2xl leading-none text-gray-400 hover:text-gray-600 transition-colors"
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
                      className={`relative text-left px-4 py-3 border rounded-lg transition-all ${isActive
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                    >
                      <span
                        className={`absolute top-3 right-3 text-sm ${isActive ? "text-gray-900" : "text-transparent"
                          }`}
                      >
                        ✓
                      </span>
                      <div className="text-sm font-medium text-gray-900 pr-6">
                        {method.title}
                      </div>
                      <div className="mt-1 text-xs text-gray-600">
                        {method.description}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={handleClosePaymentMethodModal}
                >
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
