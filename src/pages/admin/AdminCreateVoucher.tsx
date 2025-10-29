import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

// Arrow Icon Component - using the correct arrow from design
const ArrowIcon = () => (
  <Icon name="arrow-left" size={24} color="#272424" className="rotate-180" />
);

// Date formatting utilities
const formatDateForInput = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
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
  minOrderAmount: string;
  maxUsage: string;
  maxUsagePerCustomer: string;

  // Display Settings
  displaySetting: "pos" | "website" | "pos-website";
}

const AdminCreateVoucher: React.FC = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [formData, setFormData] = useState<VoucherFormData>({
    voucherName: "",
    voucherCode: "",
    description: "",
    startDate: "",
    endDate: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "",
    maxUsage: "",
    maxUsagePerCustomer: "",
    displaySetting: "website",
  });

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
    console.log("Voucher form submitted:", formData);
    // Handle form submission logic here
  };

  return (
    <div className="flex flex-col gap-[10px] px-[20px] md:px-[50px] py-[20px] md:py-[32px] w-full">
      {/* Header with Back Button */}
      <div className="flex flex-col gap-[8px] min-h-[79px] items-start justify-center px-0 py-[10px] w-full">
        <div className="flex flex-col sm:flex-row gap-[15px] sm:gap-[30px] items-start sm:items-center px-0 py-[4px] w-full">
          <button
            onClick={handleBackClick}
            className="flex items-center gap-[8px] text-[#272424] cursor-pointer"
          >
            <Icon name="arrow-left" size={24} color="currentColor" />
          </button>
          <span className="font-semibold text-[16px]">Quay lại</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-[24px] w-full">
        {/* Basic Information Section */}
        <div className="bg-white border border-[#e7e7e7] rounded-[24px] p-[24px] flex flex-col gap-[16px] w-full">
          {/* Title Section */}
          <div className="flex flex-col gap-[8px]">
            <h2 className="font-bold text-[20px] text-[#272424] leading-[normal]">
              Thông tin cơ bản
            </h2>
          </div>

          {/* Voucher Type Indicator */}
          <div className="flex justify-center">
            <div className="bg-[#e04d30] border border-white rounded-[12px] h-[52px] px-[16px] flex items-center gap-[4px]">
              <CreditCardPercentIcon size={24} color="#FFFFFF" />
              <span className="font-semibold text-[24px] text-white leading-[1.4]">
                Voucher toàn shop
              </span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-[16px]">
            {/* Voucher Name Field */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-[8px] sm:gap-[16px]">
              <label className="font-semibold text-[14px] text-[#272424] leading-[1.4] w-[200px] sm:w-[215px] flex-shrink-0">
                Tên chương trình giảm giá
              </label>
              <div className="flex-1">
                <FormInput
                  placeholder="Nhập tên chương trình giảm giá"
                  value={formData.voucherName}
                  onChange={(e) =>
                    handleInputChange("voucherName", e.target.value)
                  }
                  required
                />
                <p className="mt-[6px] font-medium text-[10px] text-[#737373] leading-[1.4]">
                  Tên voucher sẽ không được hiển thị cho người mua
                </p>
              </div>
            </div>

            {/* Voucher Code Field */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-[8px] sm:gap-[16px]">
              <label className="font-semibold text-[14px] text-[#272424] leading-[1.4] w-[200px] sm:w-[215px] flex-shrink-0">
                Mã voucher
              </label>
              <div className="flex-1">
                <FormInput
                  placeholder="Nhập mã voucher"
                  value={formData.voucherCode}
                  onChange={(e) =>
                    handleInputChange("voucherCode", e.target.value)
                  }
                  required
                />
                <p className="mt-[6px] font-medium text-[10px] text-[#737373] leading-[1.4]">
                  Vui lòng nhập các kí tự chữ cái A - Z, số 0 - 9, tối đa 5 kí
                  tự
                </p>
              </div>
            </div>

            {/* Date Range Field */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-[8px] sm:gap-[16px]">
              <label className="font-semibold text-[14px] text-[#272424] leading-[1.4] w-[200px] sm:w-[215px] flex-shrink-0">
                Thời gian sử dụng mã
              </label>
              <div className="flex-1 w-full flex flex-col sm:flex-row gap-[16px]">
                {/* Start Date */}
                <div className="flex-1 w-full">
                  <FormInput
                    type="date"
                    value={formatDateForInput(formData.startDate)}
                    onChange={(e) =>
                      handleInputChange("startDate", e.target.value)
                    }
                    containerClassName="h-[52px] w-full"
                  />
                </div>

                {/* Arrow Separator - hidden on mobile */}
                <div className="hidden sm:flex items-center justify-center">
                  <ArrowIcon />
                </div>

                {/* End Date */}
                <div className="flex-1 w-full">
                  <FormInput
                    type="date"
                    value={formatDateForInput(formData.endDate)}
                    onChange={(e) =>
                      handleInputChange("endDate", e.target.value)
                    }
                    containerClassName="h-[52px] w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Voucher Settings Section */}
        <div className="bg-white border border-[#e7e7e7] rounded-[24px] p-[24px] flex flex-col gap-[16px] w-full">
          {/* Title Section */}
          <div className="flex flex-col gap-[8px]">
            <h2 className="font-bold text-[20px] text-[#272424] leading-[normal]">
              Thiết lập mã giảm giá
            </h2>
          </div>

          {/* Form Fields */}
          <div className="px-[60px] py-[12px] flex flex-col gap-[16px]">
            {/* Discount Type Indicator */}
            <div className="flex items-center gap-[8px] h-[20px]">
              <span className="font-semibold text-[14px] text-[#272424] leading-[1.4]">
                Loại mã
              </span>
              <span className="font-semibold text-[12px] text-[#e04d30] leading-[1.4]">
                Khuyến mãi
              </span>
            </div>

            {/* Discount Type and Value Row */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-[8px] sm:gap-[16px]">
              <label className="font-semibold text-[14px] text-[#272424] leading-[1.4] w-[200px] sm:w-[225px] flex-shrink-0">
                Loại giảm giá | Mức giảm
              </label>
              <div className="flex-1 flex flex-col sm:flex-row gap-[16px] items-center">
                {/* Discount Type Dropdown */}
                <div className="w-auto flex-shrink-0">
                  <DropdownMenu
                    open={isDropdownOpen}
                    onOpenChange={setIsDropdownOpen}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-auto justify-between h-[52px] border-[#e04d30] border-[1.6px] rounded-[12px] px-[16px] whitespace-nowrap hover:bg-[#e04d30]/5 "
                      >
                        <span className="font-medium text-[10px] text-[#272424]">
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
                <div className="flex-1 w-full">
                  <FormInput
                    placeholder={
                      formData.discountType === "percentage"
                        ? "Nhập phần trăm"
                        : "Nhập số tiền"
                    }
                    value={formData.discountValue}
                    onChange={(e) =>
                      handleInputChange("discountValue", e.target.value)
                    }
                    containerClassName="h-[52px] w-full"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Minimum Order Amount */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-[8px] sm:gap-[16px]">
              <label className="font-semibold text-[14px] text-[#272424] leading-[1.4] w-[200px] sm:w-[225px] flex-shrink-0">
                Giá trị đơn hàng tối thiểu
              </label>
              <div className="flex-1">
                <FormInput
                  placeholder="Nhập số tiền tối thiểu"
                  value={formData.minOrderAmount}
                  onChange={(e) =>
                    handleInputChange("minOrderAmount", e.target.value)
                  }
                  containerClassName="h-[52px] w-full"
                />
              </div>
            </div>

            {/* Maximum Usage */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-[8px] sm:gap-[16px]">
              <label className="font-semibold text-[14px] text-[#272424] leading-[1.4] w-[200px] sm:w-[225px] flex-shrink-0">
                Tổng lượt sử dụng tối đa
              </label>
              <div className="flex-1 flex flex-col">
                <FormInput
                  placeholder="Nhập số lượt sử dụng"
                  value={formData.maxUsage}
                  onChange={(e) =>
                    handleInputChange("maxUsage", e.target.value)
                  }
                  containerClassName="h-[52px] w-full"
                />
                <p className="mt-[6px] font-medium text-[10px] text-[#737373] leading-[1.4] text-left">
                  Tổng số mã giảm giá tối đa có thể sử dụng
                </p>
              </div>
            </div>

            {/* Maximum Usage Per Customer */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-[8px] sm:gap-[16px]">
              <label className="font-semibold text-[14px] text-[#272424] leading-[1.4] w-[200px] sm:w-[225px] flex-shrink-0">
                Lượt sử dụng tối đa/người
              </label>
              <div className="flex-1">
                <FormInput
                  placeholder="Nhập số lượt sử dụng"
                  value={formData.maxUsagePerCustomer}
                  onChange={(e) =>
                    handleInputChange("maxUsagePerCustomer", e.target.value)
                  }
                  containerClassName="h-[52px] w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Display Settings Section */}
        <div className="bg-white border border-[#e7e7e7] rounded-[24px] p-[24px] flex flex-col gap-[16px] w-full">
          {/* Title Section */}
          <div className="flex flex-col gap-[8px]">
            <h2 className="font-bold text-[16px] text-[#272424] leading-[normal]">
              Hiển thị mã giảm giá và sản phẩm áp dụng
            </h2>
          </div>

          {/* Form Fields */}
          <div className="px-[60px] py-[12px] flex flex-col gap-[16px]">
            {/* Display Setting */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-[8px] sm:gap-[16px]">
              <label className="font-semibold text-[14px] text-[#272424] leading-[1.4] w-[200px] sm:w-[225px] flex-shrink-0">
                Thiết lập hiển thị
              </label>
              <div className="flex-1 flex flex-col gap-[20px]">
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
            <div className="flex flex-col sm:flex-row sm:items-start gap-[8px] sm:gap-[16px]">
              <label className="font-semibold text-[14px] text-[#272424] leading-[1.4] w-[200px] sm:w-[225px] flex-shrink-0">
                Sản phẩm được áp dụng
              </label>
              <div className="flex-1">
                <span className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                  Tất cả sản phẩm
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-[16px] justify-end w-full">
          <Button type="button" variant="secondary" onClick={handleBackClick}>
            Hủy
          </Button>
          <Button type="submit" variant="default">
            Tạo voucher
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminCreateVoucher;
