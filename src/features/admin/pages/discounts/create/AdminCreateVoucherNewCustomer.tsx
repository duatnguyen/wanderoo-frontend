import React, { useEffect, useMemo, useState, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
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
import type { VoucherEditData } from "@/types/voucher";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createDiscount, getDiscountDetail, updateDiscount } from "@/api/endpoints/discountApi";
import type { AdminDiscountCreateRequest, AdminDiscountResponse } from "@/types/discount";

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

  // Display Settings
  displaySetting: "pos" | "website" | "pos-website";
}

interface EditLocationState {
  mode?: "edit";
  voucher?: {
    id?: string | number;
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
  displaySetting: "website",
});

const AdminCreateVoucherNewCustomer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const discountIdQuery = searchParams.get("id");
  const discountIdFromQuery = discountIdQuery ? Number(discountIdQuery) : undefined;
  const { mode, voucher } = (location.state as EditLocationState | undefined) || {};
  const editData = voucher?.editData;
  const stateDiscountId = voucher?.id ? Number(voucher.id) : undefined;
  const fetchDiscountId = useMemo(() => {
    if (discountIdFromQuery && !Number.isNaN(discountIdFromQuery)) {
      return discountIdFromQuery;
    }
    if (stateDiscountId && !Number.isNaN(stateDiscountId)) {
      return stateDiscountId;
    }
    return undefined;
  }, [discountIdFromQuery, stateDiscountId]);
  const isEditMode = Boolean(fetchDiscountId);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [formData, setFormData] = useState<VoucherFormData>(createDefaultFormData);
  const [minDateTime] = useState(() => formatDateTimeForInput(new Date().toISOString()));
  const topElementRef = useRef<HTMLDivElement>(null);

  const displaySettingToApplyOn: Record<VoucherFormData["displaySetting"], AdminDiscountCreateRequest["applyOn"]> = {
    pos: "POS",
    website: "WEBSITE",
    "pos-website": "BOTH",
  };

  const discountTypeToEnum: Record<VoucherFormData["discountType"], AdminDiscountCreateRequest["type"]> = {
    percentage: "PERCENT",
    fixed: "FIXED",
  };

  const applyOnToDisplaySetting: Record<AdminDiscountCreateRequest["applyOn"], VoucherFormData["displaySetting"]> = {
    POS: "pos",
    WEBSITE: "website",
    BOTH: "pos-website",
  };

  const handleApiError = (error: unknown) => {
    const message =
      (error as any)?.response?.data?.message || "Không thể xử lý yêu cầu. Vui lòng thử lại.";
    toast.error(message);
  };

  const mapDetailToFormData = (detail: AdminDiscountResponse): VoucherFormData => ({
    voucherName: detail.name ?? "",
    voucherCode: detail.code ?? "",
    description: detail.description ?? "",
    startDate: detail.startDate ? new Date(detail.startDate).toISOString() : "",
    endDate: detail.endDate ? new Date(detail.endDate).toISOString() : "",
    discountType: detail.type === "PERCENT" ? "percentage" : "fixed",
    discountValue: detail.value != null ? detail.value.toString() : "",
    maxDiscountLimit: detail.maxOrderValue != null ? "limited" : "unlimited",
    maxDiscountValue: detail.maxOrderValue != null ? detail.maxOrderValue.toString() : "",
    minOrderAmount: detail.minOrderValue != null ? detail.minOrderValue.toString() : "",
    maxUsage:
      detail.discountUsage != null
        ? detail.discountUsage.toString()
        : detail.quantity != null
        ? detail.quantity.toString()
        : "",
    displaySetting: applyOnToDisplaySetting[detail.applyOn] ?? "website",
  });

  const {
    data: discountDetail,
    error: discountDetailError,
  } = useQuery<AdminDiscountResponse, Error>({
    queryKey: ["admin-discount-detail", fetchDiscountId ?? "new"] as const,
    queryFn: () => getDiscountDetail(fetchDiscountId!),
    enabled: Boolean(fetchDiscountId),
    staleTime: 30000,
  });

  // Scroll to top when component mounts or route changes
  useEffect(() => {
    const scrollToTop = () => {
      // Method 1: Scroll window
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      
      // Method 2: Scroll document elements
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Method 3: Scroll using ref element
      if (topElementRef.current) {
        topElementRef.current.scrollIntoView({ behavior: 'auto', block: 'start', inline: 'nearest' });
      }
      
      // Method 4: Scroll main container if it exists
      const mainContainer = document.querySelector('.w-full.overflow-x-auto.min-h-screen');
      if (mainContainer) {
        (mainContainer as HTMLElement).scrollTop = 0;
        (mainContainer as HTMLElement).scrollLeft = 0;
      }
      
      // Method 5: Scroll to header element
      const header = document.querySelector('h1.font-montserrat');
      if (header) {
        (header as HTMLElement).scrollIntoView({ behavior: 'auto', block: 'start', inline: 'nearest' });
      }
      
      // Method 6: Try to find and scroll any scrollable parent
      const scrollableParents = document.querySelectorAll('[style*="overflow"], [class*="overflow"]');
      scrollableParents.forEach((parent) => {
        const element = parent as HTMLElement;
        if (element.scrollTop > 0) {
          element.scrollTop = 0;
        }
      });
    };
    
    // Immediate scroll
    scrollToTop();
    // Try multiple times with delays to ensure it works
    const timeoutId1 = setTimeout(scrollToTop, 0);
    const timeoutId2 = setTimeout(scrollToTop, 10);
    const timeoutId3 = setTimeout(scrollToTop, 50);
    const timeoutId4 = setTimeout(scrollToTop, 100);
    const timeoutId5 = setTimeout(scrollToTop, 200);
    
    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      clearTimeout(timeoutId3);
      clearTimeout(timeoutId4);
      clearTimeout(timeoutId5);
    };
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (discountDetail) {
      setFormData(mapDetailToFormData(discountDetail));
    }
  }, [discountDetail]);

  useEffect(() => {
    if (discountDetailError) {
      handleApiError(discountDetailError);
    }
  }, [discountDetailError]);

  const createDiscountMutation = useMutation({
    mutationFn: (payload: AdminDiscountCreateRequest) => createDiscount(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-discounts"] });
      toast.success("Tạo mã giảm giá thành công");
      navigate("/admin/discounts");
    },
    onError: handleApiError,
  });

  const updateDiscountMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AdminDiscountCreateRequest }) =>
      updateDiscount(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-discounts"] });
      toast.success("Cập nhật mã giảm giá thành công");
      navigate("/admin/discounts");
    },
    onError: handleApiError,
  });

  const isSubmitting = createDiscountMutation.isPending || updateDiscountMutation.isPending;

  useEffect(() => {
    if (fetchDiscountId) {
      return;
    }
    if (mode === "edit" && editData) {
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
        displaySetting: editData.displaySetting ?? "website",
      });
    } else {
      setFormData(createDefaultFormData());
    }
  }, [fetchDiscountId, mode, editData]);

  const pageTitle = isEditMode ? "Chỉnh sửa mã giảm giá" : "Tạo mã giảm giá mới";

  const numericFields: Array<keyof VoucherFormData> = [
    "discountValue",
    "maxDiscountValue",
    "minOrderAmount",
    "maxUsage",
  ];

  const sanitizeNumericInput = (value: string) => value.replace(/[^0-9]/g, "");

  const handleInputChange = (field: keyof VoucherFormData, value: string) => {
    const processedValue = numericFields.includes(field) ? sanitizeNumericInput(value) : value;
    setFormData((prev) => ({
      ...prev,
      [field]: processedValue,
    }));
  };

  const handleBackClick = () => {
    navigate("/admin/discounts");
  };

  const normalizeDateValue = (value: string) => {
    if (!value) return "";
    if (value.endsWith("Z") || value.length > 16) {
      return value;
    }
    return value.length === 16 ? `${value}:00` : value;
  };

  const validateForm = () => {
    if (!formData.voucherName.trim()) {
      return "Vui lòng nhập tên chương trình giảm giá.";
    }
    if (!formData.voucherCode.trim()) {
      return "Vui lòng nhập mã voucher.";
    }
    const discountValue = Number(formData.discountValue);
    if (!formData.discountValue || Number.isNaN(discountValue) || discountValue <= 0) {
      return "Mức giảm phải lớn hơn 0.";
    }
    if (!formData.startDate || !formData.endDate) {
      return "Vui lòng chọn thời gian áp dụng.";
    }
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      return "Thời gian bắt đầu phải trước thời gian kết thúc.";
    }
    if (formData.maxDiscountLimit === "limited") {
      const maxDiscount = Number(formData.maxDiscountValue);
      if (!formData.maxDiscountValue || Number.isNaN(maxDiscount) || maxDiscount <= 0) {
        return "Vui lòng nhập mức giảm tối đa hợp lệ.";
      }
    }
    if (formData.minOrderAmount && Number.isNaN(Number(formData.minOrderAmount))) {
      return "Giá trị đơn hàng tối thiểu không hợp lệ.";
    }
    if (formData.maxUsage && (Number.isNaN(Number(formData.maxUsage)) || Number(formData.maxUsage) <= 0)) {
      return "Tổng lượt sử dụng tối đa phải lớn hơn 0.";
    }
    return null;
  };

  const parseOptionalNumber = (value: string) => {
    if (!value) return undefined;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  };

  const buildPayload = (): AdminDiscountCreateRequest => {
    const usageLimit = formData.maxUsage ? Number(formData.maxUsage) : 1;
    return {
      name: formData.voucherName.trim(),
      code: formData.voucherCode.trim().toUpperCase(),
      category: "ORDER_DISCOUNT",
      type: discountTypeToEnum[formData.discountType],
      applyTo: "ORDER",
      applyOn: displaySettingToApplyOn[formData.displaySetting],
      value: Number(formData.discountValue),
      minOrderValue: parseOptionalNumber(formData.minOrderAmount),
      maxOrderValue:
        formData.maxDiscountLimit === "limited"
          ? parseOptionalNumber(formData.maxDiscountValue)
          : undefined,
      discountUsage: formData.maxUsage ? usageLimit : undefined,
      contextAllowed: "SIGNUP",
      startDate: normalizeDateValue(formData.startDate),
      endDate: normalizeDateValue(formData.endDate),
      quantity: usageLimit,
      status: "ENABLE",
      description: formData.description?.trim() || undefined,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const payload = buildPayload();

    if (isEditMode) {
      if (!fetchDiscountId) {
        toast.error("Không xác định được mã giảm giá cần chỉnh sửa.");
        return;
      }
      await updateDiscountMutation.mutateAsync({ id: fetchDiscountId, payload });
      return;
    }

    await createDiscountMutation.mutateAsync(payload);
  };

  return (
    <div className="w-full overflow-x-auto min-h-screen" ref={topElementRef}>
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
                  Voucher khách hàng mới
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
                    min={minDateTime}
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
                    min={
                      formatDateTimeForInput(formData.startDate) || minDateTime
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
                <div className="flex-1 flex flex-col gap-[4px]">
                  <span className="font-semibold text-[14px] text-[#272424] leading-[1.4]">
                    Người mua mới
                  </span>
                  <span className="font-medium text-[12px] text-[#737373] leading-[1.4]">
                    Khách hàng chưa từng mua sắm tại Shop.
                  </span>
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
                <div className="flex-1 flex flex-col">
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
              disabled={isSubmitting}
              className="text-[14px]"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="default"
              className="text-[14px]"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Đang xử lý..."
                : isEditMode
                ? "Lưu thay đổi"
                : "Xác nhận"}
            </Button>
          </div>
        </form>
      </div>
      <div className="h-[calc(100vh-100px)]"></div>
    </div>
  );
};

export default AdminCreateVoucherNewCustomer;
