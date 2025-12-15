import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight, X, Camera, Upload } from "lucide-react";
import {
  PersonIcon,
  DocumentIcon,
  TicketIcon,
  EditPencilIcon,
} from "./ProfileIcons";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../api/apiClient";

// Helper function to get full image URL (same as order/components)
const getImageUrl = (imageUrl: string | null | undefined): string | undefined => {
  if (!imageUrl || imageUrl.trim() === '') return undefined;
  
  // Clean up the image URL
  const cleanUrl = imageUrl.trim();
  
  // If already a full URL (http/https), return as is
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    return cleanUrl;
  }
  
  // Get base URL from environment or default to localhost
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  
  // If relative path starting with /, add base URL
  if (cleanUrl.startsWith('/')) {
    return `${baseUrl}${cleanUrl}`;
  }
  
  // Handle common image paths from backend
  if (cleanUrl.startsWith('uploads/') || cleanUrl.startsWith('static/')) {
    return `${baseUrl}/${cleanUrl}`;
  }
  
  // Default: assume it's from uploads directory
  return `${baseUrl}/uploads/${cleanUrl}`;
};

type MenuItem = {
  id: string;
  label: string;
  path: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
};

interface ProfileSidebarProps {
  onClose?: () => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get user data with fallback - same as Header
  const userData = {
    fullName: user?.name || user?.username || "Thanh",
    avatar: user?.avatar ? getImageUrl(user.avatar) : "https://randomuser.me/api/portraits/men/32.jpg",
  };

  const menuItems: MenuItem[] = [
    {
      id: "account",
      label: "Tài khoản của tôi",
      path: "/user/profile",
      icon: <PersonIcon />,
      children: [
        { id: "basicinformation", label: "Hồ sơ", path: "/user/profile/basicinformation" },
        { id: "address", label: "Địa chỉ", path: "/user/profile/address" },
        { id: "password", label: "Đổi mật khẩu", path: "/user/profile/password" },
      ],
    },
    {
      id: "orders",
      label: "Đơn mua",
      path: "/user/profile/orders",
      icon: <DocumentIcon />,
    },
    {
      id: "vouchers",
      label: "Kho voucher",
      path: "/user/profile/vouchers",
      icon: <TicketIcon />,
    },
  ];

  // Check if a menu item or its children is active
  const isMenuActive = (item: MenuItem): boolean => {
    // If item has children, only check if any child is active
    if (item.children && item.children.length > 0) {
      return item.children.some(child =>
        location.pathname === child.path || location.pathname.startsWith(child.path + "/")
      );
    }
    // For items without children, check exact path match
    return location.pathname === item.path || location.pathname.startsWith(item.path + "/");
  };

  // Check if a child menu item is active
  const isChildActive = (childPath: string): boolean => {
    return location.pathname === childPath || location.pathname.startsWith(childPath + "/");
  };

  const handleMenuItemClick = (item: MenuItem) => {
    // If item has children, toggle expansion instead of navigating
    if (item.children && item.children.length > 0) {
      // Toggle expansion for all items including "Tài khoản của tôi"
      setExpandedMenu(expandedMenu === item.id ? null : item.id);
    } else {
      // Navigate only if no children
      // Close "Tài khoản của tôi" when clicking on other items
      if (expandedMenu === "account") {
        setExpandedMenu(null);
      }
      navigate(item.path);
      if (onClose) {
        onClose();
      }
    }
  };

  const handleAvatarClick = () => {
    setIsAvatarModalOpen(true);
  };

