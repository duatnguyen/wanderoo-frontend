import React, { useRef } from "react";

const getGridColsClass = (cols: number): string => {
  const gridClasses: Record<number, string> = {
    2: "grid-cols-2 sm:grid-cols-3",
    3: "grid-cols-3 sm:grid-cols-4",
    4: "grid-cols-3 sm:grid-cols-4",
    5: "grid-cols-4 sm:grid-cols-5",
    6: "grid-cols-4 sm:grid-cols-6",
  };
  return gridClasses[cols] || "grid-cols-3 sm:grid-cols-4";
};

export interface MediaUploadProps {
  label?: string;
  accept?: "image" | "video" | "both";
  maxFiles?: number;
  files: File[];
  onChange: (files: File[]) => void;
  onRemove?: (index: number) => void;
  variant?: "dashed" | "solid";
  showPreview?: boolean;
  previewGridCols?: number;
  className?: string;
  disabled?: boolean;
  helperText?: string;
}

const MediaUpload: React.FC<MediaUploadProps> = ({
  label,
  accept = "image",
  maxFiles = 6,
  files,
  onChange,
  onRemove,
  variant = "dashed",
  showPreview = true,
  previewGridCols = 3,
  className = "",
  disabled = false,
  helperText,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMaxFilesReached = files.length >= maxFiles;

  const acceptTypes =
    accept === "image"
      ? "image/*"
      : accept === "video"
        ? "video/*"
        : "image/*,video/*";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const remainingSlots = maxFiles - files.length;
      const filesToAdd = newFiles.slice(0, remainingSlots);
      onChange([...files, ...filesToAdd]);
    }
    // Reset input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    if (onRemove) {
      onRemove(index);
    } else {
      const newFiles = files.filter((_, i) => i !== index);
      onChange(newFiles);
    }
  };

  const getFileType = (file: File): "image" | "video" => {
    return file.type.startsWith("image/") ? "image" : "video";
  };

  const buttonClasses =
    variant === "dashed"
      ? `inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
          isMaxFilesReached || disabled
            ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
            : "border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-700"
        }`
      : `px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors ${
          isMaxFilesReached || disabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer"
        }`;

  const buttonText =
    variant === "dashed"
      ? `Thêm ${accept === "image" ? "hình ảnh" : accept === "video" ? "video" : "hình ảnh/video"} ${files.length}/${maxFiles}`
      : `Thêm ${accept === "image" ? "hình ảnh" : accept === "video" ? "video" : "hình ảnh"}`;

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptTypes}
          multiple={maxFiles > 1}
          onChange={handleFileChange}
          disabled={isMaxFilesReached || disabled}
          className="hidden"
          id={`media-upload-${accept}`}
        />
        <label
          htmlFor={`media-upload-${accept}`}
          className={buttonClasses}
        >
          {variant === "dashed" && <span className="text-lg">+</span>}
          <span className="text-sm font-medium">{buttonText}</span>
        </label>
      </div>

      {showPreview && files.length > 0 && (
        <div
          className={`mt-3 ${
            accept === "video"
              ? "space-y-3"
              : `grid gap-3 ${getGridColsClass(previewGridCols)}`
          }`}
        >
          {files.map((file, index) => {
            const fileType = getFileType(file);
            return (
              <div key={index} className="relative group">
                {fileType === "image" ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-gray-200"
                  />
                ) : (
                  <div className="w-full max-w-md">
                    <video
                      src={URL.createObjectURL(file)}
                      controls
                      className="w-full rounded-lg border border-gray-200"
                    />
                  </div>
                )}
                <button
                  onClick={() => handleRemove(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  aria-label="Remove file"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}

      {helperText && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default MediaUpload;

