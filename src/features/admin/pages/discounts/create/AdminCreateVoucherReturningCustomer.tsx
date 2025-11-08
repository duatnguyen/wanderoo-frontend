import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

// Format number with thousand separators
const formatNumber = (value: string) => {
  if (!value) return "";
  const num = value.replace(/\D/g, "");
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

interface VoucherFormData {
  // Basic Information
  voucherName: string;
  voucherCode: string;
  description: string;
  startDate: string;
  endDate: string;

  // Target Buyer Settings
  totalSpendingAmount: string;
  spendingDays: string;

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

const AdminCreateVoucherReturningCustomer: React.FC = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [formData, setFormData] = useState<VoucherFormData>({
    voucherName: "",
    voucherCode: "",
    description: "",
    startDate: "",
    endDate: "",
    totalSpendingAmount: "",
    spendingDays: "",
    discountType: "percentage",
    discountValue: "",
    maxDiscountLimit: "unlimited",
    maxDiscountValue: "",
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
    <div className="w-full overflow-x-auto min-h-screen">
      <div className="flex flex-col gap-[10px] items-start w-full max-w-[930px] mx-auto px-[24px] min-w-[925px]">
        {/* Header with Back Button */}
        <div className="flex flex-col gap-[8px] items-start justify-center w-full min-w-[925px]">
          <div className="flex gap-[4px] items-center">
            <button
              onClick={handleBackClick}
              className="relative shrink-0 size-[24px] flex items-center justify-center cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-[#737373]" />
            </button>
            <h1 className="font-montserrat font-bold text-[#272424] text-[24px] leading-[1.5] whitespace-nowrap">
              Tạo mã giảm giá mới
            </h1>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-[16px] w-full min-w-[925px] flex-shrink-0"
        >
          {/* Basic Information Section */}
          <div className="bg-white border-2 border-[#e7e7e7] box-border flex flex-col gap-[16px] items-start p-[24px] relative rounded-[8px] w-full overflow-hidden flex-shrink-0 min-w-[925px]">
            {/* Title Section */}
            <div className="flex flex-col gap-[8px]">
              <h2 className="font-montserrat font-bold text-[18px] text-[#272424] leading-[normal]">
                Thông tin cơ bản
              </h2>
            </div>

            {/* Voucher Type Indicator */}
            <div className="flex justify-center w-full">
              <div className="bg-[#e04d30] border border-white rounded-[12px] h-[52px] px-[16px] flex items-center gap-[4px]">
                <CreditCardPercentIcon size={24} color="#FFFFFF" />
                <span className="font-semibold text-[20px] text-white leading-[1.4]">
                  Voucher khách hàng mua lại
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
                    containerClassName="h-[36px] w-full"
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
                    containerClassName="h-[36px] w-full"
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

              {/* Target Buyers Field */}
              <div className="flex flex-row items-start gap-[16px]">
                <label className="font-semibold text-[14px] text-[#272424] leading-[1.4] w-[215px] flex-shrink-0 text-right">
                  Người mua mục tiêu
                </label>
                <div className="flex-1 flex flex-col gap-[8px]">
                  <span className="font-semibold text-[14px] text-[#272424] leading-[1.4]">
                    Người mua có tổng chi tiêu tại shop
                  </span>
                  <div className="flex flex-wrap items-center gap-[4px] text-[14px] text-[#272424]">
                    <span className="font-medium">
                      Khách hàng chưa từng mua sắm tại shop ≥
                    </span>
                    <div className="rounded-[8px] px-[8px] py-[4px]">
                      <FormInput
                        type="text"
                        value={formatNumber(formData.totalSpendingAmount)}
                        onChange={(e) => {
                          const numValue = e.target.value.replace(/\D/g, "");
                          handleInputChange("totalSpendingAmount", numValue);
                        }}
                        containerClassName="h-[28px] w-[120px] !p-0 justify-center"
                        className="!text-center text-center w-full"
                        style={{ textAlign: "center" }}
                      />
                    </div>
                    <span className="font-medium">trong</span>
                    <div className="rounded-[8px] px-[8px] py-[4px]">
                      <FormInput
                        type="number"
                        value={formData.spendingDays}
                        onChange={(e) =>
                          handleInputChange("spendingDays", e.target.value)
                        }
                        containerClassName="h-[28px] w-[60px] !p-0 justify-center"
                        className="!text-center text-center w-full"
                        style={{ textAlign: "center" }}
                      />
                    </div>
                    <span className="font-medium">ngày gần nhất</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Voucher Settings Section */}
          <div className="bg-white border-2 border-[#e7e7e7] box-border flex flex-col gap-[16px] items-start p-[24px] relative rounded-[8px] w-full overflow-hidden flex-shrink-0 min-w-[925px]">
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
                <div className="flex-1 flex flex-row gap-[16px] items-center flex-shrink-0">
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
                  <div className="flex-1 w-full">
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
                          containerClassName="h-[36px] w-full"
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
                    containerClassName="h-[36px] w-full"
                  />
                </div>
              </div>

              {/* Maximum Usage */}
              <div className="flex flex-row items-start gap-[16px]">
                <label className="font-semibold text-[14px] text-[#272424] leading-[1.4] w-[215px] flex-shrink-0 text-right">
                  Tổng lượt sử dụng tối đa
                </label>
                <div className="flex-1 flex flex-col">
                  <FormInput
                    placeholder="Nhập số lượt sử dụng"
                    value={formData.maxUsage}
                    onChange={(e) =>
                      handleInputChange("maxUsage", e.target.value)
                    }
                    containerClassName="h-[36px] w-full"
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
                    containerClassName="h-[36px] w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Display Settings Section */}
          <div className="bg-white border-2 border-[#e7e7e7] box-border flex flex-col gap-[16px] items-start p-[24px] relative rounded-[8px] w-full overflow-hidden flex-shrink-0 min-w-[925px]">
            {/* Title Section */}
            <div className="flex flex-col gap-[8px]">
              <h2 className="font-montserrat font-bold text-[16px] text-[#272424] leading-[normal]">
                Hiển thị mã giảm giá và sản phẩm áp dụng
              </h2>
            </div>

            {/* Form Fields */}
            <div className="px-0 py-[12px] flex flex-col gap-[16px]">
              {/* Display Setting */}
              <div className="flex flex-row items-center gap-[16px]">
                <label className="font-semibold text-[14px] text-[#272424] leading-[1.4] w-[215px] flex-shrink-0 text-right">
                  Thiết lập hiển thị
                </label>
                <div className="flex-1 flex items-center flex-shrink-0">
                  <span className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                    {formData.displaySetting === "pos"
                      ? "POS"
                      : formData.displaySetting === "website"
                        ? "Website"
                        : "POS + Website"}
                  </span>
                </div>
              </div>

              {/* Applied Products */}
              <div className="flex flex-row items-center gap-[16px]">
                <label className="font-semibold text-[14px] text-[#272424] leading-[1.4] w-[215px] flex-shrink-0 text-right">
                  Sản phẩm được áp dụng
                </label>
                <div className="flex-1 flex items-center flex-shrink-0">
                  <span className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                    Tất cả sản phẩm
                  </span>
                </div>
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
              Xác nhận
            </Button>
          </div>
        </form>
      </div>
      <div className="h-[calc(100vh-100px)]"></div>
    </div>
  );
};

export default AdminCreateVoucherReturningCustomer;