  const validateFile = (file: File): string | null => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return 'Vui lòng chọn file ảnh hợp lệ (PNG, JPG, GIF).';
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return 'Kích thước file không được vượt quá 5MB.';
    }

    return null;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const error = validateFile(file);
      if (error) {
        setErrorMessage(error);
        return;
      }

      setErrorMessage(null);

      // Clean up previous URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }

      // Use FileReader for more reliable image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          setPreviewUrl(result);
          setSelectedFile(file);
        }
      };
      reader.onerror = () => {
        setErrorMessage('Không thể đọc file ảnh. Vui lòng thử lại.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];

      const error = validateFile(file);
      if (error) {
        setErrorMessage(error);
        return;
      }

      setErrorMessage(null);

      // Clean up previous URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }

      // Use FileReader for drag and drop as well
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          setPreviewUrl(result);
          setSelectedFile(file);
        }
      };
      reader.onerror = () => {
        setErrorMessage('Không thể đọc file ảnh. Vui lòng thử lại.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadAvatar = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await apiClient.post('/files/upload?folder=avatars', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        },
      });

      if (response.data.status === 200) {
        // Update user avatar in context
        updateUser({ ...user, avatar: response.data.data });

        // Show success briefly before closing
        setUploadProgress(100);
        setTimeout(() => {
          setIsAvatarModalOpen(false);
          setSelectedFile(null);

          // Clean up blob URL (only if it's a blob URL)
          if (previewUrl && previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
          }

          setPreviewUrl(null);
          setUploadProgress(0);
        }, 500);
      } else {
        setErrorMessage('Upload thất bại. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Upload avatar failed:', error);
      setErrorMessage('Upload avatar thất bại. Vui lòng thử lại.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelUpload = () => {
    setSelectedFile(null);

    // Clean up blob URL to prevent memory leaks (only if it's a blob URL)
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);
    setErrorMessage(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCloseModal = () => {
    setIsAvatarModalOpen(false);
    handleCancelUpload();
  };

  const handleToggleDropdown = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking chevron
    setExpandedMenu(expandedMenu === itemId ? null : itemId);
  };

  const handleChildClick = (path: string) => {
    navigate(path);
    if (onClose) {
      onClose();
    }
  };

  // Auto-expand menu if one of its children is active
  React.useEffect(() => {
    menuItems.forEach(item => {
      if (item.children) {
        // Check if any child is active
        const hasActiveChild = item.children.some(child =>
          location.pathname === child.path || location.pathname.startsWith(child.path + "/")
        );

        if (hasActiveChild) {
          // Expand this menu if a child is active
          setExpandedMenu(item.id);
        }
      }
    });

    // Close "Tài khoản của tôi" if none of its children are active
    const accountItem = menuItems.find(item => item.id === "account");
    if (accountItem && accountItem.children) {
      const hasActiveAccountChild = accountItem.children.some(child =>
        location.pathname === child.path || location.pathname.startsWith(child.path + "/")
      );
      if (!hasActiveAccountChild) {
        setExpandedMenu(prev => prev === "account" ? null : prev);
      }
    }
  }, [location.pathname]);

  return (
    <>
      {/* Sidebar Backdrop for Mobile */}
      {onClose && !isAvatarModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className="w-64 lg:w-64 h-full lg:h-auto flex-shrink-0 relative z-30">
        <div className="h-full lg:h-auto p-2 sm:p-3 lg:p-3 overflow-y-auto">
          {/* Close button for mobile */}

          {/* User Profile Section */}
          <div className="mb-4 sm:mb-6 pb-4 border-b border-gray-300 pl-3">
            <div className="flex items-start gap-3">
              <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                <img
                  src={userData.avatar}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={16} className="text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-base font-semibold text-gray-900 mb-1">
                  {userData.fullName}
                </div>
                <button
                  onClick={() => navigate("/user/profile/basicinformation")}
                  className="text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors text-sm"
                >
                  <EditPencilIcon />
                  <span>Sửa hồ sơ</span>
                </button>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = isMenuActive(item);
              const isExpanded = expandedMenu === item.id;
              const hasChildren = item.children && item.children.length > 0;

              return (
                <div key={item.id}>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMenuItemClick(item)}
                      className={`flex-1 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${isActive
                        ? "text-[#E04D30]"
                        : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      {item.icon && (
                        <span className="flex-shrink-0">{item.icon}</span>
                      )}
                      <span>{item.label}</span>
                    </button>
                    {hasChildren && item.id !== "account" && (
                      <button
                        onClick={(e) => handleToggleDropdown(item.id, e)}
                        className={`p-2 rounded-lg transition-colors ${isActive
                          ? "text-[#E04D30] hover:bg-gray-100"
                          : "text-gray-600 hover:bg-gray-100"
                          }`}
                        aria-label="Toggle submenu"
                      >
                        {isExpanded ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Dropdown Children */}
                  {hasChildren && isExpanded && (
                    <div className="ml-4 mt-1 space-y-1 pl-4">
                      {item.children!.map((child) => {
                        const childIsActive = isChildActive(child.path);
                        return (
                          <button
                            key={child.id}
                            onClick={() => handleChildClick(child.path)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${childIsActive
                              ? "text-[#E04D30]"
                              : "text-gray-600 hover:bg-gray-100"
                              }`}
                          >
                            <span>{child.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Avatar Upload Modal */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={handleCloseModal}
          />
          
          {/* Modal Content */}
          <div
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Cập nhật ảnh đại diện
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                  aria-label="Đóng"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-5 py-5">
              {/* Error Message */}
              {errorMessage && (
                <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs text-red-600">{errorMessage}</p>
                </div>
              )}

              {/* Upload Progress */}
              {isUploading && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-gray-700">
                      Đang tải lên...
                    </span>
                    <span className="text-xs text-gray-600">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Avatar Preview */}
              <div className="flex flex-col items-center mb-5">
                {previewUrl ? (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                    />
                  </div>
                ) : userData.avatar ? (
                  <div className="relative">
                    <img
                      src={userData.avatar}
                      alt="Current Avatar"
                      className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://randomuser.me/api/portraits/men/32.jpg";
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Drag and Drop Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400 bg-gray-50"
                } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !isUploading && fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isUploading}
                />
                <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                <p className="text-xs font-medium text-gray-700 mb-0.5">
                  Kéo thả ảnh vào đây hoặc click để chọn
                </p>
                <p className="text-[10px] text-gray-500">
                  PNG, JPG, GIF tối đa 5MB
                </p>
              </div>

              {/* File Info */}
              {selectedFile && !isUploading && (
                <div className="mt-3 p-2.5 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-700 truncate">
                    <span className="font-medium">File:</span> {selectedFile.name}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-gray-200 flex items-center justify-end gap-2">
              <button
                onClick={handleCloseModal}
                disabled={isUploading}
                className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleUploadAvatar}
                disabled={!selectedFile || isUploading}
                className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
              >
                {isUploading ? (
                  <>
                    <svg
                      className="animate-spin h-3.5 w-3.5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Đang tải...
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    Tải lên
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileSidebar;
