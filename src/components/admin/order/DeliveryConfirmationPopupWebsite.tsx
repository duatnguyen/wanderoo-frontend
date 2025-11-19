import React, { useState, useEffect } from "react";
import { Truck, Package, Clock, ChevronDown } from "lucide-react";
import { getPickShifts } from "../../../api/endpoints/shippingApi";
import type { PickShiftItem } from "../../../types/shipping";

interface DeliveryConfirmationPopupWebsiteProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: { pickShift: number[]; requiredNote: string }) => void;
    orderData: any;
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
    const [requiredNote, setRequiredNote] = useState<string>("KHONGCHOXEMHANG");

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

    const handleSubmit = async () => {
        if (!selectedMethod) {
            alert("Vui lòng chọn phương thức giao hàng!");
            return;
        }

        if (selectedMethod === "pickup" && !selectedShift) {
            alert("Vui lòng chọn ca lấy hàng!");
            return;
        }

        setIsSubmitting(true);
        try {
            const confirmData = {
                pickShift: selectedMethod === "pickup" && selectedShift ? [selectedShift.id] : [],
                requiredNote: requiredNote
            };
            await onConfirm(confirmData);
            // Reset form
            setSelectedMethod(null);
            setSelectedShift(pickShifts.length > 0 ? pickShifts[0] : null);
            setRequiredNote("KHONGCHOXEMHANG");
            setShowShiftDropdown(false);
            onClose();
        } catch (error) {
            console.error("Error confirming delivery:", error);
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
                                    { value: "CHOTHUHANG", label: "Cho thử hàng", description: "Cho phép khách hàng thử hàng trước khi nhận" },
                                    { value: "CHOXEMHANGKHONGTHU", label: "Cho xem hàng không thử", description: "Cho xem hàng nhưng không cho thử" },
                                    { value: "KHONGCHOXEMHANG", label: "Không cho xem hàng", description: "Không cho xem hay thử hàng" }
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