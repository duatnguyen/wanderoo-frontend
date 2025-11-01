import React, { useRef, useState, useEffect } from "react";
import { Pencil, FileText, User, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import FormInput from "@/components/ui/form-input";

export type CashBookTransactionDetails = {
  id: string;
  type: "income" | "expense";
  dateTime: string;
  paymentMethod: string;
  reason: string;
  customer?: string;
  amount: number;
  description?: string;
  reference?: string;
  images?: string[];
};

export type CashBookDetailsPanelProps = {
  transaction?: CashBookTransactionDetails;
  className?: string;
};

export const CashBookDetailsPanel: React.FC<CashBookDetailsPanelProps> = ({
  transaction,
  className,
}) => {
  const [description, setDescription] = useState(
    transaction?.description || ""
  );
  const [reference, setReference] = useState(transaction?.reference || "");
  const [images, setImages] = useState<string[]>(transaction?.images || []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update state when transaction changes
  useEffect(() => {
    if (transaction) {
      setDescription(transaction.description || "");
      setReference(transaction.reference || "");
      setImages(transaction.images || []);
    }
  }, [transaction]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "₫";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: string[] = [];
    const remainingSlots = 10 - images.length;
    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB

    for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
      const file = files[i];

      if (file.size > maxSizeInBytes) {
        alert(`${file.name} vượt quá dung lượng 2MB`);
        continue;
      }

      if (!file.type.startsWith("image/")) {
        alert(`${file.name} không phải là file hình ảnh`);
        continue;
      }

      if (!file.type.includes("png") && !file.type.includes("jpeg")) {
        alert(`${file.name} phải là PNG hoặc JPEG`);
        continue;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newImages.push(e.target.result as string);
          if (newImages.length === Math.min(files.length, remainingSlots)) {
            setImages([...images, ...newImages]);
          }
        }
      };
      reader.readAsDataURL(file);
    }

    if (event.target) {
      event.target.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  if (!transaction) {
    return (
      <div
        className={cn(
          "flex items-center justify-center h-full bg-white text-[#737373]",
          className
        )}
      >
        <p className="text-sm">Chọn giao dịch để xem chi tiết</p>
      </div>
    );
  }

  return (
    <div
      className={cn("flex flex-col h-full bg-white overflow-hidden", className)}
    >
      {/* Header */}
      <div className="p-6 border-b border-[#e7e7e7]">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-2xl font-bold text-[#272424]">
            #{transaction.id}
          </h2>
          <span
            className={cn(
              "px-3 py-1 rounded text-sm font-medium",
              transaction.type === "income"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            )}
          >
            {transaction.type === "income" ? "Phiếu thu" : "Phiếu chi"}
          </span>
        </div>

        <div className="flex flex-col gap-2 text-sm text-[#737373]">
          <div className="flex items-center gap-2">
            <Pencil className="w-4 h-4" />
            <span>Ngày nhận tiền: {formatDate(transaction.dateTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>Phương thức thanh toán: {transaction.paymentMethod}</span>
          </div>
          {transaction.reason && (
            <div>
              <span>Lý do: {transaction.reason}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* General Information */}
        <div className="border p-8 rounded-xl">
          <h3 className="text-lg font-bold text-[#272424] mb-4">
            Thông tin chung
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-dashed border-[#e7e7e7]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <User className="w-7 h-7 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-[#737373] leading-tight">
                    ------
                  </span>
                  <span className="text-sm text-[#737373]">Khách hàng</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-[#272424] block">
                  {formatCurrency(transaction.amount)}
                </span>
                <span className="text-xs text-[#737373]">
                  {transaction.paymentMethod}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#272424] mb-2">
                Diễn giải
              </label>
              <FormInput
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập diễn giải"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#272424] mb-2">
                Tham chiếu
              </label>
              <FormInput
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Nhập diễn giải"
              />
            </div>
          </div>
        </div>

        {/* Document Images */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="border p-4 rounded-xl">
            <h3 className="text-lg font-bold text-[#272424] mb-4">
              Ảnh chứng từ
            </h3>
            <div className="space-y-2 mb-4">
              <p className="text-xs text-[#272424]">
                • Dung lượng tối đa ảnh tải lên là 2 MB
              </p>
              <p className="text-xs text-[#272424]">• Hỗ trợ PNG hoặc JPEG</p>
              <p className="text-xs text-[#272424]">• Tối đa 10 ảnh</p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-[#e04d30] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#d0442a] transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span className="text-sm font-medium">+ Tải ảnh lên</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Right Column */}
          <div className="border p-4 rounded-xl">
            <h3 className="text-lg font-bold text-[#272424] mb-4">
              Ảnh chứng từ
            </h3>
            {images.length === 0 ? (
              <div className="border-2 border-dashed border-[#e7e7e7] rounded-lg p-8 text-center">
                <p className="text-sm text-[#737373]">Chưa có ảnh</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative group border border-[#e7e7e7] rounded-lg overflow-hidden"
                  >
                    <img
                      src={image}
                      alt={`Document ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashBookDetailsPanel;
