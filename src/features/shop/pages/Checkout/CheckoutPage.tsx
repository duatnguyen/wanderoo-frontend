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
  setDefaultAddress,
  addAddress
} from "../../../../api/endpoints/userApi";
import {
  getProvinces,
  getDistrictsByPath,
  getWardsByPath,
} from "../../../../api/endpoints/shippingApi";
import type { AddressCreationRequest } from "../../../../types/auth";
import type {
  ProvinceResponse,
  DistrictResponse,
  WardResponse,
} from "../../../../types/shipping";
import { Select } from "antd";
import { Input } from "../../../../components/shop/Input";
import Checkbox from "../../../../components/shop/Checkbox";
import { getCart, removeCartItem } from "../../../../api/endpoints/cartApi";
import { createOrder } from "../../../../api/endpoints/websiteOrderApi";
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
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);

  // Location data for address form
  const [provinces, setProvinces] = useState<
    Array<{ label: string; value: number }>
  >([]);
  const [districts, setDistricts] = useState<
    Array<{ label: string; value: number; provinceId: number }>
  >([]);
  const [wards, setWards] = useState<
    Array<{ label: string; value: string; districtId: number }>
  >([]);

  // Address form data
  const [addressFormData, setAddressFormData] = useState({
    name: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    detailAddress: "",
    isDefault: false,
  });

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

  // Fetch provinces
  const fetchProvinces = async () => {
    try {
      setIsLoadingLocations(true);
      const provincesData = await getProvinces();
      const mappedProvinces = provincesData.map((p: ProvinceResponse) => ({
        label: p.provinceName,
        value: p.provinceId,
      }));
      setProvinces(mappedProvinces);
    } catch (error: any) {
      console.error("Error fetching provinces:", error);
      toast.error("Không thể tải danh sách tỉnh/thành phố");
    } finally {
      setIsLoadingLocations(false);
    }
  };

  // Fetch districts
  const fetchDistricts = async (provinceId: number) => {
    try {
      setIsLoadingLocations(true);
      const districtsData = await getDistrictsByPath(provinceId);
      const mappedDistricts = districtsData.map((d: DistrictResponse) => ({
        label: d.districtName,
        value: d.districtId,
        provinceId: d.provinceId,
      }));
      setDistricts(mappedDistricts);
      setWards([]);
      setAddressFormData((prev) => ({ ...prev, district: "", ward: "" }));
    } catch (error: any) {
      console.error("Error fetching districts:", error);
      toast.error("Không thể tải danh sách quận/huyện");
    } finally {
      setIsLoadingLocations(false);
    }
  };

  // Fetch wards
  const fetchWards = async (districtId: number) => {
    try {
      setIsLoadingLocations(true);
      const wardsData = await getWardsByPath(districtId);
      const mappedWards = wardsData.map((w: WardResponse) => ({
        label: w.wardName,
        value: w.wardCode,
        districtId: w.districtId,
      }));
      setWards(mappedWards);
      setAddressFormData((prev) => ({ ...prev, ward: "" }));
    } catch (error: any) {
      console.error("Error fetching wards:", error);
      toast.error("Không thể tải danh sách phường/xã");
    } finally {
      setIsLoadingLocations(false);
    }
  };

  // Helper functions
  const getProvinceName = (provinceId: number): string => {
    const province = provinces.find((p) => p.value === provinceId);
    return province ? province.label : "";
  };

  const getDistrictName = (districtId: number): string => {
    const district = districts.find((d) => d.value === districtId);
    return district ? district.label : "";
  };

  const getWardName = (wardCode: string): string => {
    const ward = wards.find((w) => w.value === wardCode);
    return ward ? ward.label : "";
  };

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

        // Fetch provinces for address form
        await fetchProvinces();

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

  // Calculate discount based on selected voucher
  const selectedVoucher = useMemo(() => {
    if (!selectedVoucherId) return null;
    for (const section of voucherSections) {
      const voucher = section.vouchers.find(v => v.id === selectedVoucherId);
      if (voucher) return voucher;
    }
    return null;
  }, [selectedVoucherId, voucherSections]);

  // Calculate discount amount (simplified calculation - should be done by backend)
  const discountAmount = useMemo(() => {
    if (!selectedVoucher) return 0;

    // Parse discount from voucher title (simplified - should use actual discount data)
    const title = selectedVoucher.title;
    if (title.includes("Miễn phí vận chuyển")) {
      // Free shipping voucher - discount shipping fee
      return Math.min(shippingFee, 30000); // Max 30k based on voucher description
    } else if (title.includes("Giảm")) {
      // Discount voucher - parse percentage or fixed amount
      const percentMatch = title.match(/(\d+)%/);
      const fixedMatch = title.match(/(\d+\.?\d*)\s*k/i);

      if (percentMatch) {
        const percent = parseInt(percentMatch[1]);
        const maxDiscount = title.includes("250.000") ? 250000 :
          title.includes("100.000") ? 100000 :
            title.includes("30.000") ? 30000 : 0;
        return Math.min((subtotal * percent) / 100, maxDiscount);
      } else if (fixedMatch) {
        const amount = parseFloat(fixedMatch[1]) * 1000;
        return Math.min(amount, subtotal);
      }
    }
    return 0;
  }, [selectedVoucher, subtotal, shippingFee]);

  const total = totalPrice > 0 ? totalPrice : (subtotal + shippingFee - discountAmount);
  const selectedPaymentMethodInfo =
    PAYMENT_METHODS.find((method) => method.id === selectedPaymentMethod) ??
    PAYMENT_METHODS[0];

  // Calculate total items count
  const totalItemsCount = checkoutItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (isPaymentMethodModalOpen) {
      setPendingPaymentMethod(selectedPaymentMethod);
    }
  }, [isPaymentMethodModalOpen, selectedPaymentMethod]);

  const handleOpenAddressModal = () => {
    if (addresses.length === 0) {
      setIsAddAddressModalOpen(true);
      return;
    }
    setPendingAddressId(selectedAddressId);
    setIsAddressModalOpen(true);
  };

  const handleOpenAddAddressModal = () => {
    setIsAddAddressModalOpen(true);
    setAddressFormData({
      name: "",
      phone: "",
      province: "",
      district: "",
      ward: "",
      detailAddress: "",
      isDefault: false,
    });
    setDistricts([]);
    setWards([]);
  };

  const handleCloseAddAddressModal = () => {
    setIsAddAddressModalOpen(false);
    setAddressFormData({
      name: "",
      phone: "",
      province: "",
      district: "",
      ward: "",
      detailAddress: "",
      isDefault: false,
    });
    setDistricts([]);
    setWards([]);
  };

  const handleProvinceChange = async (provinceId: number) => {
    setAddressFormData((prev) => ({
      ...prev,
      province: provinceId.toString(),
      district: "",
      ward: "",
    }));
    setDistricts([]);
    setWards([]);
    await fetchDistricts(provinceId);
  };

  const handleDistrictChange = async (districtId: number) => {
    setAddressFormData((prev) => ({
      ...prev,
      district: districtId.toString(),
      ward: "",
    }));
    setWards([]);
    await fetchWards(districtId);
  };

  const handleSaveNewAddress = async () => {
    // Validate form
    if (!addressFormData.name.trim()) {
      toast.error("Vui lòng nhập họ và tên");
      return;
    }
    if (!addressFormData.phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại");
      return;
    }
    if (!addressFormData.province || !addressFormData.district || !addressFormData.ward) {
      toast.error("Vui lòng chọn đầy đủ Tỉnh/Thành phố, Quận/Huyện, Phường/Xã");
      return;
    }
    if (!addressFormData.detailAddress.trim()) {
      toast.error("Vui lòng nhập địa chỉ chi tiết");
      return;
    }

    try {
      setLoading(true);

      const provinceId = parseInt(addressFormData.province);
      const districtId = parseInt(addressFormData.district);
      const wardCode = addressFormData.ward;

      const provinceName = getProvinceName(provinceId);
      const districtName = getDistrictName(districtId);
      const wardName = getWardName(wardCode);

      const createRequest: AddressCreationRequest = {
        street: addressFormData.detailAddress.trim(),
        wardCode: wardCode,
        wardName: wardName,
        districtId: districtId,
        districtName: districtName,
        provinceName: provinceName,
        fullAddress: `${addressFormData.detailAddress.trim()}, ${wardName}, ${districtName}, ${provinceName}, Vietnam`,
        name: addressFormData.name.trim(),
        phone: addressFormData.phone.trim().replace(/[()]/g, "").replace("+84 ", "").replace(/\s/g, ""),
      };

      const response = await addAddress(createRequest);
      toast.success("Đã thêm địa chỉ mới");

      // If setting as default, call setDefaultAddress
      if (addressFormData.isDefault && response.data) {
        await setDefaultAddress(response.data);
      }

      // Refresh addresses
      const addressResponse = await getUserAddresses();
      const addressList = addressResponse.addresses || [];
      const mappedAddresses: AddressOption[] = addressList.map((addr: AddressResponse) => {
        const region = [
          addr.wardName,
          addr.districtName,
          addr.provinceName
        ].filter(Boolean).join(", ");
        const fullAddress = addr.fullAddress || `${addr.street}, ${region}`;
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

      // Select the new address
      const newAddress = mappedAddresses.find(addr => addr.id === response.data);
      if (newAddress) {
        setSelectedAddressId(newAddress.id);
        setPendingAddressId(newAddress.id);
      } else if (mappedAddresses.length > 0) {
        const defaultAddr = mappedAddresses.find(addr => addr.isDefault) || mappedAddresses[0];
        setSelectedAddressId(defaultAddr.id);
        setPendingAddressId(defaultAddr.id);
      }

      handleCloseAddAddressModal();
    } catch (error: any) {
      console.error("Error saving address:", error);
      toast.error(error?.response?.data?.message || "Không thể lưu địa chỉ");
    } finally {
      setLoading(false);
    }
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
        <section className="w-full bg-gradient-to-b from-gray-50 to-white py-8 md:py-12">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="mb-8">
              <button
                onClick={() => navigate("/shop/cart")}
                className="flex items-center gap-2 text-gray-600 hover:text-[#E04D30] transition-all duration-200 mb-6 group"
              >
                <svg
                  className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                <span className="text-sm font-medium">Quay lại giỏ hàng</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="h-1 w-12 bg-[#E04D30] rounded-full"></div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Thanh toán
                </h1>
              </div>
              <p className="mt-2 text-gray-600 text-sm md:text-base">
                Vui lòng kiểm tra lại thông tin đơn hàng trước khi thanh toán
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm animate-in slide-in-from-top-2">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {loading ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E04D30]/10 mb-4">
                  <svg className="w-8 h-8 text-[#E04D30] animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <p className="text-gray-600 text-lg font-medium">Đang tải dữ liệu...</p>
              </div>
            ) : checkoutItems.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Giỏ hàng của bạn đang trống
                </h3>
                <p className="text-gray-600 mb-6">
                  Hãy thêm sản phẩm vào giỏ hàng để tiếp tục
                </p>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate("/shop/cart")}
                  className="bg-[#E04D30] hover:bg-[#c53b1d] text-white px-8"
                >
                  Quay lại giỏ hàng
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  <ShippingAddress
                    name={selectedAddress?.name || ""}
                    phone={selectedAddress?.phone || ""}
                    address={selectedAddress?.address || ""}
                    isDefault={Boolean(selectedAddress?.isDefault)}
                    onChange={handleOpenAddressModal}
                    isEmpty={addresses.length === 0}
                    onAddNew={handleOpenAddAddressModal}
                  />

                  <ProductsTable items={checkoutItems} />

                  {/* Notes and Voucher */}
                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5 hover:shadow-md transition-shadow duration-200">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Lời nhắn cho shop
                      </label>
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Nhập lưu ý cho shop (tùy chọn)..."
                        rows={4}
                        className="w-full border-gray-300 focus:border-[#E04D30] focus:ring-[#E04D30] rounded-lg transition-colors"
                      />
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#E04D30]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-semibold text-gray-900">Mã giảm giá</span>
                      </div>
                      <button
                        onClick={handleOpenVoucherModal}
                        className="text-sm text-[#E04D30] hover:text-[#c53b1d] transition-colors font-semibold flex items-center gap-1 group"
                      >
                        {selectedVoucher ? (
                          <>
                            <span className="px-3 py-1 bg-[#E04D30]/10 text-[#E04D30] rounded-md font-medium">
                              {selectedVoucher.code}
                            </span>
                            <span className="group-hover:underline">Thay đổi</span>
                          </>
                        ) : (
                          <>
                            <span>Chọn mã giảm giá</span>
                            <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                    {selectedVoucher && (
                      <div className="mt-3 p-3 bg-gradient-to-r from-[#E04D30]/5 to-orange-50 border border-[#E04D30]/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#E04D30]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-semibold text-gray-900">{selectedVoucher.code}</span>
                          </div>
                          <button
                            onClick={() => setSelectedVoucherId(null)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                            title="Xóa mã giảm giá"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <div className="mt-2 text-sm text-gray-700">{selectedVoucher.title}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 sticky top-6">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="h-1 w-8 bg-[#E04D30] rounded-full"></div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Tóm tắt đơn hàng
                      </h2>
                    </div>

                    {/* Product count */}
                    <div className="mb-5 pb-5 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Sản phẩm <span className="font-medium text-gray-900">({totalItemsCount})</span>
                        </span>
                        <span className="text-gray-900 font-semibold text-base">
                          {formatCurrencyVND(subtotal)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4 mb-5">
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
                      {selectedVoucher && (
                        <div className="space-y-2 pt-2 border-t border-gray-100">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Giảm giá</span>
                            <span className="text-[#E04D30] font-bold text-base">
                              -{formatCurrencyVND(discountAmount)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600 bg-gradient-to-r from-[#E04D30]/5 to-orange-50 px-3 py-2 rounded-lg border border-[#E04D30]/10">
                            <svg className="w-4 h-4 text-[#E04D30] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="flex-1 truncate font-medium">{selectedVoucher.code}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border-t-2 border-gray-300 pt-4 mb-5">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">
                          Tổng thanh toán
                        </span>
                        <span className="text-2xl font-extrabold text-[#E04D30]">
                          {formatCurrencyVND(total)}
                        </span>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="border-t border-gray-200 pt-5 mb-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-gray-700">Phương thức thanh toán</span>
                        <button
                          onClick={() => setIsPaymentMethodModalOpen(true)}
                          className="text-sm text-[#E04D30] hover:text-[#c53b1d] transition-colors font-medium"
                        >
                          Thay đổi
                        </button>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-[#E04D30]/10 flex items-center justify-center">
                          {selectedPaymentMethod === "BANKING" ? (
                            <svg className="w-5 h-5 text-[#E04D30]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-[#E04D30]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          )}
                        </div>
                        <p className="text-sm font-medium text-gray-900 flex-1">
                          {selectedPaymentMethodInfo.title}
                        </p>
                      </div>
                    </div>

                    {/* Place Order Button */}
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full bg-gradient-to-r from-[#E04D30] to-[#c53b1d] hover:from-[#c53b1d] hover:to-[#b0351a] text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
                      onClick={handlePlaceOrder}
                      disabled={isPlacingOrder || !selectedAddress || checkoutItems.length === 0}
                    >
                      {isPlacingOrder ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Đang xử lý...
                        </span>
                      ) : (
                        "Đặt hàng ngay"
                      )}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseAddressModal}
          />
          <div className="relative w-full max-w-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E04D30]/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#E04D30]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Địa chỉ giao hàng
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Chọn địa chỉ nhận hàng của bạn
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseAddressModal}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="max-h-[500px] overflow-y-auto">
              {addresses.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Chưa có địa chỉ
                  </h4>
                  <p className="text-gray-600 text-sm mb-6 max-w-sm mx-auto">
                    Bạn cần thêm địa chỉ giao hàng để tiếp tục đặt hàng
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => {
                      handleCloseAddressModal();
                      navigate("/user/profile?tab=addresses");
                    }}
                    className="bg-[#E04D30] hover:bg-[#c53b1d] text-white px-6"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Thêm địa chỉ mới
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {addresses.map((address) => (
                    <label
                      key={address.id}
                      className={`flex items-start gap-4 px-6 py-5 cursor-pointer transition-all duration-200 ${pendingAddressId === address.id
                        ? "bg-[#E04D30]/5 border-l-4 border-[#E04D30]"
                        : "hover:bg-gray-50"
                        }`}
                    >
                      <div className="mt-1">
                        <input
                          type="radio"
                          name="address"
                          className="w-5 h-5 text-[#E04D30] border-gray-300 focus:ring-[#E04D30] focus:ring-2"
                          checked={pendingAddressId === address.id}
                          onChange={() => setPendingAddressId(address.id)}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="font-bold text-gray-900 text-base">
                            {address.name}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-700">{address.phone}</span>
                          {address.isDefault && (
                            <span className="ml-2 px-2.5 py-1 bg-[#E04D30]/10 text-[#E04D30] text-xs font-semibold rounded-full">
                              Mặc định
                            </span>
                          )}
                        </div>
                        <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                          {address.address}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          type="button"
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                            event.preventDefault();
                            event.stopPropagation();
                            handleOpenEditModal(address);
                          }}
                          title="Cập nhật địa chỉ"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                            event.preventDefault();
                            event.stopPropagation();
                            handleDeleteAddress(address.id);
                          }}
                          title="Xóa địa chỉ"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {addresses.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                <button
                  onClick={() => {
                    handleCloseAddressModal();
                    navigate("/user/profile?tab=addresses");
                  }}
                  className="text-sm text-[#E04D30] hover:text-[#c53b1d] font-medium flex items-center gap-2 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Thêm địa chỉ mới
                </button>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCloseAddressModal}
                    className="px-5 py-2 text-sm text-gray-700 font-medium hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Hủy
                  </button>
                  <Button
                    variant="primary"
                    onClick={handleConfirmAddress}
                    className="px-6 bg-[#E04D30] hover:bg-[#c53b1d] text-white"
                    disabled={!pendingAddressId || pendingAddressId === 0}
                  >
                    Xác nhận
                  </Button>
                </div>
              </div>
            )}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClosePaymentMethodModal}
          />
          <div className="relative w-full max-w-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E04D30]/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#E04D30]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Phương thức thanh toán
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Chọn phương thức thanh toán cho đơn hàng
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClosePaymentMethodModal}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => {
                  const isActive = pendingPaymentMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPendingPaymentMethod(method.id)}
                      className={`relative w-full text-left px-5 py-4 border-2 rounded-xl transition-all duration-200 ${
                        isActive
                          ? "border-[#E04D30] bg-[#E04D30]/5 shadow-md"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      {/* Check Icon */}
                      <div className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        isActive
                          ? "bg-[#E04D30] text-white scale-100"
                          : "bg-gray-200 text-transparent scale-0"
                      }`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>

                      {/* Payment Method Icon */}
                      <div className="flex items-start gap-4 pr-8">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                          isActive
                            ? "bg-[#E04D30]/10"
                            : "bg-gray-100"
                        }`}>
                          {method.id === "BANKING" ? (
                            <svg className={`w-6 h-6 ${isActive ? "text-[#E04D30]" : "text-gray-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          ) : (
                            <svg className={`w-6 h-6 ${isActive ? "text-[#E04D30]" : "text-gray-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-base font-bold mb-1.5 transition-colors ${
                            isActive ? "text-[#E04D30]" : "text-gray-900"
                          }`}>
                            {method.title}
                          </div>
                          <div className="text-sm text-gray-600 leading-relaxed">
                            {method.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleClosePaymentMethodModal}
                className="w-full sm:w-auto !bg-white !border-gray-300 !text-gray-700 hover:!bg-gray-50 hover:!border-gray-400"
              >
                Hủy
              </Button>
              <Button
                variant="primary"
                className="w-full sm:w-auto px-8 !bg-[#E04D30] !border-[#E04D30] hover:!bg-[#c53b1d] hover:!border-[#c53b1d] shadow-md hover:shadow-lg transition-all"
                onClick={handleConfirmPaymentMethod}
              >
                Xác nhận
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Address Modal */}
      {isAddAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseAddAddressModal}
          />
          <div className="relative w-full max-w-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E04D30]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#E04D30]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Thêm địa chỉ mới
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Điền thông tin địa chỉ nhận hàng
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseAddAddressModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form Content - Scrollable */}
            <div className="px-6 py-6 space-y-5 overflow-y-auto flex-1">
              {/* Personal Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-[#E04D30]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <h3 className="text-base font-semibold text-gray-900">
                    Thông tin người nhận
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={addressFormData.name}
                      onChange={(e) => setAddressFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nhập họ và tên người nhận"
                      className="hover:!border-[#E04D30] focus:!border-[#E04D30] focus:!ring-[#E04D30]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="tel"
                      value={addressFormData.phone}
                      onChange={(e) => setAddressFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Nhập số điện thoại (ví dụ: 0912345678)"
                      className="hover:!border-[#E04D30] focus:!border-[#E04D30] focus:!ring-[#E04D30]"
                    />
                    <p className="text-xs text-gray-500 mt-1.5">
                      Số điện thoại để liên hệ khi giao hàng
                    </p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-2"></div>

              {/* Address Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-[#E04D30]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <h3 className="text-base font-semibold text-gray-900">
                    Địa chỉ nhận hàng
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* Province */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tỉnh/Thành Phố <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={addressFormData.province ? parseInt(addressFormData.province) : undefined}
                      onChange={(value: number) => handleProvinceChange(value)}
                      placeholder="Chọn Tỉnh/Thành Phố"
                      loading={isLoadingLocations}
                      disabled={isLoadingLocations}
                      size="large"
                      className="w-full [&_.ant-select-selector]:!h-11 [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector:hover]:!border-[#E04D30] [&.ant-select-focused_.ant-select-selector]:!border-[#E04D30]"
                      options={provinces.map((p) => ({
                        label: p.label,
                        value: p.value,
                      }))}
                    />
                  </div>

                  {/* District */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quận/Huyện <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={addressFormData.district ? parseInt(addressFormData.district) : undefined}
                      onChange={(value: number) => handleDistrictChange(value)}
                      placeholder="Chọn Quận/Huyện"
                      loading={isLoadingLocations}
                      disabled={!addressFormData.province || isLoadingLocations}
                      size="large"
                      className="w-full [&_.ant-select-selector]:!h-11 [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector:hover]:!border-[#E04D30] [&.ant-select-focused_.ant-select-selector]:!border-[#E04D30]"
                      options={districts.map((d) => ({
                        label: d.label,
                        value: d.value,
                      }))}
                      notFoundContent={
                        !addressFormData.province ? (
                          <div className="py-4 text-center text-gray-400">
                            Vui lòng chọn Tỉnh/Thành phố trước
                          </div>
                        ) : "Không có dữ liệu"
                      }
                    />
                  </div>

                  {/* Ward */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phường/Xã <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={addressFormData.ward}
                      onChange={(value: string) => setAddressFormData(prev => ({ ...prev, ward: value }))}
                      placeholder="Chọn Phường/Xã"
                      loading={isLoadingLocations}
                      disabled={!addressFormData.district || isLoadingLocations}
                      size="large"
                      className="w-full [&_.ant-select-selector]:!h-11 [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector:hover]:!border-[#E04D30] [&.ant-select-focused_.ant-select-selector]:!border-[#E04D30]"
                      options={wards.map((w) => ({
                        label: w.label,
                        value: w.value,
                      }))}
                      notFoundContent={
                        !addressFormData.district ? (
                          <div className="py-4 text-center text-gray-400">
                            Vui lòng chọn Quận/Huyện trước
                          </div>
                        ) : "Không có dữ liệu"
                      }
                    />
                  </div>

                  {/* Detail Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ chi tiết <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      value={addressFormData.detailAddress}
                      onChange={(e) => setAddressFormData(prev => ({ ...prev, detailAddress: e.target.value }))}
                      placeholder="Nhập số nhà, tên đường, tòa nhà..."
                      rows={3}
                      className="hover:!border-[#E04D30] focus:!border-[#E04D30] focus:!ring-[#E04D30]"
                    />
                    <p className="text-xs text-gray-500 mt-1.5">
                      Ví dụ: Số 123, Đường ABC, Tòa nhà XYZ
                    </p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-2"></div>

              {/* Default Address Checkbox */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="isDefaultNew"
                    checked={addressFormData.isDefault}
                    onChange={(e) => setAddressFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                    label=""
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="isDefaultNew"
                      className="text-sm font-medium text-gray-700 cursor-pointer block"
                    >
                      Đặt làm địa chỉ mặc định
                    </label>
                    <p className="text-xs text-gray-500 mt-1.5">
                      Địa chỉ này sẽ được sử dụng mặc định khi đặt hàng
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-6 py-5 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-end gap-3 sticky bottom-0">
              <Button
                variant="outline"
                size="md"
                onClick={handleCloseAddAddressModal}
                disabled={loading}
                className="w-full sm:w-auto !bg-white !border-gray-300 !text-gray-700 hover:!bg-gray-50"
              >
                Hủy
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleSaveNewAddress}
                disabled={loading}
                className="w-full sm:w-auto px-8 !bg-[#E04D30] !border-[#E04D30] hover:!bg-[#c53b1d] disabled:!opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Đang lưu...
                  </span>
                ) : (
                  "Lưu địa chỉ"
                )}
              </Button>
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
