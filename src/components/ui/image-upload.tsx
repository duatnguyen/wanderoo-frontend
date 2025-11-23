import React, { useRef, useState } from "react";
import { Icon } from "../icons";
import { toast } from "sonner";

interface ImageFile {
  id: string;
  url: string;
  file?: File;
}

interface ImageUploadProps {
  images: ImageFile[];
  maxImages?: number;
  maxSizeInMB?: number;
  onImagesChange: (images: ImageFile[]) => void;
  label?: string;
  note?: string;
  required?: boolean;
  readOnly?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  maxImages = 9,
  maxSizeInMB = 2,
  onImagesChange,
  label = "Hình ảnh sản phẩm",
  note = "Kéo thả hoặc thêm ảnh từ URL, tải ảnh lên từ thiết bị (Dung lượng ảnh tối đa 2MB)",
  required = false,
  readOnly = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [replacingImageId, setReplacingImageId] = useState<string | null>(null);

  const handleImageClick = () => {
    if (readOnly) return;
    setReplacingImageId(null); // Reset to add mode
    fileInputRef.current?.click();
  };

  const handleExistingImageClick = (imageId: string, event?: React.MouseEvent) => {
    if (readOnly) return;
    // Don't trigger if clicking on delete button
    if ((event?.target as HTMLElement)?.closest('button')) {
      return;
    }
    setReplacingImageId(imageId);
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    const files = event.target.files;
    if (!files || files.length === 0) {
      setReplacingImageId(null);
      return;
    }

    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    const imageIdToReplace = replacingImageId;

    // If replacing an existing image
    if (imageIdToReplace) {
      const file = files[0];
      if (!file) {
        event.target.value = "";
        setReplacingImageId(null);
        return;
      }

      if (file.size > maxSizeInBytes) {
        toast.error(`${file.name} vượt quá dung lượng ${maxSizeInMB}MB`);
        event.target.value = "";
        setReplacingImageId(null);
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} không phải là file hình ảnh`);
        event.target.value = "";
        setReplacingImageId(null);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string" && imageIdToReplace) {
          const updatedImages = images.map((img) =>
            img.id === imageIdToReplace
              ? {
                  id: img.id,
                  url: result,
                  file: file,
                }
              : img
          );
          onImagesChange(updatedImages);
          toast.success("Đã cập nhật hình ảnh");
        }
      };
      reader.onerror = () => {
        toast.error("Không thể đọc file hình ảnh");
        event.target.value = "";
        setReplacingImageId(null);
      };
      reader.readAsDataURL(file);
      event.target.value = "";
      setReplacingImageId(null);
      return;
    }

    // Adding new images
    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      toast.error(`Chỉ có thể thêm tối đa ${maxImages} hình ảnh`);
      event.target.value = "";
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);
    const newImages: ImageFile[] = [];
    let processedCount = 0;

    filesToProcess.forEach((file, index) => {
      if (file.size > maxSizeInBytes) {
        toast.error(`${file.name} vượt quá dung lượng ${maxSizeInMB}MB`);
        processedCount++;
        if (processedCount === filesToProcess.length && newImages.length > 0) {
          onImagesChange([...images, ...newImages]);
        }
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} không phải là file hình ảnh`);
        processedCount++;
        if (processedCount === filesToProcess.length && newImages.length > 0) {
          onImagesChange([...images, ...newImages]);
        }
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          newImages.push({
            id: `${Date.now()}-${index}`,
            url: result,
            file: file,
          });
        }
        processedCount++;
        if (processedCount === filesToProcess.length) {
          if (newImages.length > 0) {
            onImagesChange([...images, ...newImages]);
          }
        }
      };
      reader.onerror = () => {
        toast.error(`Không thể đọc file ${file.name}`);
        processedCount++;
        if (processedCount === filesToProcess.length && newImages.length > 0) {
          onImagesChange([...images, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });

      event.target.value = "";
  };

  const handleRemoveImage = (id: string, event: React.MouseEvent) => {
    if (readOnly) return;
    event.stopPropagation();
    event.preventDefault();
    onImagesChange(images.filter((img) => img.id !== id));
    toast.success("Đã xóa hình ảnh");
  };

  return (
    <div className="w-full">
      <div className="bg-white border border-[#e7e7e7] rounded-[24px] p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            {required && (
              <span className="text-[16px] font-bold text-[#ff0000] font-montserrat">
                *
              </span>
            )}
            <h2 className="text-[16px] font-bold text-[#272424] font-montserrat">
              {label}
            </h2>
          </div>
          <p className="text-[10px] font-medium text-[#272424] font-montserrat leading-[140%]">
            <span className="text-[#eb2b0b]">Note:</span>
            <span> {note}</span>
          </p>
        </div>

        <div className="flex gap-4 flex-wrap">
          {/* Display uploaded images */}
          {images.map((image) => (
            <div
              key={image.id}
              className="relative bg-white border-2 border-dashed border-[#e04d30] rounded-[8px] w-[78px] h-[78px] overflow-hidden cursor-pointer"
              onClick={(e) => handleExistingImageClick(image.id, e)}
            >
              <img
                src={image.url}
                alt="Product"
                className="w-full h-full object-cover"
              />
              {/* Delete button - small X in top right corner */}
              {!readOnly && (
                <button
                  type="button"
                  onClick={(e) => handleRemoveImage(image.id, e)}
                  className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-bl-[8px] w-5 h-5 flex items-center justify-center transition-colors z-10"
                  title="Xóa hình ảnh"
                >
                  <Icon name="close" size={12} color="white" />
                </button>
              )}
            </div>
          ))}

          {/* Add image button - only show if less than max images */}
          {images.length < maxImages && !readOnly && (
            <div
              onClick={handleImageClick}
              className="bg-white border-2 border-dashed border-[#e04d30] rounded-[8px] w-[78px] h-[78px] flex flex-col items-center justify-center gap-1 p-2 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="relative">
                <Icon name="image" size={24} color="#e04d30" />
                <div className="absolute -bottom-1 -right-1 bg-[#e04d30] rounded-full w-4 h-4 flex items-center justify-center">
                  <Icon name="plus" size={10} color="#FFFFFF" />
                </div>
              </div>
              <p className="text-[10px] font-medium text-[#e04d30] font-montserrat text-center leading-tight">
                Thêm hình ảnh
              </p>
              <p className="text-[10px] font-medium text-[#e04d30] font-montserrat text-center leading-tight">
                ({images.length}/{maxImages})
              </p>
            </div>
          )}

          {/* Hidden file input - used for both adding and replacing */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
            disabled={readOnly}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
