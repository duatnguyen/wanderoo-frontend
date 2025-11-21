import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreditCardPercentIcon } from "@/components/icons/discount";
import Icon from "@/components/icons/Icon";
import CustomRadio from "@/components/ui/custom-radio";
import type { VoucherEditData, VoucherProduct } from "@/types/voucher";

// Date formatting utilities
const formatDateTimeForInput = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = date.getFullYear();
  const MM = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
};

interface VoucherFormData {
  // Basic Information
  voucherName: string;
  voucherCode: string;
  description: string;
  startDate: string;
  endDate: string;

  // Voucher Settings
  discountType: "percentage" | "fixed";
  discountValue: string;
  maxDiscountLimit: "limited" | "unlimited";
  maxDiscountValue: string;
  minOrderAmount: string;
  maxUsage: string;
  maxUsagePerCustomer: string;

  // Display Settings
  displaySetting: "pos" | "website" | "pos-website";
}

interface EditLocationState {
  mode?: "edit";
  voucher?: {
    editData?: VoucherEditData;
  };
}

const createDefaultFormData = (): VoucherFormData => ({
  voucherName: "",
  voucherCode: "",
  description: "",
  startDate: "",
  endDate: "",
  discountType: "percentage",
  discountValue: "",
  maxDiscountLimit: "unlimited",
  maxDiscountValue: "",
  minOrderAmount: "",
  maxUsage: "",
  maxUsagePerCustomer: "",
  displaySetting: "website",
});

