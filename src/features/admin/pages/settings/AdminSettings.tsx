// src/pages/admin/AdminSettings.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import ShopLogo from "@/assets/icons/ShopLogo.png";
import { 
  getAdminProfile, 
  updateAdminProfile, 
  updateAdminPassword,
  uploadAdminAvatar,
} from "@/api/endpoints/userApi";
import { BASE_URL } from "@/api/apiClient";
import type { 
  AdminProfileDetailResponse, 
  AdminProfileUpdateRequest,
  AdminPasswordUpdateRequest 
} from "@/types/auth";

const toAbsoluteImageUrl = (url?: string | null) => {
  if (!url) return null;
  return url.startsWith("http") ? url : `${BASE_URL}${url}`;
};

const AdminSettings: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const queryClient = useQueryClient();
  
  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Shop settings states
  const [isEditingShop, setIsEditingShop] = useState(false);
  const [shopName, setShopName] = useState("Wanderoo");

  // Profile form states
  const [profileData, setProfileData] = useState<AdminProfileDetailResponse | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    gender: "FEMALE" as "MALE" | "FEMALE" | "OTHER",
    image_url: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Password form states
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // Inline editing states
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [editingBirthday, setEditingBirthday] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [phoneValue, setPhoneValue] = useState("");
  const [birthdayValue, setBirthdayValue] = useState("");

  // Fetch admin profile
  const { data: adminProfile, isLoading: isLoadingProfile } = useQuery<AdminProfileDetailResponse>({
    queryKey: ["adminProfile"],
    queryFn: getAdminProfile,
  });

  // Update profile mutation
  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: (data: AdminProfileUpdateRequest) => updateAdminProfile(data),
    onSuccess: () => {
      toast.success("Cập nhật hồ sơ thành công");
      queryClient.invalidateQueries({ queryKey: ["adminProfile"] });
      setImagePreview(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Cập nhật hồ sơ thất bại");
    },
  });

  // Update password mutation
  const { mutateAsync: updatePassword, isPending: isUpdatingPassword } = useMutation({
    mutationFn: (data: AdminPasswordUpdateRequest) => updateAdminPassword(data),
    onSuccess: () => {
      toast.success("Đổi mật khẩu thành công");
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Đổi mật khẩu thất bại");
    },
  });

  // Load profile data into form
  useEffect(() => {
    if (adminProfile) {
      setProfileData(adminProfile);
      setFormData({
        name: adminProfile.name || "",
        gender: adminProfile.gender || "FEMALE",
        image_url: adminProfile.image_url || "",
      });
      setImagePreview(toAbsoluteImageUrl(adminProfile.image_url));
    }
  }, [adminProfile]);

  // Redirect to profile if on base settings route
  useEffect(() => {
    if (path === "/admin/settings") {
      navigate("/admin/settings/profile", { replace: true });
    }
  }, [path, navigate]);

  // Handle image selection
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Kích thước file không được vượt quá 2MB");
        return;
      }
      // Validate file type
      if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
        toast.error("Chỉ chấp nhận file JPG, JPEG, PNG");
        return;
      }
      try {
        const url = await uploadAdminAvatar(file);
        setFormData((prev) => ({
          ...prev,
          image_url: url,
        }));
        const absoluteUrl = url.startsWith("http")
          ? url
          : `${BASE_URL}${url}`;
        setImagePreview(absoluteUrl);
        toast.success("Upload ảnh thành công");
      } catch (error: any) {
        console.error("Upload avatar failed:", error);
        const errorMessage = error?.response?.data?.message || error?.message || "Upload ảnh thất bại";
        toast.error(errorMessage);
      }
    }
  };

  // Handle profile save
  const handleSaveProfile = async () => {
    if (!profileData) return;

    try {
      const imageUrl = formData.image_url || profileData.image_url || "";
      if (!imageUrl) {
        toast.error("Vui lòng chọn ảnh đại diện");
        return;
      }

      const updateData: AdminProfileUpdateRequest = {
        id: profileData.id,
        name: formData.name,
        phone: profileData.phone, // Keep existing phone
        image_url: imageUrl,
        gender: formData.gender,
        birthday: profileData.birthday || undefined,
        email: profileData.email, // Keep existing email
      };

      await updateProfile(updateData);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Cập nhật hồ sơ thất bại";
      toast.error(errorMessage);
    }
  };

  // Handle email update
  const handleUpdateEmail = async () => {
    if (!profileData) return;
    if (!emailValue || !emailValue.includes("@")) {
      toast.error("Email không hợp lệ");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      toast.error("Email không đúng định dạng");
      return;
    }

    try {
      // Backend requires image_url for admin - must not be null or empty
      if (!profileData.image_url) {
        toast.error("Vui lòng upload ảnh đại diện trước khi cập nhật thông tin");
        return;
      }

      const updateData: AdminProfileUpdateRequest = {
        id: profileData.id,
        name: profileData.name || "", // Backend requires @NotBlank
        phone: profileData.phone || "", // Backend requires @NotBlank
        email: emailValue,
        image_url: profileData.image_url, // Required for admin
        gender: profileData.gender || undefined,
        birthday: profileData.birthday || undefined,
      };

      await updateProfile(updateData);
      setEditingEmail(false);
      setEmailValue("");
    } catch (error: any) {
      console.error("Error updating email:", error);
      const errorMessage = error?.response?.data?.message || error?.response?.data?.error || error?.message || "Cập nhật email thất bại";
      toast.error(errorMessage);
    }
  };

  const handleCancelEmail = () => {
    if (profileData) {
      setEmailValue(profileData.email);
    }
    setEditingEmail(false);
  };

  // Handle phone update
  const handleUpdatePhone = async () => {
    if (!profileData) return;
    // Clean phone number - remove all non-digit characters
    const cleanPhone = phoneValue.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 10 || cleanPhone.length > 13) {
      toast.error("Số điện thoại phải có từ 10 đến 13 chữ số");
      return;
    }

    try {
      // Backend requires image_url for admin - must not be null or empty
      if (!profileData.image_url) {
        toast.error("Vui lòng upload ảnh đại diện trước khi cập nhật thông tin");
        return;
      }

      const updateData: AdminProfileUpdateRequest = {
        id: profileData.id,
        name: profileData.name || "", // Backend requires @NotBlank
        phone: cleanPhone,
        email: profileData.email || "", // Backend may require email
        image_url: profileData.image_url, // Required for admin
        gender: profileData.gender || undefined,
        birthday: profileData.birthday || undefined,
      };

      await updateProfile(updateData);
      setEditingPhone(false);
      setPhoneValue("");
    } catch (error: any) {
      console.error("Error updating phone:", error);
      const errorMessage = error?.response?.data?.message || error?.response?.data?.error || error?.message || "Cập nhật số điện thoại thất bại";
      toast.error(errorMessage);
    }
  };

  const handleCancelPhone = () => {
    if (profileData) {
      setPhoneValue(profileData.phone);
    }
    setEditingPhone(false);
  };

  // Handle birthday update
  const handleUpdateBirthday = async () => {
    if (!profileData) return;

    try {
      // Backend requires image_url for admin - must not be null or empty
      if (!profileData.image_url) {
        toast.error("Vui lòng upload ảnh đại diện trước khi cập nhật thông tin");
        return;
      }

      // Convert date string to ISO format if provided
      let birthdayISO: string | undefined = undefined;
      if (birthdayValue) {
        const date = new Date(birthdayValue);
        if (isNaN(date.getTime())) {
          toast.error("Ngày sinh không hợp lệ");
          return;
        }
        birthdayISO = date.toISOString();
      }

      const updateData: AdminProfileUpdateRequest = {
        id: profileData.id,
        name: profileData.name || "", // Backend requires @NotBlank
        phone: profileData.phone || "", // Backend requires @NotBlank
        email: profileData.email || "", // Backend may require email
        image_url: profileData.image_url, // Required for admin
        gender: profileData.gender || undefined,
        birthday: birthdayISO,
      };

      await updateProfile(updateData);
      setEditingBirthday(false);
    } catch (error: any) {
      console.error("Error updating birthday:", error);
      const errorMessage = error?.response?.data?.message || error?.response?.data?.error || error?.message || "Cập nhật ngày sinh thất bại";
      toast.error(errorMessage);
    }
  };

  const handleCancelBirthday = () => {
    if (profileData && profileData.birthday) {
      const date = new Date(profileData.birthday);
      setBirthdayValue(date.toISOString().split("T")[0]);
    } else {
      setBirthdayValue("");
    }
    setEditingBirthday(false);
  };

  // Handle password change
  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Mật khẩu mới phải có ít nhất 8 ký tự");
      return;
    }

    try {
      await updatePassword(passwordData as AdminPasswordUpdateRequest);
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  // Format phone number for display (mask middle digits)
  const formatPhoneForDisplay = (phone: string) => {
    if (!phone || phone.length < 4) return phone;
    const start = phone.substring(0, 2);
    const end = phone.substring(phone.length - 2);
    return `${start}${"*".repeat(phone.length - 4)}${end}`;
  };

  // Format email for display (mask middle part)
  const formatEmailForDisplay = (email: string) => {
    if (!email) return "";
    const [localPart, domain] = email.split("@");
    if (!localPart || !domain) return email;
    if (localPart.length <= 3) return email;
    const start = localPart.substring(0, 3);
    return `${start}${"*".repeat(localPart.length - 3)}@${domain}`;
  };

  // Format date for display
  const formatDateForDisplay = (dateString: string | null) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateString;
    }
  };

  // Determine which page to show based on the path
  const getPageContent = () => {
    if (path.includes("/profile")) {
      if (isLoadingProfile) {
        return (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Đang tải...</div>
          </div>
        );
      }

      if (!profileData) {
        return (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Không tìm thấy thông tin hồ sơ</div>
          </div>
        );
      }

      return (
        <div>
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-0.5">
              Hồ sơ của tôi
            </h2>
            <p className="text-gray-500 text-sm">
              Quản lý thông tin hồ sơ để bảo mật
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left section - User information */}
              <div className="lg:col-span-2 space-y-6">
                {/* Tên đăng nhập */}
                <div className="flex items-center justify-between">
                  <label className="text-gray-700 font-medium min-w-[200px] text-right mr-8">
                    Tên đăng nhập
                  </label>
                  <span className="text-gray-900 flex-1">{profileData.username}</span>
                </div>

                {/* Tên */}
                <div className="flex items-center justify-between">
                  <label className="text-gray-700 font-medium min-w-[200px] text-right mr-8">
                    Tên
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Email */}
                <div className="flex items-center justify-between">
                  <label className="text-gray-700 font-medium min-w-[200px] text-right mr-8">
                    Email
                  </label>
                  <div className="flex-1">
                    {editingEmail ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="email"
                          value={emailValue}
                          onChange={(e) => setEmailValue(e.target.value)}
                          className="flex-1 px-4 py-2 border-2 border-[#E04D30] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E04D30]"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleUpdateEmail();
                            if (e.key === "Escape") handleCancelEmail();
                          }}
                        />
                        <button
                          onClick={handleUpdateEmail}
                          disabled={isUpdatingProfile}
                          className="w-9 h-9 bg-[#E04D30] text-white rounded-lg flex items-center justify-center hover:bg-[#d0442a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg
                            className="w-5 h-5"
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
                        </button>
                        <button
                          onClick={handleCancelEmail}
                          className="w-9 h-9 bg-gray-200 text-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
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
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="text-gray-900">
                          {formatEmailForDisplay(profileData.email)}
                        </span>
                        <button 
                          onClick={() => {
                            setEmailValue(profileData.email);
                            setEditingEmail(true);
                          }}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                      Thay đổi
                    </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Số điện thoại */}
                <div className="flex items-center justify-between">
                  <label className="text-gray-700 font-medium min-w-[200px] text-right mr-8">
                    Số điện thoại
                  </label>
                  <div className="flex-1">
                    {editingPhone ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="tel"
                          value={phoneValue}
                          onChange={(e) => setPhoneValue(e.target.value.replace(/\D/g, ""))}
                          className="flex-1 px-4 py-2 border-2 border-[#E04D30] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E04D30]"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleUpdatePhone();
                            if (e.key === "Escape") handleCancelPhone();
                          }}
                        />
                        <button
                          onClick={handleUpdatePhone}
                          disabled={isUpdatingProfile}
                          className="w-9 h-9 bg-[#E04D30] text-white rounded-lg flex items-center justify-center hover:bg-[#d0442a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg
                            className="w-5 h-5"
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
                        </button>
                        <button
                          onClick={handleCancelPhone}
                          className="w-9 h-9 bg-gray-200 text-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
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
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="text-gray-900">
                          {formatPhoneForDisplay(profileData.phone)}
                        </span>
                        <button 
                          onClick={() => {
                            setPhoneValue(profileData.phone);
                            setEditingPhone(true);
                          }}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                      Thay đổi
                    </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Giới tính */}
                <div className="flex items-center justify-between">
                  <label className="text-gray-700 font-medium min-w-[200px] text-right mr-8">
                    Giới tính
                  </label>
                  <div className="flex-1 flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="FEMALE"
                        checked={formData.gender === "FEMALE"}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value as "MALE" | "FEMALE" | "OTHER" })}
                        className="w-4 h-4 text-[#E04D30] focus:ring-[#E04D30] accent-[#E04D30]"
                      />
                      <span className="text-gray-900">Nữ</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="MALE"
                        checked={formData.gender === "MALE"}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value as "MALE" | "FEMALE" | "OTHER" })}
                        className="w-4 h-4 text-[#E04D30] focus:ring-[#E04D30] accent-[#E04D30]"
                      />
                      <span className="text-gray-900">Nam</span>
                    </label>
                  </div>
                </div>

                {/* Ngày sinh */}
                <div className="flex items-center justify-between">
                  <label className="text-gray-700 font-medium min-w-[200px] text-right mr-8">
                    Ngày sinh
                  </label>
                  <div className="flex-1">
                    {editingBirthday ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="date"
                          value={birthdayValue}
                          onChange={(e) => setBirthdayValue(e.target.value)}
                          className="flex-1 px-4 py-2 border-2 border-[#E04D30] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E04D30]"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleUpdateBirthday();
                            if (e.key === "Escape") handleCancelBirthday();
                          }}
                        />
                        <button
                          onClick={handleUpdateBirthday}
                          disabled={isUpdatingProfile}
                          className="w-9 h-9 bg-[#E04D30] text-white rounded-lg flex items-center justify-center hover:bg-[#d0442a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg
                            className="w-5 h-5"
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
                        </button>
                        <button
                          onClick={handleCancelBirthday}
                          className="w-9 h-9 bg-gray-200 text-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
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
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="text-gray-900">
                          {formatDateForDisplay(profileData.birthday)}
                        </span>
                        <button 
                          onClick={() => {
                            if (profileData.birthday) {
                              const date = new Date(profileData.birthday);
                              setBirthdayValue(date.toISOString().split("T")[0]);
                            } else {
                              setBirthdayValue("");
                            }
                            setEditingBirthday(true);
                          }}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                      Thay đổi
                    </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right section - Profile picture */}
              <div className="lg:col-span-1 flex flex-col items-center">
                <div className="w-full max-w-[200px] aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-red-500 flex items-center justify-center mb-4 overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                  <svg
                    className="w-16 h-16 text-gray-400"
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
                  )}
                </div>
                <label className="bg-[#E04D30] text-white py-2.5 px-4 rounded-lg font-medium hover:bg-[#d0442a] transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  Chọn ảnh
                </label>
              </div>
            </div>
            {/* Action buttons */}
            <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-gray-200">
                <button 
                  onClick={() => {
                  if (adminProfile) {
                    setFormData({
                      name: adminProfile.name || "",
                      gender: adminProfile.gender || "FEMALE",
                      image_url: adminProfile.image_url || "",
                    });
                    setImagePreview(toAbsoluteImageUrl(adminProfile.image_url));
                  }
                }}
                className="bg-gray-200 text-gray-700 py-2.5 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Hủy
              </button>
              <button 
                onClick={handleSaveProfile}
                disabled={isUpdatingProfile}
                className="bg-[#E04D30] text-white py-2.5 px-6 rounded-lg font-medium hover:bg-[#d0442a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdatingProfile ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      );
    } else if (path.includes("/address")) {
      return (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Địa chỉ</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-gray-500">Trang quản lý địa chỉ</p>
          </div>
        </div>
      );
    } else if (path.includes("/password")) {
      return (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Đổi mật khẩu
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left column */}
              <div className="space-y-6">
                {/* Mật khẩu tài khoản đang đăng nhập */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Mật khẩu tài khoản đang đăng nhập<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu hiện tại"
                      value={passwordData.oldPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#E04D30] focus:border-[#E04D30] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showCurrentPassword ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Nhập mật khẩu mới */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Nhập mật khẩu mới<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu mới"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#E04D30] focus:border-[#E04D30] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showNewPassword ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Lưu ý */}
                <div>
                  <p className="text-sm mb-2">
                    <span className="font-bold text-red-500">Lưu ý:</span>{" "}
                    <span className="text-gray-700">
                      Mật khẩu cần thoả mãn các điều kiện sau
                    </span>
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                    <li>Có độ dài ít nhất 8 ký tự.</li>
                    <li>
                      Chứa ít nhất 01 ký tự số, 01 ký tự chữ và 01 ký tự đặc
                      biệt.
                    </li>
                    <li>Không được trùng với 4 mật khẩu gần nhất.</li>
                  </ul>
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-6">
                {/* Số điện thoại */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    value={adminProfile?.phone || ""}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
                  />
                </div>

                {/* Nhập lại mật khẩu */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Nhập lại mật khẩu<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Nhập lại mật khẩu mới"
                      value={passwordData.confirmNewPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#E04D30] focus:border-[#E04D30] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
              <button 
                onClick={() => {
                  setPasswordData({
                    oldPassword: "",
                    newPassword: "",
                    confirmNewPassword: "",
                  });
                }}
                className="bg-white text-[#E04D30] border border-[#E04D30] py-2.5 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button 
                onClick={handleChangePassword}
                disabled={isUpdatingPassword}
                className="bg-[#E04D30] text-white py-2.5 px-6 rounded-lg font-medium hover:bg-[#d0442a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdatingPassword ? "Đang xác nhận..." : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      );
    } else if (path.includes("/shop")) {
      if (isEditingShop) {
        return (
          <div>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-0.5">
                Thông tin cơ bản
              </h2>
              <p className="text-gray-500 text-sm">
                Quản lý thông tin shop
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="space-y-6 ml-8">
                {/* Tên Shop */}
                <div className="flex items-start">
                  <label className="text-gray-700 font-medium min-w-[140px] text-right pt-2">
                    Tên Shop
                  </label>
                  <div className="ml-8 flex-1">
                    <div className="relative">
                      <input
                        type="text"
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        maxLength={30}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#E04D30] focus:border-[#E04D30] pr-16"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                        {shopName.length}/30
                      </span>
                    </div>
                  </div>
                </div>

                {/* Logo của Shop */}
                <div className="flex items-start">
                  <label className="text-gray-700 font-medium min-w-[140px] text-right pt-2">
                    Logo của Shop
                  </label>
                  <div className="ml-8 flex-1">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <div className="w-24 h-24 bg-[#18345C] rounded-full flex items-center justify-center p-2">
                          <img
                            src={ShopLogo}
                            alt="Shop Logo"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <button className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors">
                          Sửa
                        </button>
                      </div>
                      <div className="flex-1">
                        <ul className="text-sm text-gray-600 space-y-1 list-disc ml-4">
                          <li>Dung lượng file tối đa: 2.0MB</li>
                          <li>
                            Định dạng file được hỗ trợ: JPG, JPEG, PNG
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setIsEditingShop(false)}
                  className="bg-white text-gray-700 border border-gray-300 py-2.5 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={() => setIsEditingShop(false)}
                  className="bg-[#E04D30] text-white py-2.5 px-6 rounded-lg font-medium hover:bg-[#d0442a] transition-colors"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div>
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-0.5">
              Thông tin cơ bản
          </h2>
            <p className="text-gray-500 text-sm">
              Quản lý thông tin shop
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex flex-col lg:flex-row gap-8 ml-8 items-start">
              {/* Left section - Shop information */}
              <div className="flex-1 space-y-6">
                {/* Tên shop */}
                <div className="flex items-center">
                  <label className="text-gray-700 font-medium min-w-[140px] text-right">
                    Tên shop
                  </label>
                  <span className="text-gray-900 ml-8">{shopName}</span>
                </div>

                {/* Logo shop */}
                <div className="flex items-center">
                  <label className="text-gray-700 font-medium min-w-[140px] text-right">
                    Logo của shop
                  </label>
                  <div className="ml-8">
                    <div className="w-24 h-24 bg-[#18345C] rounded-full flex items-center justify-center p-2">
                      <img
                        src={ShopLogo}
                        alt="Shop Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right section - Action buttons */}
              <div className="flex flex-row gap-4">
                <button className="bg-white text-gray-700 border border-gray-300 py-2.5 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Xem shop của tôi
                </button>
                <button
                  onClick={() => setIsEditingShop(true)}
                  className="bg-white text-gray-700 border border-gray-300 py-2.5 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Chỉnh sửa
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Default to profile page if no match (shouldn't happen due to redirect)
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Hồ sơ</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-gray-500">Trang hồ sơ người dùng</p>
        </div>
      </div>
    );
  };

  return <div className="space-y-6">{getPageContent()}</div>;
};

export default AdminSettings;
