import React, { useEffect, useMemo, useState, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Radio } from "antd";
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
  maxUsagePerCustomer: string;

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
  maxUsagePerCustomer: "",
  displaySetting: "website",
});

// Format number with thousand separators for VND inputs
const formatNumber = (value: string) => {
  if (!value) return "";
  const num = value.replace(/\D/g, "");
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

interface AdminCreateVoucherShopWideProps {
  voucherTypeLabel?: string;
  variant?: "shop-wide" | "private";
}

const AdminCreateVoucherShopWide: React.FC<AdminCreateVoucherShopWideProps> = ({
  voucherTypeLabel = "Voucher toàn shop",
  variant = "shop-wide",
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
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
  const isPrivateVoucher = variant === "private";
  const resolvedVoucherTypeLabel = voucherTypeLabel ?? (isPrivateVoucher ? "Voucher nhập mã" : "Voucher toàn shop");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [discountValueError, setDiscountValueError] = useState<string>("");
  const [maxUsagePerCustomerError, setMaxUsagePerCustomerError] = useState<string>("");
  const [dateRangeError, setDateRangeError] = useState<string>("");
  const [formData, setFormData] = useState<VoucherFormData>(createDefaultFormData);
  const [minDateTime] = useState(() => formatDateTimeForInput(new Date().toISOString()));
  const topElementRef = useRef<HTMLDivElement>(null);
  const dateRangeSectionRef = useRef<HTMLDivElement>(null);

  const displaySettingToApplyOn: Record<VoucherFormData["displaySetting"], AdminDiscountCreateRequest["applyOn"]> = {
    pos: "POS",
    website: "WEBSITE",
    "pos-website": "BOTH",
  };

  const discountTypeToEnum: Record<VoucherFormData["discountType"], AdminDiscountCreateRequest["type"]> = {
    percentage: "PERCENT",
    fixed: "FIXED",
  };

  const handleApiError = (error: unknown) => {
    const message =
      (error as any)?.response?.data?.message || "Không thể xử lý yêu cầu. Vui lòng thử lại.";
    toast.error(message);
  };

  const applyOnToDisplaySetting: Record<AdminDiscountCreateRequest["applyOn"], VoucherFormData["displaySetting"]> = {
    POS: "pos",
    WEBSITE: "website",
    BOTH: "pos-website",
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
    maxUsage: detail.quantity != null ? detail.quantity.toString() : "",
    maxUsagePerCustomer: detail.discountUsage != null ? detail.discountUsage.toString() : "",
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
        maxUsagePerCustomer: editData.maxUsagePerCustomer ?? "",
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
    "maxUsagePerCustomer",
  ];

  const sanitizeNumericInput = (value: string) => value.replace(/[^0-9]/g, "");

  const validateDiscountValue = (value: string, discountType: "percentage" | "fixed") => {
    if (!value) {
      setDiscountValueError("");
      return;
    }
    const numValue = Number(value);
    if (Number.isNaN(numValue) || numValue <= 0) {
      if (discountType === "percentage") {
        setDiscountValueError("Mức giảm giá không hợp lệ. Vui lòng nhập giá trị từ 1 đến 99");
      } else {
        setDiscountValueError("");
      }
      return;
    }
    if (discountType === "percentage" && numValue > 99) {
      setDiscountValueError("Mức giảm giá không hợp lệ. Vui lòng nhập giá trị từ 1 đến 99");
      return;
    }
    setDiscountValueError("");
  };

  const validateMaxUsagePerCustomer = (maxUsagePerCustomer: string, maxUsage: string) => {
    if (!maxUsagePerCustomer || !maxUsage) {
      setMaxUsagePerCustomerError("");
      return;
    }
    const numMaxUsagePerCustomer = Number(maxUsagePerCustomer);
    const numMaxUsage = Number(maxUsage);
    if (Number.isNaN(numMaxUsagePerCustomer) || Number.isNaN(numMaxUsage)) {
      setMaxUsagePerCustomerError("");
      return;
    }
    if (numMaxUsagePerCustomer > numMaxUsage) {
      setMaxUsagePerCustomerError("Lượt sử dụng tối đa mỗi Người mua không được lớn hơn tổng lượt sử dụng tối đa của voucher");
      return;
    }
    setMaxUsagePerCustomerError("");
  };

  const handleInputChange = (field: keyof VoucherFormData, value: string) => {
    const processedValue = numericFields.includes(field) ? sanitizeNumericInput(value) : value;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [field]: processedValue,
      };
      if (field === "discountValue") {
        validateDiscountValue(processedValue, updated.discountType);
      } else if (field === "discountType") {
        validateDiscountValue(prev.discountValue, value as "percentage" | "fixed");
      } else if (field === "maxUsagePerCustomer") {
        validateMaxUsagePerCustomer(processedValue, updated.maxUsage);
      } else if (field === "maxUsage") {
        validateMaxUsagePerCustomer(updated.maxUsagePerCustomer, processedValue);
      } else if ((field === "startDate" || field === "endDate") && updated.startDate && updated.endDate) {
        setDateRangeError("");
      }
      return updated;
    });
  };

  const handleBackClick = () => {
    navigate("/admin/discounts");
  };

  const scrollToDateRange = () => {
    if (!dateRangeSectionRef.current) return;
    dateRangeSectionRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    const firstInput = dateRangeSectionRef.current.querySelector("input");
    if (firstInput instanceof HTMLInputElement) {
      firstInput.focus();
    }
  };

  const normalizeDateValue = (value: string) => {
    if (!value) return "";
    if (value.endsWith("Z") || value.length > 16) {
      return value;
    }
    return value.length === 16 ? `${value}:00` : value;
  };

  const validateForm = () => {
    setDateRangeError("");
    if (!formData.voucherName.trim()) {
      return "Vui lòng nhập tên chương trình giảm giá.";
    }
    if (!formData.voucherCode.trim()) {
      return "Vui lòng nhập mã voucher.";
    }
    const discountValue = Number(formData.discountValue);
    if (!formData.discountValue || Number.isNaN(discountValue) || discountValue <= 0) {
      if (formData.discountType === "percentage") {
        return "Mức giảm giá không hợp lệ. Vui lòng nhập giá trị từ 1 đến 99";
      }
      return "Mức giảm phải lớn hơn 0.";
    }
    if (formData.discountType === "percentage" && discountValue > 99) {
      return "Mức giảm giá không hợp lệ. Vui lòng nhập giá trị từ 1 đến 99";
    }
    if (!formData.startDate || !formData.endDate) {
      scrollToDateRange();
      setDateRangeError("Vui lòng chọn thời gian áp dụng");
      return "Vui lòng chọn thời gian áp dụng";
    }
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      scrollToDateRange();
      setDateRangeError("Thời gian bắt đầu phải trước thời gian kết thúc");
      return "Thời gian bắt đầu phải trước thời gian kết thúc";
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
    if (formData.maxUsagePerCustomer && formData.maxUsage) {
      const numMaxUsagePerCustomer = Number(formData.maxUsagePerCustomer);
      const numMaxUsage = Number(formData.maxUsage);
      if (!Number.isNaN(numMaxUsagePerCustomer) && !Number.isNaN(numMaxUsage) && numMaxUsagePerCustomer > numMaxUsage) {
        return "Lượt sử dụng tối đa mỗi Người mua không được lớn hơn tổng lượt sử dụng tối đa của voucher";
      }
    }
    return null;
  };

  const parseOptionalNumber = (value: string) => {
    if (!value) return undefined;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  };

  const buildPayload = (): AdminDiscountCreateRequest => {
    const quantity = formData.maxUsage ? Number(formData.maxUsage) : 1;
    const discountUsage = parseOptionalNumber(formData.maxUsagePerCustomer);
    const contextAllowed: AdminDiscountCreateRequest["contextAllowed"] = isPrivateVoucher ? "EVENT" : "OTHER";
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
      discountUsage: discountUsage,
      contextAllowed,
      startDate: normalizeDateValue(formData.startDate),
      endDate: normalizeDateValue(formData.endDate),
      quantity: quantity,
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
          <div className="bg-white border-2 border-[#e7e7e7] box-border flex flex-col gap-[16px] items-start p-[16px] sm:p-[24px] relative rounded-[8px] w-full overflow-hidden flex-shrink-0">
            {/* Title Section */}
            <div className="flex flex-col gap-[8px]">
              <h2 className="font-montserrat font-bold text-[18px] text-[#272424] leading-[normal]">
                Thông tin cơ bản
              </h2>
            </div>

            {/* Voucher Type Indicator */}
            <div className="w-full flex justify-center">
              <div className="bg-[#e04d30] border border-white rounded-[12px] h-[52px] px-[16px] flex items-center gap-[4px]">
                <CreditCardPercentIcon
                  size={24}
                  color="#FFFFFF"
                  className="flex-shrink-0"
                />
                <span className="font-semibold text-[20px] text-white leading-[1.4] whitespace-nowrap">
                  {resolvedVoucherTypeLabel}
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
                  <div className="flex-1 flex-shrink-0">
                  <FormInput
                    placeholder="Nhập tên chương trình giảm giá"
                    value={formData.voucherName}
                    onChange={(e) =>
                      handleInputChange("voucherName", e.target.value)
                    }
                    containerClassName="h-[36px] w-[873px]"
                    required
                    maxLength={100}
                    right={
                      <span className="text-[12px] text-[#888888] font-medium">
                        {formData.voucherName.length}/100
                      </span>
                    }
                  />
                  <p className="mt-[6px] font-medium text-[12px] text-[#737373] leading-[1.4] break-words">
                    Tên voucher sẽ không được hiển thị cho người mua
                  </p>
                </div>
              </div>

              {/* Voucher Code Field */}
              <div className="flex flex-row items-start gap-[16px]">
                <label className="font-semibold text-[14px] text-[#272424] leading-[1.4] w-[215px] flex-shrink-0 text-right">
                  Mã voucher
                </label>
                <div className="flex-1 flex-shrink-0">
                  <FormInput
                    placeholder="Nhập mã voucher"
                    value={formData.voucherCode}
                    onChange={(e) =>
                      handleInputChange("voucherCode", e.target.value)
                    }
                    containerClassName="h-[36px] w-[873px]"
                    required
                    maxLength={10}
                    right={
                      <span className="text-[12px] text-[#888888] font-medium">
                        {formData.voucherCode.length}/10
                      </span>
                    }
                  />
                </div>
              </div>

              {/* Date Range Field */}
              <div className="flex flex-row items-start gap-[16px]" ref={dateRangeSectionRef}>
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
              {dateRangeError && (
                <p className="ml-[231px] mt-[6px] font-medium text-[12px] text-red-600 leading-[1.4] break-words">
                  {dateRangeError}
                </p>
              )}
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
                <div className="flex-1 flex flex-row gap-[16px] items-start flex-shrink-0 w-[873px]">
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
                        formData.discountType === "percentage" ? "Nhập giá trị lớn hơn 1%" : "đ"
                      }
                      value={
                        formData.discountType === "percentage"
                          ? formData.discountValue
                          : formatNumber(formData.discountValue)
                      }
                      onChange={(e) =>
                        handleInputChange("discountValue", e.target.value)
                      }
                      containerClassName="h-[36px] w-full"
                      required
                    />
                    {discountValueError && (
                      <p className="mt-[6px] font-medium text-[12px] text-red-600 leading-[1.4] break-words">
                        {discountValueError}
                      </p>
                    )}
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
                      <Radio.Group
                        onChange={(e) =>
                          handleInputChange("maxDiscountLimit", e.target.value)
                        }
                        value={formData.maxDiscountLimit}
                        className="flex gap-[12px]"
                      >
                        <Radio value="limited" className="font-semibold text-[14px]">
                          Giới hạn
                        </Radio>
                        <Radio value="unlimited" className="font-semibold text-[14px]">
                          Không giới hạn
                        </Radio>
                      </Radio.Group>
                    </div>
                    {formData.maxDiscountLimit === "limited" && (
                      <div>
                        <FormInput
                          placeholder="đ"
                          value={formatNumber(formData.maxDiscountValue)}
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
                <div className="flex-1 flex-shrink-0">
                  <FormInput
                    placeholder="đ"
                    value={formatNumber(formData.minOrderAmount)}
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
                <div className="flex-1 flex flex-col min-w-0">
                  <FormInput
                    placeholder="Nhập số lượt sử dụng"
                    value={formData.maxUsage}
                    onChange={(e) =>
                      handleInputChange("maxUsage", e.target.value)
                    }
                    containerClassName="h-[36px] w-[873px]"
                  />
                  <p className="mt-[6px] font-medium text-[12px] text-[#737373] leading-[1.4] break-words">
                    Tổng số mã giảm giá tối đa có thể sử dụng
                  </p>
                </div>
              </div>

              {/* Maximum Usage Per Customer */}
              <div className="flex flex-row items-start gap-[16px]">
                <label className="font-semibold text-[14px] text-[#272424] leading-[1.4] w-[215px] flex-shrink-0 text-right">
                  Lượt sử dụng tối đa/người
                </label>
                <div className="flex-1 flex-shrink-0">
                  <FormInput
                    placeholder="Nhập số lượt sử dụng"
                    value={formData.maxUsagePerCustomer}
                    onChange={(e) =>
                      handleInputChange("maxUsagePerCustomer", e.target.value)
                    }
                    containerClassName="h-[36px] w-[873px]"
                  />
                  {maxUsagePerCustomerError && (
                    <p className="mt-[6px] font-medium text-[12px] text-red-600 leading-[1.4] break-words">
                      {maxUsagePerCustomerError}
                    </p>
                  )}
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
                <div className="flex-1 flex flex-col gap-[20px]">
                  <Radio.Group
                    onChange={(e) =>
                      handleInputChange("displaySetting", e.target.value)
                    }
                    value={formData.displaySetting}
                    className="flex flex-col gap-[20px]"
                  >
                    <Radio value="pos" className="font-semibold text-[14px]">
                      POS
                    </Radio>
                    <Radio value="website" className="font-semibold text-[14px]">
                      Website
                    </Radio>
                    <Radio value="pos-website" className="font-semibold text-[14px]">
                      POS + Website
                    </Radio>
                  </Radio.Group>
                </div>
              </div>

              {/* Applied Products */}
              <div className="flex flex-row items-center gap-[16px]">
                <label className="font-semibold text-[14px] text-[#272424] leading-[1.4] w-[215px] flex-shrink-0 text-right">
                  Sản phẩm được áp dụng
                </label>
                <div className="flex-1 flex items-center flex-shrink-0">
                  <span className="font-semibold text-[#272424] text-[14px] leading-[1.4] break-words">
                    Tất cả sản phẩm
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row gap-[16px] justify-end w-full">
            <Button
              type="button"
              variant="secondary"
              onClick={handleBackClick}
              disabled={isSubmitting}
              className="text-[14px] w-auto"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="default"
              className="text-[14px] w-auto"
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

export default AdminCreateVoucherShopWide;