const AdminCreateVoucherProduct: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, voucher } =
    (location.state as EditLocationState | undefined) || {};
  const editData = voucher?.editData;
  const isEditMode = mode === "edit" && !!editData;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmedProducts, setConfirmedProducts] = useState<VoucherProduct[]>(
    []
  );
  const [appliedProductsPage, setAppliedProductsPage] = useState(1);
  const [formData, setFormData] = useState<VoucherFormData>(
    createDefaultFormData
  );

  useEffect(() => {
    if (isEditMode && editData) {
      setFormData({
        voucherName: editData.voucherName ?? "",
        voucherCode: editData.voucherCode ?? "",
        description: editData.description ?? "",
        startDate: editData.startDate ?? "",
        endDate: editData.endDate ?? "",
        discountType: editData.discountType ?? "percentage",
        discountValue: editData.discountValue ?? "",
        maxDiscountLimit: editData.maxDiscountLimit ?? "unlimited",
        maxDiscountValue: editData.maxDiscountValue ?? "",
        minOrderAmount: editData.minOrderAmount ?? "",
        maxUsage: editData.maxUsage ?? "",
        maxUsagePerCustomer: editData.maxUsagePerCustomer ?? "",
        displaySetting: editData.displaySetting ?? "website",
      });
      const applied = (editData.appliedProducts ?? []).map((product) => ({
        ...product,
      }));
      setConfirmedProducts(applied);
      setSelectedProducts(applied.map((product) => product.id));
      setAppliedProductsPage(1);
    } else {
      setFormData(createDefaultFormData());
      setConfirmedProducts([]);
      setSelectedProducts([]);
      setAppliedProductsPage(1);
    }
  }, [isEditMode, editData]);

  const pageTitle = isEditMode
    ? "Chỉnh sửa mã giảm giá"
    : "Tạo mã giảm giá mới";

  // Mock product data
  const products: VoucherProduct[] = [
    {
      id: "1",
      name: "Giày leo núi nữ cổ thấp Humtto Hiking Shoes 14013...",
      image: "/placeholder-product.jpg",
      barcode: "M3 Barcode: UEYUQW9238239284",
      price: 32000,
      available: 3,
    },
    {
      id: "2",
      name: "Giày chạy trail nữ ON Cloudventure Shoes Ice Heron",
      image: "/placeholder-product.jpg",
      barcode: "MS:UEYUQW9238239284",
      price: 32000,
      available: 3,
    },
    {
      id: "3",
      name: "Giày chạy bộ nữ ON Cloudstratus Running Sh Whi...",
      image: "/placeholder-product.jpg",
      barcode: "MS:UEYUQW9238239284",
      price: 32000,
      available: 3,
    },
    {
      id: "4",
      name: "Giày chạy bộ nữ ON Cloudrunner Running Shoes",
      image: "/placeholder-product.jpg",
      barcode: "MS:UEYUQW9238239284",
      price: 32000,
      available: 3,
    },
    {
      id: "5",
      name: "Bình nước giữ nhiệt 200ml Hydro Flask Micro Hydr...",
      image: "/placeholder-product.jpg",
      barcode: "MS:UEYUQW9238239284",
      price: 32000,
      available: 3,
    },
    {
      id: "6",
      name: "Giường cắm trại Snowline Camping Cot 2Way SHOO...",
      image: "/placeholder-product.jpg",
      barcode: "MS:UEYUQW9238239284",
      price: 32000,
      available: 3,
    },
    {
      id: "7",
      name: "Lều cắm trại 1 người Snowline Alpine Cot Tent SN...",
      image: "/placeholder-product.jpg",
      barcode: "MS:UEYUQW9238239284",
      price: 32000,
      available: 3,
    },
    {
      id: "8",
      name: "Giày leo núi cổ cao Clorts Trekking Shoes 38046A",
      image: "/placeholder-product.jpg",
      barcode: "MS:UEYUQW9238239284",
      price: 32000,
      available: 3,
    },
    {
      id: "9",
      name: "Bộ gây leo núi Coleman Treking Pole 2 PC 200001....",
      image: "/placeholder-product.jpg",
      barcode: "MS:UEYUQW9238239284",
      price: 32000,
      available: 3,
    },
    {
      id: "10",
      name: "Tất leo núi cao có Gothiar Performa Crew Socks",
      image: "/placeholder-product.jpg",
      barcode: "MS:UEYUQW9238239284",
      price: 32000,
      available: 3,
    },
  ];

  const itemsPerPage = 10;
  const totalPages = 20;
  const displayProducts = products.slice(0, itemsPerPage);

  const handleProductToggle = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === displayProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(displayProducts.map((p) => p.id));
    }
  };

  const isAllSelected =
    displayProducts.length > 0 &&
    selectedProducts.length === displayProducts.length;

  // Calculate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        // Show first pages
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("...");
      } else if (currentPage >= totalPages - 2) {
        // Show last pages
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show middle pages
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
      }
    }
    return pages;
  };

  // Custom Checkbox Component
  const CustomCheckbox = ({
    checked,
    onChange,
  }: {
    checked: boolean;
    onChange: () => void;
  }) => {
    return (
      <div
        onClick={onChange}
        className={`w-[16px] h-[16px] border-2 rounded cursor-pointer flex items-center justify-center transition-colors ${
          checked
            ? "bg-[#e04d30] border-[#e04d30]"
            : "bg-white border-[#d1d5db]"
        }`}
      >
        {checked && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 3L4.5 8.5L2 6"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const handleInputChange = (field: keyof VoucherFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBackClick = () => {
    navigate("/admin/discounts");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(
      isEditMode ? "Voucher form updated:" : "Voucher form submitted:",
      {
        ...formData,
        appliedProducts: confirmedProducts,
      }
    );
    // Handle form submission logic here
  };

  return (
    <div className="w-full overflow-x-auto min-h-screen">
      <div className="flex flex-col gap-[10px] items-start w-full">
        {/* Header with Back Button */}
        <div className="flex flex-col gap-[8px] items-start justify-center w-full">
          <div className="flex gap-[4px] items-center">
            <button
              onClick={handleBackClick}
              className="relative shrink-0 size-[24px] flex items-center justify-center cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-[#737373]" />
            </button>
            <h1 className="font-montserrat font-bold text-[#272424] text-[24px] leading-[1.5] whitespace-nowrap">
              {pageTitle}
            </h1>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-[16px] w-full flex-shrink-0"
        >
          {/* Basic Information Section */}
          <div className="bg-white border-2 border-[#e7e7e7] box-border flex flex-col gap-[16px] items-start p-[24px] relative rounded-[8px] w-full overflow-hidden flex-shrink-0">
            {/* Title Section */}
            <div className="flex flex-col gap-[8px]">
              <h2 className="font-montserrat font-bold text-[18px] text-[#272424] leading-[normal]">
                Thông tin cơ bản
              </h2>
            </div>

            {/* Voucher Type Indicator */}
            <div className="w-full flex justify-center">
              <div className="bg-[#e04d30] border border-white rounded-[12px] h-[52px] px-[16px] flex items-center gap-[4px]">
                <CreditCardPercentIcon size={24} color="#FFFFFF" />
                <span className="font-semibold text-[20px] text-white leading-[1.4]">
                  Voucher sản phẩm
                </span>
              </div>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-[16px]">
              {/* Voucher Name Field */}
              <div className="flex flex-row items-start gap-[16px]">
                <label className="font-semibold text-[14px] text-[#272424] leading-[1.4] w-[215px] flex-shrink-0 text-right">
                  Tên chương trình giảm giá
                </label>
                <div className="flex-1">
                  <FormInput
                    placeholder="Nhập tên chương trình giảm giá"
                    value={formData.voucherName}
                    onChange={(e) =>
                      handleInputChange("voucherName", e.target.value)
                    }
                    containerClassName="h-[36px] w-[873px]"
                    required
                  />
                  <p className="mt-[6px] font-medium text-[12px] text-[#737373] leading-[1.4]">
                    Tên voucher sẽ không được hiển thị cho người mua
                  </p>
                </div>
              </div>

              {/* Voucher Code Field */}
              <div className="flex flex-row items-start gap-[16px]">
                <label className="font-semibold text-[14px] text-[#272424] leading-[1.4] w-[215px] flex-shrink-0 text-right">
                  Mã voucher
                </label>
                <div className="flex-1">
                  <FormInput
                    placeholder="Nhập mã voucher"
                    value={formData.voucherCode}
                    onChange={(e) =>
                      handleInputChange("voucherCode", e.target.value)
                    }
                    containerClassName="h-[36px] w-[873px]"
                    required
                  />
                  <p className="mt-[6px] font-medium text-[12px] text-[#737373] leading-[1.4]">
                    Vui lòng nhập các kí tự chữ cái A - Z, số 0 - 9, tối đa 5 kí
                    tự
                  </p>
                </div>
              </div>

              {/* Date Range Field */}
              <div className="flex flex-row items-start gap-[16px]">
                <label className="font-semibold text-[14px] text-[#272424] leading-[1.4] w-[215px] flex-shrink-0 text-right">
                  Thời gian sử dụng mã
                </label>
                <div className="flex-1 w-full flex flex-row gap-[4px] items-center flex-shrink-0">
                  {/* Start DateTime */}
                  <div className="flex-shrink-0">
                    <FormInput
                      type="datetime-local"
                      value={formatDateTimeForInput(formData.startDate)}
                      onChange={(e) =>
                        handleInputChange("startDate", e.target.value)
                      }
                      containerClassName="h-[36px] w-[240px]"
                      className={!formData.startDate ? "opacity-50" : ""}
                    />
                  </div>

                  {/* Dash Separator - hidden on mobile */}
                  <div className="hidden sm:flex items-center justify-center text-[#272424] px-[4px]">
                    -
                  </div>

                  {/* End DateTime */}
                  <div className="flex-shrink-0">
                    <FormInput
                      type="datetime-local"
                      value={formatDateTimeForInput(formData.endDate)}
                      onChange={(e) =>
                        handleInputChange("endDate", e.target.value)
                      }
                      containerClassName="h-[36px] w-[240px]"
                      className={!formData.endDate ? "opacity-50" : ""}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Voucher Settings Section */}
          <div className="bg-white border-2 border-[#e7e7e7] box-border flex flex-col gap-[16px] items-start p-[24px] relative rounded-[8px] w-full overflow-hidden flex-shrink-0">
            {/* Title Section */}
            <div className="flex flex-col gap-[8px]">
              <h2 className="font-montserrat font-bold text-[18px] text-[#272424] leading-[normal]">
                Thiết lập mã giảm giá
              </h2>
            </div>

            {/* Form Fields */}
            <div className="px-0 py-[12px] flex flex-col gap-[16px]">
              {/* Discount Type and Value Row */}
              <div className="flex flex-row items-start gap-[16px]">
                <label className="font-semibold text-[14px] text-[#272424] leading-[1.4] w-[215px] flex-shrink-0 text-right">
                  Loại giảm giá | Mức giảm
                </label>
                <div className="flex-1 flex flex-row gap-[16px] items-center flex-shrink-0 w-[873px]">
                  {/* Discount Type Dropdown */}
                  <div className="w-[164px] flex-shrink-0">
                    <DropdownMenu
                      open={isDropdownOpen}
                      onOpenChange={setIsDropdownOpen}
                    >
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-[164px] justify-between h-[36px] border-[#e04d30] border-[1.6px] rounded-[12px] px-[16px] whitespace-nowrap hover:bg-[#e04d30]/5 "
                        >
                          <span className="font-medium text-[13px] text-[#272424]">
                            {formData.discountType === "percentage"
                              ? "Theo phần trăm"
                              : "Theo số tiền"}
                          </span>
                          <Icon
                            name="chevron-down"
                            size={11}
                            color="#272424"
                            className="ml-2"
                          />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-auto min-w-fit">
                        <DropdownMenuItem
                          onClick={() => {
                            handleInputChange("discountType", "percentage");
                            setIsDropdownOpen(false);
                          }}
                        >
                          Theo phần trăm
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            handleInputChange("discountType", "fixed");
                            setIsDropdownOpen(false);
                          }}
                        >
                          Theo số tiền
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Discount Value Input */}
                  <div className="flex-1">
                    <FormInput
                      placeholder={
                        formData.discountType === "percentage" ? "%" : "đ"
                      }
                      value={formData.discountValue}
                      onChange={(e) =>
                        handleInputChange("discountValue", e.target.value)
                      }
                      containerClassName="h-[36px] w-full"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Maximum Discount (only for percentage) */}
              {formData.discountType === "percentage" && (
                <div className="flex flex-row items-start gap-[16px]">
                  <label className="font-semibold text-[14px] text-[#272424] leading-[1.4] w-[215px] flex-shrink-0 text-right">
                    Mức giảm tối đa
                  </label>
                  <div className="flex-1 flex flex-col gap-[12px] flex-shrink-0">
                    <div className="flex flex-row gap-[12px]">
                      <CustomRadio
                        name="maxDiscountLimit"
                        value="limited"
                        checked={formData.maxDiscountLimit === "limited"}
                        onChange={(e) =>
                          handleInputChange("maxDiscountLimit", e.target.value)
                        }
                        label="Giới hạn"
                      />
                      <CustomRadio
                        name="maxDiscountLimit"
                        value="unlimited"
                        checked={formData.maxDiscountLimit === "unlimited"}
                        onChange={(e) =>
                          handleInputChange("maxDiscountLimit", e.target.value)
                        }
                        label="Không giới hạn"
                      />
                    </div>
                    {formData.maxDiscountLimit === "limited" && (
                      <div>
                        <FormInput
                          placeholder="đ"
                          value={formData.maxDiscountValue}
                          onChange={(e) =>
                            handleInputChange(
                              "maxDiscountValue",
                              e.target.value
                            )
                          }
                          containerClassName="h-[36px] w-[873px]"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Minimum Order Amount */}
              <div className="flex flex-row items-start gap-[16px]">
                <label className="font-semibold text-[14px] text-[#272424] leading-[1.4] w-[215px] flex-shrink-0 text-right">
                  Giá trị đơn hàng tối thiểu
                </label>
                <div className="flex-1">
                  <FormInput
                    placeholder="đ"
                    value={formData.minOrderAmount}
                    onChange={(e) =>
                      handleInputChange("minOrderAmount", e.target.value)
                    }
                    containerClassName="h-[36px] w-[873px]"
                  />
                </div>
              </div>

              {/* Maximum Usage */}
              <div className="flex flex-row items-start gap-[16px]">
                <label className="font-semibold text-[14px] text-[#272424] leading-[1.4] w-[215px] flex-shrink-0 text-right">
                  Tổng lượt sử dụng tối đa
                </label>
                <div className="flex-1 flex flex-col flex-shrink-0">
                  <FormInput
                    placeholder="Nhập số lượt sử dụng"
                    value={formData.maxUsage}
                    onChange={(e) =>
                      handleInputChange("maxUsage", e.target.value)
                    }
                    containerClassName="h-[36px] w-[873px]"
                  />
                  <p className="mt-[6px] font-medium text-[12px] text-[#737373] leading-[1.4] text-left">
                    Tổng số mã giảm giá tối đa có thể sử dụng
                  </p>
                </div>
              </div>

              {/* Maximum Usage Per Customer */}
              <div className="flex flex-row items-start gap-[16px]">
                <label className="font-semibold text-[14px] text-[#272424] leading-[1.4] w-[215px] flex-shrink-0 text-right">
                  Lượt sử dụng tối đa/người
                </label>
                <div className="flex-1">
                  <FormInput
                    placeholder="Nhập số lượt sử dụng"
                    value={formData.maxUsagePerCustomer}
                    onChange={(e) =>
                      handleInputChange("maxUsagePerCustomer", e.target.value)
                    }
                    containerClassName="h-[36px] w-[873px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Display Settings Section */}
          <div className="bg-white border-2 border-[#e7e7e7] box-border flex flex-col gap-[16px] items-start p-[24px] relative rounded-[8px] w-full overflow-hidden flex-shrink-0">
            {/* Title Section */}
            <div className="flex flex-col gap-[8px]">
              <h2 className="font-montserrat font-bold text-[16px] text-[#272424] leading-[normal]">
                Hiển thị mã giảm giá và sản phẩm áp dụng
              </h2>
            </div>

            {/* Form Fields */}
            <div className="px-0 py-[12px] flex flex-col gap-[16px]">
              {/* Display Setting */}
              <div className="flex flex-row items-start gap-[16px]">
                <label className="font-semibold text-[14px] text-[#272424] leading-[1.4] w-[215px] flex-shrink-0 text-right">
                  Thiết lập hiển thị
                </label>
                <div className="flex-1 flex flex-col gap-[20px] flex-shrink-0">
                  <CustomRadio
                    name="displaySetting"
                    value="pos"
                    checked={formData.displaySetting === "pos"}
                    onChange={(e) =>
                      handleInputChange("displaySetting", e.target.value)
                    }
                    label="POS"
                  />
                  <CustomRadio
                    name="displaySetting"
                    value="website"
                    checked={formData.displaySetting === "website"}
                    onChange={(e) =>
                      handleInputChange("displaySetting", e.target.value)
                    }
                    label="Website"
                  />
                  <CustomRadio
                    name="displaySetting"
                    value="pos-website"
                    checked={formData.displaySetting === "pos-website"}
                    onChange={(e) =>
                      handleInputChange("displaySetting", e.target.value)
                    }
                    label="POS + Website"
                  />
                </div>
              </div>

              {/* Applied Products */}
              <div className="flex flex-col gap-[14px]">
                <div
                  className={`flex flex-row items-center gap-[16px] ${confirmedProducts.length > 0 ? "justify-between" : ""}`}
                >
                  <div className="flex flex-row items-center gap-[8px]">
                    <label className="font-semibold text-[14px] text-[#272424] leading-[1.4] w-[215px] flex-shrink-0 text-right">
                      Sản phẩm được áp dụng
                    </label>
                    {confirmedProducts.length > 0 && (
                      <span className="font-medium text-[14px] text-[#272424]">
                        {confirmedProducts.length} Sản phẩm được chọn
                      </span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => setIsProductModalOpen(true)}
                      className="bg-white border border-[#e04d30] rounded-[8px] px-[12px] py-[8px] flex items-center gap-[8px] hover:bg-[#e04d30]/5 transition-colors"
                    >
                      <Icon name="plus" size={16} color="#e04d30" />
                      <span className="font-semibold text-[14px] text-[#e04d30] leading-[1.4]">
                        Thêm sản phẩm
                      </span>
                    </button>
                  </div>
                </div>

                {/* Products Table */}
                {confirmedProducts.length > 0 && (
                  <div className="bg-white border border-[#e7e7e7] rounded-[12px] overflow-hidden ml-[200px] sm:ml-[215px] max-w-[calc(100%-200px)] sm:max-w-[calc(100%-215px)] mt-[4px]">
                    <table className="w-full">
                      <thead className="bg-[#f5f5f5]">
                        <tr>
                          <th className="px-[16px] py-[12px] text-left font-semibold text-[14px] text-[#272424]">
                            Sản phẩm
                          </th>
                          <th className="px-[16px] py-[12px] text-left font-semibold text-[14px] text-[#272424]">
                            Đơn giá
                          </th>
                          <th className="px-[16px] py-[12px] text-center font-semibold text-[14px] text-[#272424]">
                            Số Lượng
                          </th>
                          <th className="px-[16px] py-[12px] text-center font-semibold text-[14px] text-[#272424]">
                            Hoạt động
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {confirmedProducts
                          .slice(
                            (appliedProductsPage - 1) * 5,
                            appliedProductsPage * 5
                          )
                          .map((product) => (
                            <tr
                              key={product.id}
                              className="border-b border-[#e7e7e7] last:border-b-0"
                            >
                              <td className="px-[16px] py-[12px]">
                                <div className="flex items-center gap-[8px]">
                                  <div className="w-[32px] h-[32px] bg-[#f5f5f5] rounded-[6px] flex items-center justify-center flex-shrink-0 overflow-hidden">
                                    <img
                                      src={product.image}
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        (
                                          e.target as HTMLImageElement
                                        ).style.display = "none";
                                      }}
                                    />
                                  </div>
                                  <span className="font-medium text-[14px] text-[#272424] truncate max-w-[300px]">
                                    {product.name}
                                  </span>
                                </div>
                              </td>
                              <td className="px-[16px] py-[12px]">
                                <span className="font-semibold text-[14px] text-[#272424]">
                                  {formatPrice(product.price)}
                                </span>
                              </td>
                              <td className="px-[16px] py-[12px] text-center">
                                <span className="font-semibold text-[14px] text-[#272424]">
                                  1
                                </span>
                              </td>
                              <td className="px-[16px] py-[12px] text-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setConfirmedProducts((prev) =>
                                      prev.filter((p) => p.id !== product.id)
                                    );
                                  }}
                                  className="p-[8px] hover:bg-[#f5f5f5] rounded-[6px] transition-colors inline-flex items-center justify-center"
                                >
                                  <Icon
                                    name="trash"
                                    size={18}
                                    color="#e04d30"
                                  />
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>

                    {/* Pagination for Applied Products */}
                    {confirmedProducts.length > 5 && (
                      <div className="px-[16px] py-[12px] border-t border-[#e7e7e7] flex justify-end">
                        <div className="flex items-center gap-[8px]">
                          <button
                            onClick={() =>
                              setAppliedProductsPage((p) => Math.max(1, p - 1))
                            }
                            disabled={appliedProductsPage === 1}
                            className="p-[6px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f5f5f5] transition-colors rounded-[6px]"
                          >
                            <Icon name="arrow-left" size={14} color="#272424" />
                          </button>
                          {Array.from(
                            {
                              length: Math.ceil(confirmedProducts.length / 5),
                            },
                            (_, i) => i + 1
                          ).map((page) => (
                            <button
                              key={page}
                              onClick={() => setAppliedProductsPage(page)}
                              className={`w-[28px] h-[28px] flex items-center justify-center text-[13px] font-semibold rounded-[6px] transition-colors ${
                                appliedProductsPage === page
                                  ? "bg-[#e04d30] text-white"
                                  : "text-[#272424] hover:bg-[#f5f5f5]"
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                          <button
                            onClick={() =>
                              setAppliedProductsPage((p) =>
                                Math.min(
                                  Math.ceil(confirmedProducts.length / 5),
                                  p + 1
                                )
                              )
                            }
                            disabled={
                              appliedProductsPage >=
                              Math.ceil(confirmedProducts.length / 5)
                            }
                            className="p-[6px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f5f5f5] transition-colors rounded-[6px]"
                          >
                            <Icon
                              name="arrow-left"
                              size={14}
                              color="#272424"
                              className="rotate-180"
                            />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-[16px] justify-end w-full">
            <Button
              type="button"
              variant="secondary"
              onClick={handleBackClick}
              className="text-[14px]"
            >
              Hủy
            </Button>
            <Button type="submit" variant="default" className="text-[14px]">
              {isEditMode ? "Lưu thay đổi" : "Xác nhận"}
            </Button>
          </div>
        </form>

        {/* Product Selection Modal */}
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsProductModalOpen(false)}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-[20px] w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col z-50">
              {/* Header */}
              <div className="px-[16px] py-[12px] border-b border-[#e7e7e7]">
                <h2 className="font-bold text-[16px] text-[#272424]">
                  Chọn sản phẩm
                </h2>
              </div>

              {/* Table Content */}
              <div className="flex-1 overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-[#f5f5f5] sticky top-0">
                    <tr>
                      <th className="pl-[10px] pr-[2px] py-[8px] text-left font-semibold text-[12px] text-[#272424]">
                        <div className="flex items-center gap-[8px]">
                          <CustomCheckbox
                            checked={isAllSelected}
                            onChange={handleSelectAll}
                          />
                          <span>Sản phẩm</span>
                        </div>
                      </th>
                      <th className="pl-[2px] pr-[6px] py-[8px] text-left font-semibold text-[12px] text-[#272424]">
                        Đơn giá
                      </th>
                      <th className="pl-[6px] pr-[10px] py-[8px] text-center font-semibold text-[12px] text-[#272424]">
                        Có thể bán
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-[#e7e7e7]"
                      >
                        <td className="pl-[10px] pr-[2px] py-[8px]">
                          <div className="flex items-center gap-[8px]">
                            <CustomCheckbox
                              checked={selectedProducts.includes(product.id)}
                              onChange={() => handleProductToggle(product.id)}
                            />
                            <div className="w-[40px] h-[40px] bg-[#f5f5f5] rounded-[4px] flex items-center justify-center flex-shrink-0">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-[4px]"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display =
                                    "none";
                                }}
                              />
                            </div>
                            <div className="flex flex-col gap-[2px] min-w-0">
                              <span className="font-medium text-[12px] text-[#272424] truncate">
                                {product.name}
                              </span>
                              <span className="font-normal text-[10px] text-[#737373] truncate">
                                Mã barcode:{" "}
                                {product.barcode.replace(
                                  /^(M3 Barcode:|MS:)\s*/i,
                                  ""
                                )}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="pl-[2px] pr-[6px] py-[8px]">
                          <span className="font-semibold text-[12px] text-[#272424]">
                            {formatPrice(product.price)}
                          </span>
                        </td>
                        <td className="pl-[6px] pr-[10px] py-[8px] text-center">
                          <span className="font-semibold text-[12px] text-[#272424]">
                            {product.available}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer with Pagination and Buttons */}
              <div className="px-[16px] py-[10px] border-t border-[#e7e7e7] flex flex-col gap-[10px]">
                {/* Pagination Section */}
                <div className="flex items-center justify-center gap-[4px]">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-[6px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f5f5f5] transition-colors rounded-[6px]"
                  >
                    <Icon name="arrow-left" size={14} color="#272424" />
                  </button>

                  <div className="flex items-center gap-[4px]">
                    {getPageNumbers().map((page, index) => {
                      if (page === "...") {
                        return (
                          <span
                            key={`ellipsis-${index}`}
                            className="px-[6px] text-[12px] text-[#272424]"
                          >
                            ...
                          </span>
                        );
                      }
                      const pageNum = page as number;
                      const isActive = pageNum === currentPage;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-[24px] h-[24px] flex items-center justify-center text-[12px] font-semibold rounded-[4px] transition-colors ${
                            isActive
                              ? "bg-[#e04d30] text-white"
                              : "text-[#272424] hover:bg-[#f5f5f5]"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-[6px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f5f5f5] transition-colors rounded-[6px]"
                  >
                    <Icon
                      name="arrow-left"
                      size={14}
                      color="#272424"
                      className="rotate-180"
                    />
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-[8px] justify-end">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsProductModalOpen(false)}
                    className="text-[12px] px-[14px] py-[6px] border border-[#d1d5db] text-[#272424] bg-white hover:bg-[#f5f5f5]"
                  >
                    Hủy
                  </Button>
                  <Button
                    type="button"
                    variant="default"
                    onClick={() => {
                      const newProducts = products.filter((p) =>
                        selectedProducts.includes(p.id)
                      );
                      setConfirmedProducts((prev) => {
                        // Merge với danh sách hiện tại, tránh trùng lặp
                        const existingIds = new Set(prev.map((p) => p.id));
                        const uniqueNewProducts = newProducts.filter(
                          (p) => !existingIds.has(p.id)
                        );
                        return [...prev, ...uniqueNewProducts];
                      });
                      setSelectedProducts([]);
                      setIsProductModalOpen(false);
                      // Reset pagination về trang 1 sau khi thêm sản phẩm mới
                      setAppliedProductsPage(1);
                    }}
                    className="text-[12px] px-[14px] py-[6px] bg-[#e04d30] hover:bg-[#e04d30]/90 text-white"
                  >
                    Xác nhận
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="h-[calc(100vh-100px)]"></div>
    </div>
  );
};

export default AdminCreateVoucherProduct;
