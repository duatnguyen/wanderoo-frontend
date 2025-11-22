import React, { useState, useEffect, useMemo } from "react";
import { Truck, Package, Clock, ChevronDown } from "lucide-react";
import { getPickShifts, getAvailableServices } from "../../../api/endpoints/shippingApi";
import type { PickShiftItem } from "../../../types/shipping";
import type { AvailableServiceResponse } from "../../../types/api";
import type { CustomerOrderResponse } from "../../../types/orders";
import { toast } from "sonner";

interface DeliveryConfirmationPopupWebsiteProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: {
        pickShift: number[];
        requiredNote: string;
        paymentTypeId: number;
        serviceTypeId: number;
    }) => void;
    orderData: CustomerOrderResponse;
}

const DeliveryConfirmationPopupWebsite: React.FC<DeliveryConfirmationPopupWebsiteProps> = ({
    isOpen,
    onClose,
    onConfirm,
    orderData,
}) => {
    const [selectedMethod, setSelectedMethod] = useState<"self" | "pickup" | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pickShifts, setPickShifts] = useState<PickShiftItem[]>([]);
    const [selectedShift, setSelectedShift] = useState<PickShiftItem | null>(null);
    const [isLoadingShifts, setIsLoadingShifts] = useState(false);
    const [showShiftDropdown, setShowShiftDropdown] = useState(false);
    const [showServiceDropdown, setShowServiceDropdown] = useState(false);
    const [requiredNote, setRequiredNote] = useState<string>("KHONGCHOXEMHANG");
    const [availableServices, setAvailableServices] = useState<AvailableServiceResponse[]>([]);
    const [selectedService, setSelectedService] = useState<AvailableServiceResponse | null>(null);
    const [isLoadingServices, setIsLoadingServices] = useState(false);
    const [servicesError, setServicesError] = useState<string | null>(null);
    const [paymentTypeId, setPaymentTypeId] = useState<number>(2); // 1: Người gửi, 2: Người nhận

    const DEFAULT_FROM_DISTRICT = Number(import.meta.env.VITE_GHN_FROM_DISTRICT_ID ?? 1447);

    const { fromDistrictId, fromDistrictName, fromWardCode, fromWardName } = useMemo(() => {
        const detail: any = orderData?.shippingDetail;
        const districtId =
            (orderData as any)?.shopDistrictId ??
            detail?.from_district_id ??
            detail?.fromDistrictId ??
            DEFAULT_FROM_DISTRICT;
        return {
            fromDistrictId: districtId,
            fromDistrictName:
                (orderData as any)?.shopDistrictName ?? detail?.from_district_name ?? detail?.fromDistrictName ?? "",
            fromWardCode:
                (orderData as any)?.shopWardCode ?? detail?.from_ward_code ?? detail?.fromWardCode ?? "",
            fromWardName:
                (orderData as any)?.shopWardName ?? detail?.from_ward_name ?? detail?.fromWardName ?? "",
        };
    }, [orderData, DEFAULT_FROM_DISTRICT]);

    const { toDistrictId, toDistrictName, toWardCode, toWardName } = useMemo(() => {
        const detail: any = orderData?.shippingDetail;
        const districtId =
            (orderData as any)?.receiverDistrictId ??
            (orderData as any)?.toDistrictId ??
            detail?.to_district_id ??
            detail?.toDistrictId ??
            null;
        return {
            toDistrictId: districtId,
            toDistrictName:
                (orderData as any)?.receiverDistrictName ??
                detail?.to_district_name ??
                detail?.toDistrictName ??
                "",
            toWardCode: (orderData as any)?.receiverWardCode ?? detail?.to_ward_code ?? detail?.toWardCode ?? "",
            toWardName: (orderData as any)?.receiverWardName ?? detail?.to_ward_name ?? detail?.toWardName ?? "",
        };
    }, [orderData]);

    // Helper function to convert timestamp to HH:mm format
    const formatTime = (timestamp: number): string => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    // Load pick shifts on component mount
    useEffect(() => {
        const loadPickShifts = async () => {
            setIsLoadingShifts(true);
            try {
                const response = await getPickShifts();
                // Extract data array from nested response structure
                const shifts = response.data || [];
                setPickShifts(shifts);
                // Auto select first shift if available
                if (shifts.length > 0) {
                    setSelectedShift(shifts[0]);
                }
            } catch (error) {
                console.error("Error loading pick shifts:", error);
            } finally {
                setIsLoadingShifts(false);
            }
        };

        loadPickShifts();
    }, []);

    useEffect(() => {
        const loadAvailableServices = async () => {
            if (!isOpen) {
                return;
            }
            if (selectedMethod !== "pickup") {
                setAvailableServices([]);
                setSelectedService(null);
                setServicesError(null);
                return;
            }
            if (!toDistrictId) {
                setServicesError("Thiếu thông tin quận/huyện giao hàng");
                setAvailableServices([]);
                setSelectedService(null);
                return;
            }
            setIsLoadingServices(true);
            setServicesError(null);
            try {
                const services = await getAvailableServices({
                    from_district: fromDistrictId,
                    to_district: toDistrictId,
                });
                setAvailableServices(services || []);
                setSelectedService(services && services.length > 0 ? services[0] : null);
            } catch (error) {
                console.error("Error loading available services:", error);
                setServicesError("Không thể tải danh sách dịch vụ vận chuyển");
                setAvailableServices([]);
                setSelectedService(null);
            } finally {
                setIsLoadingServices(false);
            }
        };

        loadAvailableServices();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, fromDistrictId, toDistrictId, selectedMethod]);

    const handleSubmit = async () => {
        if (!selectedMethod) {
            alert("Vui lòng chọn phương thức giao hàng!");
            return;
        }

        if (selectedMethod === "pickup" && !selectedShift) {
            alert("Vui lòng chọn ca lấy hàng!");
            return;
        }

        if (selectedMethod === "pickup" && !selectedService) {
            alert("Vui lòng chọn dịch vụ vận chuyển!");
            return;
        }

        setIsSubmitting(true);
        try {
            // Build confirm data based on selected method
            // Backend requires @NotEmpty for pickShift, so we always send at least one value
            // For "self" method, we send default pickShift [2] (backend will handle it)
            // For "pickup" method, we send the selected shift ID
            const confirmData = {
                pickShift: selectedMethod === "pickup" && selectedShift
                    ? [selectedShift.id]
                    : [2], // Default shift ID for self delivery (backend will use this or determine automatically)
                requiredNote: selectedMethod === "pickup"
                    ? requiredNote
                    : "KHONGCHOXEMHANG",
                paymentTypeId: selectedMethod === "pickup"
                    ? paymentTypeId
                    : 2, // Default: Buyer pays
                serviceTypeId: selectedMethod === "pickup" && selectedService
                    ? (selectedService.service_type_id ?? 2)
                    : 2, // Default service type
            };
            await onConfirm(confirmData);
            // Show success toast
            toast.success("Xác nhận giao hàng thành công!");
            // Reset form
            setSelectedMethod(null);
            setSelectedShift(pickShifts.length > 0 ? pickShifts[0] : null);
            setRequiredNote("KHONGCHOXEMHANG");
            setShowShiftDropdown(false);
            setShowServiceDropdown(false);
            setPaymentTypeId(2);
            onClose();
        } catch (error: any) {
            console.error("Error confirming delivery:", error);
            // Extract error message from response
            const errorMessage = error?.response?.data?.message
                || error?.message
                || "Có lỗi xảy ra khi xác nhận đơn hàng";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setSelectedMethod(null);
            setSelectedShift(pickShifts.length > 0 ? pickShifts[0] : null);
            setRequiredNote("KHONGCHOXEMHANG");
            setShowShiftDropdown(false);
            setShowServiceDropdown(false);
            setPaymentTypeId(2);
            onClose();
        }
    };

    // Handle ESC key press and prevent body scroll
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === "Escape" && isOpen && !isSubmitting) {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscKey);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscKey);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, isSubmitting]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
            onClick={handleClose}
        >
            <div
                className="bg-white rounded-[20px] shadow-2xl w-full max-w-[560px] max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-[#e04d30] to-[#d63924] px-6 py-4 relative">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <Truck className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="font-montserrat font-bold text-[20px] text-white leading-tight">
                                    Xác nhận giao hàng
                                </h2>
                                <p className="font-montserrat font-medium text-[12px] text-white/80">
                                    Chọn phương thức giao hàng cho đơn hàng
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
                        >
                            <svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-120px)]">
                    {/* Order ID Section */}
                    <div className="bg-gray-50 rounded-[12px] p-4 border border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <Package className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="font-montserrat font-medium text-[12px] text-gray-600 uppercase tracking-wide">
                                    Mã đơn hàng
                                </p>
                                <p className="font-montserrat font-bold text-[16px] text-gray-900 font-mono truncate">
                                    #{orderData.code}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Method Selection */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-5 bg-[#e04d30] rounded-full flex-shrink-0"></div>
                            <h3 className="font-montserrat font-semibold text-[16px] text-gray-900">
                                Chọn phương thức giao hàng
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Self Delivery Option */}
                            <button
                                onClick={() => setSelectedMethod("self")}
                                disabled={isSubmitting}
                                className={`group relative p-5 rounded-[16px] border-2 transition-all duration-200 text-left ${selectedMethod === "self"
                                    ? "border-[#1a71f6] bg-[#1a71f6]/5 shadow-lg shadow-blue-500/20"
                                    : "border-gray-200 bg-white hover:border-[#1a71f6]/50 hover:shadow-md"
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                <div className="flex flex-col space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${selectedMethod === "self"
                                                ? "bg-[#1a71f6] text-white"
                                                : "bg-gray-100 text-gray-600 group-hover:bg-[#1a71f6]/10 group-hover:text-[#1a71f6]"
                                                }`}
                                        >
                                            <svg
                                                className="w-6 h-6"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p
                                                className={`font-montserrat font-semibold text-[14px] leading-tight transition-colors ${selectedMethod === "self"
                                                    ? "text-[#1a71f6]"
                                                    : "text-gray-900"
                                                    }`}
                                            >
                                                Tự mang hàng
                                            </p>
                                            <p className="font-montserrat font-medium text-[12px] text-gray-500 mt-1">
                                                Tôi sẽ tự đem ra bưu cục
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {selectedMethod === "self" && (
                                    <div className="absolute top-3 right-3 w-5 h-5 bg-[#1a71f6] rounded-full flex items-center justify-center">
                                        <svg
                                            className="w-3 h-3 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={3}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </button>

                            {/* Courier Pickup Option */}
                            <button
                                onClick={() => setSelectedMethod("pickup")}
                                disabled={isSubmitting}
                                className={`group relative p-5 rounded-[16px] border-2 transition-all duration-200 text-left ${selectedMethod === "pickup"
                                    ? "border-[#e04d30] bg-[#e04d30]/5 shadow-lg shadow-red-500/20"
                                    : "border-gray-200 bg-white hover:border-[#e04d30]/50 hover:shadow-md"
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                <div className="flex flex-col space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${selectedMethod === "pickup"
                                                ? "bg-[#e04d30] text-white"
                                                : "bg-gray-100 text-gray-600 group-hover:bg-[#e04d30]/10 group-hover:text-[#e04d30]"
                                                }`}
                                        >
                                            <Truck className="w-6 h-6" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p
                                                className={`font-montserrat font-semibold text-[14px] leading-tight transition-colors ${selectedMethod === "pickup"
                                                    ? "text-[#e04d30]"
                                                    : "text-gray-900"
                                                    }`}
                                            >
                                                Shipper đến lấy
                                            </p>
                                            <p className="font-montserrat font-medium text-[12px] text-gray-500 mt-1">
                                                Đơn vị vận chuyển đến lấy hàng
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {selectedMethod === "pickup" && (
                                    <div className="absolute top-3 right-3 w-5 h-5 bg-[#e04d30] rounded-full flex items-center justify-center">
                                        <svg
                                            className="w-3 h-3 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={3}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Available Services - Only show when pickup method is selected */}
                    {selectedMethod === "pickup" && (
                        <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-5 bg-[#e04d30] rounded-full"></div>
                                    <h3 className="font-montserrat font-semibold text-[16px] text-gray-900">
                                        Chọn dịch vụ vận chuyển
                                    </h3>
                                </div>
                                {availableServices.length > 0 && (
                                    <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-montserrat font-semibold">
                                        {availableServices.length} dịch vụ
                                    </span>
                                )}
                            </div>

                            {/* Compact Address Info - Collapsible */}
                            {(fromDistrictId || toDistrictId) && (
                                <div className="bg-gray-50 rounded-[10px] p-3 border border-gray-200">
                                    <div className="grid grid-cols-2 gap-2 text-xs font-montserrat">
                                        <div>
                                            <span className="text-gray-500">Từ:</span>
                                            <span className="ml-1 font-semibold text-gray-700">
                                                {fromDistrictName || fromDistrictId || "N/A"}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Đến:</span>
                                            <span className="ml-1 font-semibold text-gray-700">
                                                {toDistrictName || toDistrictId || "N/A"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {servicesError && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-[10px]">
                                    <p className="text-sm text-red-600 font-montserrat font-medium">{servicesError}</p>
                                </div>
                            )}

                            {isLoadingServices ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="w-6 h-6 border-2 border-[#e04d30]/30 border-t-[#e04d30] rounded-full animate-spin"></div>
                                    <span className="ml-2 font-montserrat font-medium text-[14px] text-gray-600">
                                        Đang tải dịch vụ vận chuyển...
                                    </span>
                                </div>
                            ) : availableServices.length === 0 && !servicesError ? (
                                <div className="p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-[14px] text-center">
                                    <Truck className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="font-montserrat font-medium text-[14px] text-gray-600">
                                        Không có dịch vụ vận chuyển khả dụng
                                    </p>
                                    <p className="font-montserrat text-[12px] text-gray-500 mt-1">
                                        Vui lòng kiểm tra lại thông tin địa chỉ
                                    </p>
                                </div>
                            ) : (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowServiceDropdown(!showServiceDropdown)}
                                        disabled={isSubmitting || availableServices.length === 0}
                                        className={`w-full p-4 bg-white border-2 rounded-[14px] flex items-center justify-between transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group ${selectedService
                                            ? "border-[#1a71f6] bg-[#1a71f6]/5"
                                            : "border-gray-200 hover:border-[#e04d30]/50"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${selectedService
                                                ? "bg-[#1a71f6] text-white"
                                                : "bg-blue-100 text-blue-600 group-hover:bg-blue-200"
                                                }`}>
                                                <Truck className="w-5 h-5" />
                                            </div>
                                            <div className="text-left flex-1 min-w-0">
                                                {selectedService ? (
                                                    <>
                                                        <p className="font-montserrat font-semibold text-[14px] text-gray-900 truncate">
                                                            {selectedService.short_name || selectedService.service_name || `Dịch vụ #${selectedService.service_id}`}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[11px] font-montserrat font-semibold">
                                                                Loại {selectedService.service_type_id}
                                                            </span>
                                                            {selectedService.expected_delivery_time && (
                                                                <span className="text-[11px] font-montserrat font-medium text-gray-500">
                                                                    ⏱️ {selectedService.expected_delivery_time}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {selectedService.description && (
                                                            <p className="text-[11px] font-montserrat text-gray-500 mt-1 line-clamp-1">
                                                                {selectedService.description}
                                                            </p>
                                                        )}
                                                    </>
                                                ) : (
                                                    <p className="font-montserrat font-semibold text-[14px] text-gray-900">
                                                        Chọn dịch vụ vận chuyển
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-2 ${showServiceDropdown ? "rotate-180" : ""}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {showServiceDropdown && availableServices.length > 0 && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-[14px] shadow-xl z-10 max-h-72 overflow-y-auto">
                                            {availableServices.map((service, index) => (
                                                <button
                                                    key={service.service_id}
                                                    onClick={() => {
                                                        setSelectedService(service);
                                                        setShowServiceDropdown(false);
                                                    }}
                                                    className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors ${index === 0 ? "rounded-t-[12px]" : ""
                                                        } ${index === availableServices.length - 1 ? "rounded-b-[12px]" : ""
                                                        } ${selectedService?.service_id === service.service_id
                                                            ? "bg-blue-50 border-l-4 border-l-[#1a71f6]"
                                                            : ""
                                                        }`}
                                                >
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${selectedService?.service_id === service.service_id
                                                        ? "bg-[#1a71f6] text-white"
                                                        : "bg-gray-100 text-gray-600"
                                                        }`}>
                                                        <Truck className="w-5 h-5" />
                                                    </div>
                                                    <div className="text-left flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className={`font-montserrat font-semibold text-[13px] flex-1 ${selectedService?.service_id === service.service_id
                                                                ? "text-[#1a71f6]"
                                                                : "text-gray-900"
                                                                }`}>
                                                                {service.short_name || service.service_name || `Dịch vụ #${service.service_id}`}
                                                            </p>
                                                            {selectedService?.service_id === service.service_id && (
                                                                <div className="w-5 h-5 bg-[#1a71f6] rounded-full flex items-center justify-center flex-shrink-0">
                                                                    <svg
                                                                        className="w-3 h-3 text-white"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={3}
                                                                            d="M5 13l4 4L19 7"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className={`px-2 py-0.5 rounded text-[11px] font-montserrat font-semibold ${selectedService?.service_id === service.service_id
                                                                ? "bg-[#1a71f6]/20 text-[#1a71f6]"
                                                                : "bg-gray-200 text-gray-700"
                                                                }`}>
                                                                Loại {service.service_type_id}
                                                            </span>
                                                            {service.expected_delivery_time && (
                                                                <span className="text-[11px] font-montserrat font-medium text-gray-500 flex items-center gap-1">
                                                                    <Clock className="w-3 h-3" />
                                                                    {service.expected_delivery_time}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {service.description && (
                                                            <p className="text-[11px] font-montserrat text-gray-500 mt-1.5 line-clamp-2">
                                                                {service.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Payment Type Selection - Only show when pickup method is selected */}
                    {selectedMethod === "pickup" && (
                        <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-5 bg-[#e04d30] rounded-full"></div>
                                <h3 className="font-montserrat font-semibold text-[16px] text-gray-900">
                                    Người thanh toán phí ship (Choose who pays shipping fee)
                                </h3>
                            </div>
                            <div className="space-y-3">
                                <label className="flex items-start gap-3 p-4 bg-white border-2 border-gray-200 rounded-[12px]">
                                    <input
                                        type="radio"
                                        name="paymentTypeId"
                                        value="1"
                                        checked={paymentTypeId === 1}
                                        onChange={() => setPaymentTypeId(1)}
                                        disabled={isSubmitting}
                                        className="w-4 h-4 text-[#1a71f6] border-gray-300 focus:ring-[#1a71f6] focus:ring-2 mt-0.5"
                                    />
                                    <div className="flex-1">
                                        <p className="font-montserrat font-semibold text-[14px] text-gray-900">
                                            1. Shop/Seller
                                        </p>
                                        <p className="font-montserrat text-[12px] text-gray-500">
                                            Shop thanh toán phí vận chuyển (Sender pays shipping fee)
                                        </p>
                                    </div>
                                </label>
                                <label className="flex items-start gap-3 p-4 bg-white border-2 border-gray-200 rounded-[12px]">
                                    <input
                                        type="radio"
                                        name="paymentTypeId"
                                        value="2"
                                        checked={paymentTypeId === 2}
                                        onChange={() => setPaymentTypeId(2)}
                                        disabled={isSubmitting}
                                        className="w-4 h-4 text-[#e04d30] border-gray-300 focus:ring-[#e04d30] focus:ring-2 mt-0.5"
                                    />
                                    <div className="flex-1">
                                        <p className="font-montserrat font-semibold text-[14px] text-gray-900">
                                            2. Buyer/Consignee
                                        </p>
                                        <p className="font-montserrat text-[12px] text-gray-500">
                                            Khách hàng thanh toán phí vận chuyển (Receiver pays shipping fee)
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Pick Shift Selection - Only show when pickup method is selected */}
                    {selectedMethod === "pickup" && (
                        <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-5 bg-[#e04d30] rounded-full"></div>
                                <h3 className="font-montserrat font-semibold text-[16px] text-gray-900">
                                    Chọn ca lấy hàng
                                </h3>
                            </div>

                            {isLoadingShifts ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="w-6 h-6 border-2 border-[#e04d30]/30 border-t-[#e04d30] rounded-full animate-spin"></div>
                                    <span className="ml-2 font-montserrat font-medium text-[14px] text-gray-600">
                                        Đang tải ca lấy hàng...
                                    </span>
                                </div>
                            ) : (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowShiftDropdown(!showShiftDropdown)}
                                        disabled={isSubmitting || pickShifts.length === 0}
                                        className="w-full p-4 bg-white border-2 border-gray-200 hover:border-[#e04d30]/50 rounded-[14px] flex items-center justify-between transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                                                <Clock className="w-5 h-5 text-orange-600" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-montserrat font-semibold text-[14px] text-gray-900">
                                                    {selectedShift ? selectedShift.title : "Chọn ca lấy hàng"}
                                                </p>
                                                {selectedShift && (
                                                    <p className="font-montserrat font-medium text-[12px] text-gray-500">
                                                        {formatTime(selectedShift.from_time)} - {formatTime(selectedShift.to_time)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${showShiftDropdown ? "rotate-180" : ""}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {showShiftDropdown && pickShifts.length > 0 && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-[14px] shadow-lg z-10 max-h-60 overflow-y-auto">
                                            {pickShifts.map((shift) => (
                                                <button
                                                    key={shift.id}
                                                    onClick={() => {
                                                        setSelectedShift(shift);
                                                        setShowShiftDropdown(false);
                                                    }}
                                                    className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors first:rounded-t-[12px] last:rounded-b-[12px] ${selectedShift?.id === shift.id
                                                        ? "bg-orange-50 border-l-4 border-l-orange-500"
                                                        : ""
                                                        }`}
                                                >
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedShift?.id === shift.id
                                                        ? "bg-orange-100"
                                                        : "bg-gray-100"
                                                        }`}>
                                                        <Clock className={`w-4 h-4 ${selectedShift?.id === shift.id
                                                            ? "text-orange-600"
                                                            : "text-gray-600"
                                                            }`} />
                                                    </div>
                                                    <div className="text-left">
                                                        <p className={`font-montserrat font-semibold text-[13px] ${selectedShift?.id === shift.id
                                                            ? "text-orange-900"
                                                            : "text-gray-900"
                                                            }`}>
                                                            {shift.title}
                                                        </p>
                                                        <p className="font-montserrat font-medium text-[11px] text-gray-500">
                                                            {formatTime(shift.from_time)} - {formatTime(shift.to_time)}
                                                        </p>
                                                    </div>
                                                    {selectedShift?.id === shift.id && (
                                                        <div className="ml-auto w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                                                            <svg
                                                                className="w-2.5 h-2.5 text-white"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={3}
                                                                    d="M5 13l4 4L19 7"
                                                                />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Required Note Selection - Only show when pickup method is selected */}
                    {selectedMethod === "pickup" && (
                        <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-5 bg-[#e04d30] rounded-full"></div>
                                <h3 className="font-montserrat font-semibold text-[16px] text-gray-900">
                                    Hướng dẫn giao hàng
                                </h3>
                            </div>

                            <div className="space-y-3">
                                {[
                                    {
                                        value: "CHOTHUHANG",
                                        label: "CHOTHUHANG",
                                        description: "Buyer can request to see and trial goods (Cho thử hàng)",
                                    },
                                    {
                                        value: "CHOXEMHANGKHONGTHU",
                                        label: "CHOXEMHANGKHONGTHU",
                                        description: "Buyer can see goods but not trial (Cho xem hàng không thử)",
                                    },
                                    {
                                        value: "KHONGCHOXEMHANG",
                                        label: "KHONGCHOXEMHANG",
                                        description: "Buyer not allow to see goods (Không cho xem hàng)",
                                    },
                                ].map((option) => (
                                    <label
                                        key={option.value}
                                        className="flex items-start gap-3 p-4 bg-white border-2 border-gray-200 hover:border-[#e04d30]/50 rounded-[12px] cursor-pointer transition-all duration-200 group"
                                    >
                                        <input
                                            type="radio"
                                            name="requiredNote"
                                            value={option.value}
                                            checked={requiredNote === option.value}
                                            onChange={(e) => setRequiredNote(e.target.value)}
                                            disabled={isSubmitting}
                                            className="w-4 h-4 text-[#e04d30] border-gray-300 focus:ring-[#e04d30] focus:ring-2 mt-0.5"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-montserrat font-semibold text-[14px] text-gray-900 group-hover:text-[#e04d30] transition-colors">
                                                {option.label}
                                            </p>
                                            <p className="font-montserrat font-medium text-[12px] text-gray-500 mt-1">
                                                {option.description}
                                            </p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Selection Info */}
                    {selectedMethod && (
                        <div
                            className={`p-4 rounded-[12px] border animate-in slide-in-from-top-2 duration-300 ${selectedMethod === "self"
                                ? "bg-blue-50 border-blue-200"
                                : "bg-red-50 border-red-200"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedMethod === "self" ? "bg-blue-100" : "bg-red-100"
                                        }`}
                                >
                                    <svg
                                        className={`w-4 h-4 ${selectedMethod === "self"
                                            ? "text-blue-600"
                                            : "text-red-600"
                                            }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <div>
                                        <p
                                            className={`font-montserrat font-medium text-[13px] ${selectedMethod === "self"
                                                ? "text-blue-800"
                                                : "text-red-800"
                                                }`}
                                        >
                                            {selectedMethod === "self"
                                                ? "Bạn sẽ tự mang hàng đến bưu cục gần nhất"
                                                : "Shipper sẽ đến địa chỉ của shop để lấy hàng"}
                                        </p>
                                        {selectedMethod === "pickup" && selectedShift && (
                                            <p className="font-montserrat font-medium text-[12px] text-red-600 mt-1">
                                                Ca lấy hàng: {selectedShift.title} ({formatTime(selectedShift.from_time)} - {formatTime(selectedShift.to_time)})
                                            </p>
                                        )}
                                        {selectedMethod === "pickup" && (
                                            <p className="font-montserrat font-medium text-[12px] text-red-600 mt-1">
                                                Hướng dẫn: {
                                                    requiredNote === "CHOTHUHANG" ? "Cho thử hàng" :
                                                        requiredNote === "CHOXEMHANGKHONGTHU" ? "Cho xem hàng không thử" :
                                                            "Không cho xem hàng"
                                                }
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                        <button
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="flex-1 sm:flex-none px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-montserrat font-semibold text-[14px] rounded-[12px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Hủy bỏ
                        </button>

                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !selectedMethod}
                            className="flex-1 sm:flex-none px-8 py-3 bg-[#e04d30] hover:bg-[#d63924] active:bg-[#c73621] text-white font-montserrat font-semibold text-[14px] rounded-[12px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2 min-w-[140px]"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Đang xử lý...</span>
                                </>
                            ) : (
                                <>
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    <span>Xác nhận giao hàng</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryConfirmationPopupWebsite;