import React from "react";
import { Upload } from "antd";
import type { UploadFile, UploadProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";

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
  const isMaxFilesReached = files.length >= maxFiles;

  const acceptTypes =
    accept === "image"
      ? "image/*"
      : accept === "video"
        ? "video/*"
        : "image/*,video/*";

  // Convert File[] to UploadFile[]
  const fileList: UploadFile[] = files.map((file, index) => ({
    uid: `-${index}`,
    name: file.name,
    status: "done",
    url: URL.createObjectURL(file),
    originFileObj: file,
  }));

  const handleChange: UploadProps["onChange"] = (info) => {
    const newFiles: File[] = [];
    info.fileList.forEach((file) => {
      if (file.originFileObj) {
        newFiles.push(file.originFileObj);
      }
    });
    onChange(newFiles);
  };

  const handleRemove = (file: UploadFile) => {
    const index = fileList.findIndex((f) => f.uid === file.uid);
    if (index !== -1) {
      if (onRemove) {
        onRemove(index);
      } else {
        const newFiles = files.filter((_, i) => i !== index);
        onChange(newFiles);
      }
    }
  };

  const uploadButton = (
    <div className="flex flex-col items-center justify-center">
      {variant === "dashed" ? (
        <>
          <PlusOutlined />
          <div className="mt-2 text-sm text-gray-600">
            Thêm {accept === "image" ? "hình ảnh" : accept === "video" ? "video" : "hình ảnh/video"} {files.length}/{maxFiles}
          </div>
        </>
      ) : (
        <span className="text-sm font-medium">
          Thêm {accept === "image" ? "hình ảnh" : accept === "video" ? "video" : "hình ảnh"}
        </span>
      )}
    </div>
  );

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <Upload
        accept={acceptTypes}
        listType={showPreview ? (accept === "video" ? "text" : "picture-card") : "text"}
        fileList={fileList}
        onChange={handleChange}
        onRemove={handleRemove}
        multiple={maxFiles > 1}
        disabled={isMaxFilesReached || disabled}
        maxCount={maxFiles}
        beforeUpload={() => false} // Prevent auto upload
        className={variant === "dashed" ? "upload-dashed" : ""}
      >
        {!isMaxFilesReached && !disabled && uploadButton}
      </Upload>

      {helperText && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default MediaUpload;

