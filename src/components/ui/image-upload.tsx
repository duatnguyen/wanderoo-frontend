import React, { useRef } from "react";
import { Icon } from "../icons";

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    const files = event.target.files;
    if (!files) return;

    const newImages: ImageFile[] = [];
    const remainingSlots = maxImages - images.length;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
      const file = files[i];

      // Check file size
      if (file.size > maxSizeInBytes) {
        alert(`${file.name} vượt quá dung lượng ${maxSizeInMB}MB`);
        continue;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} không phải là file hình ảnh`);
        continue;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newImages.push({
            id: `${Date.now()}-${i}`,
            url: e.target.result as string,
            file: file,
          });

          if (newImages.length === Math.min(files.length, remainingSlots)) {
            onImagesChange([...images, ...newImages]);
          }
        }
      };
      reader.readAsDataURL(file);
    }

    // Reset input
    if (event.target) {
      event.target.value = "";
    }
  };

  const handleRemoveImage = (id: string) => {
    if (readOnly) return;
    onImagesChange(images.filter((img) => img.id !== id));
  };

  const handleImageClick = () => {
    if (readOnly) return;
    fileInputRef.current?.click();
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
              className="relative bg-white border-2 border-dashed border-[#e04d30] rounded-[8px] w-[78px] h-[78px] overflow-hidden group"
            >
              <img
                src={image.url}
                alt="Product"
                className="w-full h-full object-cover"
              />
              {/* Remove button */}
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => handleRemoveImage(image.id)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Icon name="close" size={16} color="white" />
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

          {/* Hidden file input */}
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
