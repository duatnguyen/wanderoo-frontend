// src/pages/admin/AdminStaffDetail.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Calendar, HelpCircle, Pencil } from "lucide-react";
import FormInput from "@/components/ui/form-input";
import CustomRadio from "@/components/ui/custom-radio";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CaretDown from "@/components/ui/caret-down";
import { getEmployeeById, updateEmployee, updateEmployeeAccount, type AllowedRole } from "@/api/endpoints/userApi";
import type { EmployeeResponse } from "@/types";
import { toast } from "sonner";

// Map UserType to Vietnamese role labels
const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Quản trị viên",
  MANAGER: "Quản lý",
  EMPLOYEE: "Nhân viên",
  OPERATIONS_MANAGER: "Quản lý vận hành",
};

// Map Vietnamese role labels to UserType enum
const ROLE_TO_USER_TYPE: Record<string, AllowedRole> = {
  "Quản trị viên": "ADMIN",
  "Quản lý": "MANAGER",
  "Nhân viên": "EMPLOYEE",
  "Quản lý vận hành": "OPERATIONS_MANAGER",
};

const getRoleLabel = (type?: string | null): string => {
  if (!type) return "Nhân viên";
  const normalizedType = type.toUpperCase();
  return ROLE_LABELS[normalizedType] || type;
};

const AdminStaffDetail: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { staffId } = useParams<{ staffId: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    password: "",
    gender: "female" as "male" | "female",
    role: "",
    username: "",
  });

  // Fetch employee data from API
  const {
    data: staff,
    isLoading,
    isError,
    refetch: refetchStaff,
  } = useQuery<EmployeeResponse>({
    queryKey: ["admin-staff-detail", staffId],
    queryFn: () => getEmployeeById(Number(staffId)),
    enabled: !!staffId,
    staleTime: 0, // Always consider data stale to ensure fresh fetch
  });

  // Initialize form data when opening edit modal
  useEffect(() => {
    if (isEditing && staff) {
      // Format birthday from Date string to YYYY-MM-DD
      const birthdayStr = staff.birthday
        ? new Date(staff.birthday).toISOString().split("T")[0]
        : "";
      
      setEditFormData({
        fullName: staff.name || "",
        phone: staff.phone || "",
        email: staff.email || "",
        dateOfBirth: birthdayStr,
        password: "", // Don't prefill password
        gender: (staff.gender?.toLowerCase() as "male" | "female") || "female",
        role: getRoleLabel(staff.type),
        username: staff.username || "",
      });
    }
  }, [isEditing, staff]);

  // Update employee mutation
  const updateMutation = useMutation({
    mutationFn: async (data: {
      id: number;
      name: string;
      username: string;
      phone: string;
      email?: string;
      password: string;
      gender: "MALE" | "FEMALE";
      birthday?: string;
      userType?: AllowedRole;
    }) => {
      console.log("Mutation called with data:", data);
      
      // Format birthday to ISO string if provided
      const formattedBirthday = data.birthday
        ? new Date(data.birthday).toISOString()
        : undefined;

      const updateData: any = {
        id: data.id,
        name: data.name,
        username: data.username,
        phone: data.phone,
        gender: data.gender,
      };

      // Only include optional fields if they have values
      if (data.email && data.email.trim()) {
        updateData.email = data.email;
      }
      // Only include password if it's provided and not empty
      // Backend will encode it, so we must not send empty password
      if (data.password && data.password.trim()) {
        updateData.password = data.password;
      }
      // Only include birthday if provided
      if (formattedBirthday) {
        updateData.birthday = formattedBirthday;
      }
      
      console.log("Final updateData:", JSON.stringify(updateData, null, 2));
      console.log("userType:", data.userType);

      // Always use updateEmployeeAccount if we have userType (for role support)
      // Otherwise use regular updateEmployee
      if (data.userType) {
        console.log("Calling updateEmployeeAccount with userType:", data.userType);
        try {
          const result = await updateEmployeeAccount(updateData, data.userType);
          console.log("updateEmployeeAccount result:", result);
          return result;
        } catch (error) {
          console.error("updateEmployeeAccount error:", error);
          throw error;
        }
      } else {
        console.log("Calling updateEmployee (regular) - no userType provided");
        try {
          const result = await updateEmployee(data.id, updateData);
          console.log("updateEmployee result:", result);
          return result;
        } catch (error) {
          console.error("updateEmployee error:", error);
          throw error;
        }
      }
    },
    onSuccess: async (response, variables) => {
      console.log("Update successful, response:", response);
      console.log("Update variables:", variables);
      
      toast.success("Cập nhật thông tin nhân viên thành công");
      
      // Close modal first
      setIsEditing(false);
      
      // Small delay to ensure backend has processed the update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Invalidate queries to mark them as stale
      queryClient.invalidateQueries({ queryKey: ["admin-staff-detail", staffId] });
      queryClient.invalidateQueries({ queryKey: ["admin-staff"] });
      
      // Force refetch the current employee data
      const { data: updatedStaff } = await refetchStaff();
      console.log("Refetched staff data:", updatedStaff);
      
      // Also update the query cache directly if we have the updated data
      if (updatedStaff) {
        queryClient.setQueryData(["admin-staff-detail", staffId], updatedStaff);
      }
    },
    onError: (error: any) => {
      console.error("Update employee error:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể cập nhật thông tin nhân viên";
      toast.error(errorMessage);
    },
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center px-[50px] py-[32px] w-full">
        <p className="text-[#272424] text-[16px]">Đang tải thông tin nhân viên...</p>
      </div>
    );
  }

  // Error state
  if (isError || !staff) {
    return (
      <div className="flex flex-col items-center justify-center px-[50px] py-[32px] w-full">
        <p className="text-[#272424] text-[16px]">
          {isError ? "Không thể tải thông tin nhân viên" : "Không tìm thấy nhân viên"}
        </p>
        <button
          onClick={() => navigate("/admin/staff")}
          className="mt-4 text-[#e04d30] underline"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const formatDateForDisplay = (dateString?: string | null) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day} / ${month} / ${year}`;
    } catch {
      return "";
    }
  };

  const handleInputChange = (
    field: keyof typeof editFormData,
    value: string
  ) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    console.log("handleSave called", { staff, editFormData });
    
    if (!staff) {
      console.error("No staff data");
      return;
    }

    // Validation
    if (!editFormData.fullName.trim()) {
      toast.error("Vui lòng nhập họ và tên");
      return;
    }
    if (!editFormData.phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại");
      return;
    }
    if (!editFormData.username.trim()) {
      toast.error("Vui lòng nhập tên đăng nhập");
      return;
    }

    // Convert role from Vietnamese to enum
    const selectedUserType = editFormData.role
      ? ROLE_TO_USER_TYPE[editFormData.role]
      : undefined;

    // Only include password if it's provided (not empty)
    const passwordToSend = editFormData.password.trim() || undefined;

    const mutationData = {
      id: staff.id,
      name: editFormData.fullName.trim(),
      username: editFormData.username.trim(),
      phone: editFormData.phone.trim(),
      email: editFormData.email?.trim() || undefined,
      password: passwordToSend || "", // Keep empty string for now, will be filtered in mutation
      gender: editFormData.gender.toUpperCase() as "MALE" | "FEMALE",
      birthday: editFormData.dateOfBirth || undefined,
      userType: selectedUserType || staff.type?.toUpperCase() as AllowedRole | undefined, // Always include userType if available
    };

    console.log("Calling mutation with data:", mutationData);
    updateMutation.mutate(mutationData);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const roleOptions = Object.values(ROLE_LABELS);

  return (
    <div className="w-full overflow-x-auto min-h-screen">
      <div className="flex flex-col gap-[8px] items-start w-full pb-[100vh]">
        {/* Header */}
        <div className="flex flex-col gap-[8px] items-start justify-center px-0 pt-[10px] pb-0 w-full">
          <div className="flex gap-[10px] items-center w-full">
            <button
              onClick={() => navigate("/admin/staff")}
              className="w-5 h-5 flex items-center justify-center cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-[#737373]" />
            </button>
            <h1 className="font-bold text-[#272424] text-[24px] leading-normal">
              {staff.name || "Nhân viên"}
            </h1>
          </div>
        </div>

        <div className="flex flex-col gap-[8px] items-start w-full">
          {/* Account Information Section */}
          <div className="bg-white border border-[#d1d1d1] flex flex-col gap-[8px] items-start justify-center px-[40px] py-[12px] rounded-[24px] w-full">
            <div className="flex items-center w-full">
              <h2 className="font-bold text-[#272424] text-[24px] leading-normal">
                Thông tin tài khoản
              </h2>
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="flex gap-[10px] items-start">
                <div className="w-[60px] h-[60px] relative overflow-hidden rounded-lg border-2 border-dotted border-[#e04d30]">
                  <Avatar className="w-full h-full">
                    {staff.image_url ? (
                      <AvatarImage src={staff.image_url} alt={staff.name || ""} />
                    ) : (
                      <AvatarFallback className="text-lg">
                        {(staff.name || "N").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>
                <div className="flex gap-[8px] items-center">
                  <span className="font-semibold text-[16px] text-[#272424] leading-[1.4]">
                    {staff.name || ""}
                  </span>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center cursor-pointer"
                  >
                    <Pencil className="w-[20px] h-[20px] text-[#1a71f6]" />
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-[6px] items-end">
                <div
                  className={`flex gap-[10px] items-center justify-center px-[8px] rounded-[10px] h-[24px] ${
                    staff.status?.toUpperCase() === "ACTIVE"
                      ? "bg-[#b2ffb4]"
                      : "bg-[#ffe0df]"
                  }`}
                >
                  <span
                    className={`font-semibold text-[13px] leading-[1.4] ${
                      staff.status?.toUpperCase() === "ACTIVE"
                        ? "text-[#04910c]"
                        : "text-[#c53030]"
                    }`}
                  >
                    {staff.status?.toUpperCase() === "ACTIVE"
                      ? "Đang kích hoạt"
                      : "Ngừng kích hoạt"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white border border-[#d1d1d1] flex flex-col gap-[8px] items-start justify-center px-[40px] py-[20px] rounded-[24px] w-full">
            {/* First Row: Full Name and Phone */}
            <div className="flex gap-[50px] items-start w-full">
              <div className="flex flex-col gap-[6px] h-[78px] items-start flex-1">
                <label className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                  Họ và tên
                </label>
                <FormInput
                  type="text"
                  value={staff.name || ""}
                  readOnly
                  className="text-[#272424] text-[14px]"
                  containerClassName="bg-white border-2 border-[#e04d30] flex items-center p-[8px] rounded-[12px] w-full h-[36px]"
                />
              </div>
              <div className="flex flex-col gap-[6px] h-[78px] items-start flex-1">
                <label className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                  Số điện thoại
                </label>
                <FormInput
                  type="tel"
                  value={staff.phone || ""}
                  readOnly
                  className="text-[#272424] text-[14px]"
                  containerClassName="bg-white border-2 border-[#e04d30] flex items-center p-[8px] rounded-[12px] w-full h-[36px]"
                />
              </div>
            </div>

            {/* Second Row: Email and Date of Birth */}
            <div className="flex gap-[50px] items-start w-full">
              <div className="flex flex-col gap-[6px] h-[78px] items-start flex-1">
                <label className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                  Email
                </label>
                <FormInput
                  type="email"
                  value={staff.email || ""}
                  readOnly
                  className="text-[#272424] text-[14px]"
                  containerClassName="bg-white border-2 border-[#e04d30] flex items-center p-[8px] rounded-[12px] w-full h-[36px]"
                />
              </div>
              <div className="flex flex-col gap-[6px] h-[78px] items-start flex-1">
                <label className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                  Ngày sinh
                </label>
                <FormInput
                  type="text"
                  value={formatDateForDisplay(staff.birthday)}
                  readOnly
                  className="text-[14px] font-medium text-[#737373]"
                  containerClassName="bg-white border-2 border-[#e04d30] flex items-center p-[8px] rounded-[12px] w-full h-[36px]"
                  right={
                    <Calendar className="w-[24px] h-[24px] text-[#454545]" />
                  }
                />
              </div>
            </div>

            {/* Third Row: Password and Gender */}
            <div className="flex gap-[55px] items-center w-full">
              <div className="flex flex-col gap-[6px] h-[78px] items-start flex-1">
                <label className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                  Mật khẩu
                </label>
                <FormInput
                  type="password"
                  value="••••••••"
                  readOnly
                  className="text-[#888888] text-[14px]"
                  containerClassName="bg-white border-2 border-[#e04d30] flex items-center p-[8px] rounded-[12px] w-full h-[36px]"
                />
              </div>
              <div className="flex flex-col gap-[10px] h-[54px] items-start justify-center flex-1">
                <label className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                  Giới tính
                </label>
                <div className="flex gap-[10px] items-center w-[209px]">
                  <CustomRadio
                    name="gender"
                    value="female"
                    checked={(staff.gender?.toLowerCase() || "") === "female"}
                    readOnly
                    label="Nữ"
                  />
                  <CustomRadio
                    name="gender"
                    value="male"
                    checked={(staff.gender?.toLowerCase() || "") === "male"}
                    readOnly
                    label="Nam"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Role Section */}
          <div className="bg-white border border-[#d1d1d1] flex flex-col gap-[10px] items-start justify-center px-[40px] py-[20px] rounded-[24px] w-full">
            <div className="flex gap-[50px] items-start w-full">
              <div className="flex flex-col gap-[6px] items-start flex-1">
                <div className="flex gap-[4px] items-center">
                  <label className="font-semibold text-[#272424] text-[16px] leading-[1.4]">
                    Vai trò nhân viên
                  </label>
                  <HelpCircle className="w-[24px] h-[24px] text-[#888888]" />
                </div>
                <div className="bg-white border-2 border-[#e04d30] flex gap-[6px] items-center px-[24px] py-[12px] rounded-[12px] w-full cursor-default">
                  <span className="text-[#e04d30] text-[12px] font-semibold leading-[1.4]">
                    {getRoleLabel(staff.type)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal Overlay */}
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop with blur and light dark overlay */}
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm"
              onClick={handleCancel}
            />
            {/* Modal Content */}
            <div
              className="relative z-50 bg-[#f7f7f7] rounded-[24px] w-full max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center px-[8px] py-[16px]">
                <h2 className="font-bold text-[#1a1a1b] text-[24px] leading-normal">
                  Sửa thông tin tài khoản
                </h2>
              </div>

              {/* Form Content */}
              <div className="flex-1 overflow-y-auto px-[8px] py-0 flex flex-col gap-[6px]">
                {/* Full Name and Phone Row */}
                <div className="flex gap-[12px] items-start w-full">
                  {/* Full Name */}
                  <div className="flex flex-col gap-[2px] items-start flex-1">
                    <label className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                      Họ và tên
                    </label>
                    <FormInput
                      type="text"
                      value={editFormData.fullName}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      placeholder="Nhập họ và tên"
                      className="text-[#272424] text-[14px]"
                      containerClassName="bg-white border-2 border-[#e04d30] flex items-center p-[8px] rounded-[12px] w-full h-[36px]"
                    />
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-[2px] items-start flex-1">
                    <label className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                      Số điện thoại
                    </label>
                    <FormInput
                      type="tel"
                      value={editFormData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="Nhập số điện thoại"
                      className="text-[#272424] text-[14px]"
                      containerClassName="bg-white border-2 border-[#e04d30] flex items-center p-[8px] rounded-[12px] w-full h-[36px]"
                    />
                  </div>
                </div>

                {/* Username and Email Row */}
                <div className="flex gap-[12px] items-start w-full">
                  {/* Username */}
                  <div className="flex flex-col gap-[2px] items-start flex-1">
                    <label className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                      Tên đăng nhập
                    </label>
                    <FormInput
                      type="text"
                      value={editFormData.username}
                      onChange={(e) =>
                        handleInputChange("username", e.target.value)
                      }
                      placeholder="Nhập tên đăng nhập"
                      className="text-[#272424] text-[14px]"
                      containerClassName="bg-white border-2 border-[#e04d30] flex items-center p-[8px] rounded-[12px] w-full h-[36px]"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-[2px] items-start flex-1">
                    <label className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                      Email
                    </label>
                    <FormInput
                      type="email"
                      value={editFormData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="Nhập email"
                      className="text-[#272424] text-[14px]"
                      containerClassName="bg-white border-2 border-[#e04d30] flex items-center p-[8px] rounded-[12px] w-full h-[36px]"
                    />
                  </div>
                </div>

                {/* Password Row */}
                <div className="flex gap-[12px] items-start w-full">
                  {/* Password */}
                  <div className="flex flex-col gap-[2px] items-start flex-1">
                    <label className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                      Mật khẩu
                    </label>
                    <FormInput
                      type="password"
                      value={editFormData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      placeholder="Nhập mật khẩu mới (để trống nếu không đổi)"
                      className="text-[#888888] text-[14px]"
                      containerClassName="bg-white border-2 border-[#e04d30] flex items-center p-[8px] rounded-[12px] w-full h-[36px]"
                    />
                  </div>
                  <div className="flex-1"></div>
                </div>

                {/* Date of Birth and Gender Row */}
                <div className="flex gap-[12px] items-center w-full">
                  {/* Date of Birth */}
                  <div className="flex flex-col gap-[2px] items-start flex-1">
                    <label className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                      Ngày sinh
                    </label>
                    <FormInput
                      type="date"
                      value={editFormData.dateOfBirth}
                      onChange={(e) =>
                        handleInputChange("dateOfBirth", e.target.value)
                      }
                      className="text-[14px] font-medium text-[#737373]"
                      containerClassName="bg-white border-2 border-[#e04d30] flex items-center p-[8px] rounded-[12px] w-full h-[36px]"
                    />
                  </div>

                  {/* Gender */}
                  <div className="flex flex-col gap-[2px] items-start justify-center flex-1">
                    <label className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                      Giới tính
                    </label>
                    <div className="flex gap-[10px] items-center w-[209px]">
                      <CustomRadio
                        name="gender"
                        value="female"
                        checked={editFormData.gender === "female"}
                        onChange={() => handleInputChange("gender", "female")}
                        label="Nữ"
                      />
                      <CustomRadio
                        name="gender"
                        value="male"
                        checked={editFormData.gender === "male"}
                        onChange={() => handleInputChange("gender", "male")}
                        label="Nam"
                      />
                    </div>
                  </div>
                </div>

                {/* Role */}
                <div className="flex flex-col gap-[2px] items-start w-full">
                  <label className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                    Vai trò
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="bg-white border-2 border-[#e04d30] flex gap-[6px] h-[50px] items-center px-[24px] py-[12px] rounded-[12px] w-full cursor-pointer">
                        <span className="text-[#e04d30] text-[14px] font-semibold leading-[1.4] flex-1 text-left">
                          {editFormData.role || "Chọn vai trò"}
                        </span>
                        <CaretDown className="text-[#e04d30]" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      {roleOptions.map((role) => (
                        <DropdownMenuItem
                          key={role}
                          onClick={() => handleInputChange("role", role)}
                          className="text-[14px]"
                        >
                          {role}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex gap-[10px] items-center justify-end px-[8px] py-[8px]">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancel}
                  className="text-[14px]"
                  disabled={updateMutation.isPending}
                >
                  Huỷ
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  className="text-[14px]"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? "Đang lưu..." : "Xác nhận"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="h-[calc(100vh-100px)]"></div>
    </div>
  );
};

export default AdminStaffDetail;
