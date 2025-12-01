import React from "react";

interface ActionButtonsWebsiteProps {
    status: string;
    source: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: "actions" | "refundAccount";
    customActionLabels?: {
        reject: string;
        confirm: string;
    };
}

const ActionButtonsWebsite: React.FC<ActionButtonsWebsiteProps> = ({
    status,
    source,
    onConfirm,
    onCancel,
    variant = "actions",
    customActionLabels,
}) => {
    if (status !== "PENDING" || source !== "WEBSITE") {
        return null;
    }

    if (variant === "actions") {
        return (
            <div className="bg-white border-2 border-[#e7e7e7] rounded-[8px] p-[20px] w-full">
                <div className="flex flex-col gap-[12px] w-full">
                    {/* Header */}
                    <div className="flex items-center gap-[8px] mb-[8px]">
                        <div className="w-[4px] h-[20px] bg-[#e04d30] rounded-[2px]"></div>
                        <h3 className="font-montserrat font-semibold text-[16px] text-[#272424]">
                            Thao tác với đơn hàng
                        </h3>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-[12px] items-stretch sm:items-center justify-end w-full">
                        <button
                            onClick={onCancel}
                            className="flex items-center justify-center gap-[8px] px-[20px] py-[12px] bg-[#dc3545] hover:bg-[#c82333] active:bg-[#bd2130] text-white font-montserrat font-semibold text-[14px] rounded-[8px] transition-all duration-200 shadow-sm hover:shadow-md min-h-[44px]"
                        >
                            <svg
                                className="w-[18px] h-[18px]"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            {customActionLabels?.reject || "Từ chối trả hàng & hoàn tiền"}
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex items-center justify-center gap-[8px] px-[20px] py-[12px] bg-[#28a745] hover:bg-[#218838] active:bg-[#1e7e34] text-white font-montserrat font-semibold text-[14px] rounded-[8px] transition-all duration-200 shadow-sm hover:shadow-md min-h-[44px]"
                        >
                            <svg
                                className="w-[18px] h-[18px]"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            {customActionLabels?.confirm || "Cho phép trả hàng & hoàn tiền"}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // variant === "refundAccount"
    const handleCopy = () => {
        const info = [
            "Tên ngân hàng: Mb",
            "Số tài khoản: ...",
            "Chủ tài khoản:",
            "Email: (Nếu có)",
        ].join("\n");

        if (navigator && typeof navigator.clipboard !== "undefined") {
            navigator.clipboard.writeText(info).then(
                () => {
                    // eslint-disable-next-line no-alert
                    alert("Đã copy thông tin tài khoản hoàn tiền.");
                },
                () => {
                    // eslint-disable-next-line no-alert
                    alert("Không thể copy tự động, vui lòng copy thủ công.");
                }
            );
        } else {
            // eslint-disable-next-line no-alert
            alert("Không thể copy tự động, vui lòng copy thủ công.");
        }
    };

    return (
        <div className="bg-white border-2 border-[#e7e7e7] rounded-[8px] p-[20px] w-full">
            <div className="flex flex-col gap-[12px] w-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-[8px] gap-[8px]">
                    <div className="flex items-center gap-[8px]">
                        <div className="w-[4px] h-[20px] bg-[#e04d30] rounded-[2px]"></div>
                        <h3 className="font-montserrat font-semibold text-[16px] text-[#272424]">
                            Thông tin tài khoản hoàn tiền
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="px-[14px] py-[8px] border border-[#cfcfcf] rounded-[6px] bg-white hover:bg-gray-50 active:bg-gray-100 font-montserrat text-[13px] font-medium text-[#272424] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                    >
                        Copy thông tin tài khoản
                    </button>
                </div>

                {/* Refund account info box */}
                <div className="w-full border border-[#d7d7d7] rounded-[6px] px-[16px] py-[12px] bg-[#fafafa]">
                    <div className="flex flex-col gap-[6px] text-[13px] text-[#272424]">
                        <p className="font-montserrat">
                            <span className="font-semibold">Tên ngân hàng:</span> Mb
                        </p>
                        <p className="font-montserrat">
                            <span className="font-semibold">Số tài khoản:</span> ...
                        </p>
                        <p className="font-montserrat">
                            <span className="font-semibold">Chủ tài khoản:</span>
                        </p>
                        <p className="font-montserrat">
                            <span className="font-semibold">Email:</span> (Nếu có)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActionButtonsWebsite;