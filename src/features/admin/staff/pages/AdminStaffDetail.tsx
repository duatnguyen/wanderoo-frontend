// src/pages/admin/AdminStaffDetail.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

type Staff = {
  id: string;
  name: string;
  username: string;
  role: string;
  status: "active" | "disabled";
  avatar?: string;
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  password: string;
  gender: "male" | "female";
};

// Mock data - in real app, fetch from API using staffId
const mockStaffData: Staff[] = [
  {
    id: "S001",
    name: "Nguyễn Thị Thanh",
    username: "nguyenthanh",
    role: "Quản lý",
    status: "active",
    avatar: "/api/placeholder/100/100",
    fullName: "Nguyễn Thị Thanh",
    phone: "0234245969",
    email: "thanh@gmail.com",
    dateOfBirth: "1990-05-15",
    password: "thanh123",
    gender: "female",
  },
  {
    id: "S002",
    name: "Hoàng Văn Thụ",
    username: "hoangthu",
    role: "Quản lý hệ thống",
    status: "active",
    avatar: "/api/placeholder/100/100",
    fullName: "Hoàng Văn Thụ",
    phone: "0234245969",
    email: "thu2394@gmail.com",
    dateOfBirth: "2003-02-23",
    password: "thu23523",
    gender: "male",
  },
  {
    id: "S003",
    name: "Lã Thị Duyên",
    username: "laduen",
    role: "Nhân viên",
    status: "active",
    avatar: "/api/placeholder/100/100",
    fullName: "Lã Thị Duyên",
    phone: "0123456789",
    email: "duyen@gmail.com",
    dateOfBirth: "1995-08-20",
    password: "duyen123",
    gender: "female",
  },
];

const AdminStaffDetail: React.FC = () => {
  const navigate = useNavigate();
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
  });

  // Find staff by ID - in real app, fetch from API
  const staff = mockStaffData.find((s) => s.id === staffId);

  // Initialize form data when opening edit modal
  useEffect(() => {
    if (isEditing && staff) {
      setEditFormData({
        fullName: staff.fullName,
        phone: staff.phone,
        email: staff.email,
        dateOfBirth: staff.dateOfBirth,
        password: staff.password,
        gender: staff.gender,
        role: staff.role,
      });
    }
  }, [isEditing, staff]);

  if (!staff) {
    return (
      <div className="flex flex-col items-center justify-center px-[50px] py-[32px] w-full">
        <p className="text-[#272424] text-[16px]">Không tìm thấy nhân viên</p>
        <button
          onClick={() => navigate("/admin/staff")}
          className="mt-4 text-[#e04d30] underline"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day} / ${month} / ${year}`;
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
    // TODO: Implement save logic - call API to update staff
    console.log("Saving staff data:", editFormData);
    setIsEditing(false);
    // In real app, update the staff object or refetch data
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const roleOptions = [
    "Quản lý",
    "Quản lý hệ thống",
    "Nhân viên",
    "Nhân viên thu ngân",
  ];

  return (
    <div className="flex flex-col items-center w-full">
      {/* Header */}
      <div className="flex flex-col gap-[8px] items-start justify-center px-0 py-[20px] w-full">
        <div className="flex gap-[10px] items-center w-full">
          <button
            onClick={() => navigate("/admin/staff")}
            className="w-5 h-5 flex items-center justify-center cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-[#737373]" />
          </button>
          <h1 className="font-bold text-[#272424] text-[24px] leading-normal">
            {staff.name}
          </h1>
        </div>
      </div>

      <div className="flex flex-col gap-[12px] items-start w-full">
        {/* Account Information Section */}
        <div className="bg-white border border-[#d1d1d1] flex flex-col gap-[8px] items-start justify-center px-[40px] py-[20px] rounded-[24px] w-full">
          <div className="flex items-center w-full">
            <h2 className="font-bold text-[#272424] text-[24px] leading-normal">
              Thông tin tài khoản
            </h2>
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="flex gap-[10px] items-center">
              <div className="w-[100px] h-[100px] relative overflow-hidden rounded-lg border-2 border-dotted border-[#e04d30]">
                <Avatar className="w-full h-full">
                  {staff.avatar ? (
                    <AvatarImage src={staff.avatar} alt={staff.name} />
                  ) : (
                    <AvatarFallback className="text-lg">
                      {staff.name.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
              <div className="flex flex-col gap-[4px]">
                <span className="font-semibold text-[16px] text-[#272424] leading-[1.4]">
                  {staff.fullName}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-[6px] items-end">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-[6px] cursor-pointer"
              >
                <Pencil className="w-[30px] h-[30px] text-[#1a71f6]" />
                <span className="font-semibold text-[14px] text-[#1a71f6] leading-[1.4]">
                  Chỉnh sửa
                </span>
              </button>
              <div className="bg-[#b2ffb4] flex gap-[10px] items-center justify-center px-[8px] py-[6px] rounded-[10px]">
                <span className="font-semibold text-[16px] text-[#04910c] leading-[1.4]">
                  Đang kích hoạt
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
                value={staff.fullName}
                readOnly
                className="text-[#272424]"
              />
            </div>
            <div className="flex flex-col gap-[6px] h-[78px] items-start flex-1">
              <label className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                Số điện thoại
              </label>
              <FormInput
                type="tel"
                value={staff.phone}
                readOnly
                className="text-[#272424]"
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
                value={staff.email}
                readOnly
                className="text-[#272424]"
              />
            </div>
            <div className="flex flex-col gap-[6px] h-[78px] items-start flex-1">
              <label className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                Ngày sinh
              </label>
              <FormInput
                type="text"
                value={formatDateForDisplay(staff.dateOfBirth)}
                readOnly
                className="text-[10px] font-medium text-[#737373]"
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
                value={staff.password}
                readOnly
                className="text-[#888888]"
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
                  checked={staff.gender === "female"}
                  readOnly
                  label="Nữ"
                />
                <CustomRadio
                  name="gender"
                  value="male"
                  checked={staff.gender === "male"}
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
                  {staff.role}
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
            <div className="flex items-center px-[16px] py-[16px]">
              <h2 className="font-bold text-[#1a1a1b] text-[24px] leading-normal">
                Sửa thông tin tài khoản
              </h2>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto px-[16px] py-0 flex flex-col gap-[12px]">
              {/* Full Name */}
              <div className="flex flex-col gap-[6px] h-[78px] items-start w-full">
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
                  className="text-[#272424]"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-[6px] h-[78px] items-start w-full">
                <label className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                  Số điện thoại
                </label>
                <FormInput
                  type="tel"
                  value={editFormData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Nhập số điện thoại"
                  className="text-[#272424]"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-[6px] h-[78px] items-start w-full">
                <label className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                  Email
                </label>
                <FormInput
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Nhập email"
                  className="text-[#272424]"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-[6px] h-[78px] items-start w-full">
                <label className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                  Mật khẩu
                </label>
                <FormInput
                  type="password"
                  value={editFormData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  placeholder="Nhập mật khẩu"
                  className="text-[#888888]"
                />
              </div>

              {/* Date of Birth and Gender Row */}
              <div className="flex gap-[50px] items-center w-full">
                {/* Date of Birth */}
                <div className="flex flex-col gap-[6px] h-[78px] items-start flex-1">
                  <label className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                    Ngày sinh
                  </label>
                  <FormInput
                    type="date"
                    value={editFormData.dateOfBirth}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                    className="text-[10px] font-medium text-[#737373]"
                    right={
                      <Calendar className="w-[24px] h-[24px] text-[#454545]" />
                    }
                  />
                </div>

                {/* Gender */}
                <div className="flex flex-col gap-[22px] h-[54px] items-start justify-center flex-1">
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
              <div className="flex flex-col gap-[6px] items-start w-full pb-[12px]">
                <label className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                  Vai trò
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="bg-white border-2 border-[#e04d30] flex gap-[6px] h-[50px] items-center px-[24px] py-[12px] rounded-[12px] w-full cursor-pointer">
                      <span className="text-[#e04d30] text-[12px] font-semibold leading-[1.4] flex-1 text-left">
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
                      >
                        {role}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-[10px] items-center justify-end px-[16px] py-[12px]">
              <Button variant="secondary" onClick={handleCancel}>
                Huỷ
              </Button>
              <Button onClick={handleSave}>Xác nhận</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStaffDetail;
