import React, { useState, useRef } from "react";
import { Input, DatePicker } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import Button from "../../../../components/shop/Button";
import CustomRadio from "../../../../components/ui/custom-radio";

interface UserData {
  fullName: string;
  email: string;
  phone: string;
  gender: "male" | "female";
  dateOfBirth: string;
  avatar: string;
}

const BasicInformationTab: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userData, setUserData] = useState<UserData>({
    fullName: "Thanh",
    email: "thanh@gmail.com",
    phone: "0812345678",
    gender: "male",
    dateOfBirth: "**/**/2003",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  });

  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValues, setTempValues] = useState<{
    email?: string;
    phone?: string;
    dateOfBirth?: Dayjs | null;
  }>({});

  // Mask email: show first 2 chars, then asterisks, then @domain
  const maskEmail = (email: string): string => {
    const [localPart, domain] = email.split("@");
    if (localPart.length <= 2) return email;
    const visible = localPart.substring(0, 2);
    const masked = "*".repeat(Math.max(11, localPart.length - 2));
    return `${visible}${masked}@${domain}`;
  };

  // Mask phone: show first 2 digits, then asterisks
  const maskPhone = (phone: string): string => {
    if (phone.length <= 2) return phone;
    const visible = phone.substring(0, 2);
    const masked = "*".repeat(phone.length - 2);
    return `${visible}${masked}`;
  };

  const formatDateForInput = (dateString: string): Dayjs | null => {
    // If it's in DD/MM/YYYY format, convert to Dayjs object
    if (dateString.includes("/") && !dateString.includes("**")) {
      const [day, month, year] = dateString.split("/");
      return dayjs(`${year}-${month}-${day}`, "YYYY-MM-DD");
    }
    return null;
  };

  const handleSave = () => {
    if (editingField) {
      if (editingField === "email" && tempValues.email) {
        setUserData({ ...userData, email: tempValues.email });
      } else if (editingField === "phone" && tempValues.phone) {
        setUserData({ ...userData, phone: tempValues.phone });
      } else if (editingField === "dateOfBirth" && tempValues.dateOfBirth) {
        setUserData({
          ...userData,
          dateOfBirth: tempValues.dateOfBirth.format("DD/MM/YYYY"),
        });
      }
      setEditingField(null);
      setTempValues({});
    } else {
      // Save full name and gender
      console.log("Saving user data:", userData);
    }
  };

  const handleChangeClick = (field: "email" | "phone" | "dateOfBirth") => {
    setEditingField(field);
    if (field === "email") {
      setTempValues({ ...tempValues, email: userData.email });
    } else if (field === "phone") {
      setTempValues({ ...tempValues, phone: userData.phone });
    } else if (field === "dateOfBirth") {
      setTempValues({
        ...tempValues,
        dateOfBirth: formatDateForInput(userData.dateOfBirth),
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setTempValues({});
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file hình ảnh");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("Kích thước file không được vượt quá 5MB");
      return;
    }

    // Read file and update avatar
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setUserData({
          ...userData,
          avatar: e.target.result as string,
        });
      }
    };
    reader.readAsDataURL(file);

    // Reset input
    if (event.target) {
      event.target.value = "";
    }
  };

  const handleChooseAvatar = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      {/* Form and Avatar Layout */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Left Column - Form */}
        <div className="flex-1 space-y-10">
          {/* Full Name */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="text-sm font-medium text-gray-700 w-32 flex-shrink-0">
              Họ và tên
            </label>
            <div className="flex-1">
              <Input
                type="text"
                value={userData.fullName}
                onChange={(e) =>
                  setUserData({ ...userData, fullName: e.target.value })
                }
                className="w-full"
                size="large"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="text-sm font-medium text-gray-700 w-32 flex-shrink-0">
              Email
            </label>
            <div className="flex-1 flex items-center gap-2">
              {editingField === "email" ? (
                <>
                  <Input
                    type="email"
                    value={tempValues.email || ""}
                    onChange={(e) =>
                      setTempValues({ ...tempValues, email: e.target.value })
                    }
                    placeholder="Nhập email"
                    className="flex-1"
                    size="large"
                  />
                  <Button
                    variant="link"
                    onClick={handleSave}
                    className="text-sm whitespace-nowrap"
                  >
                    Lưu
                  </Button>
                  <Button
                    variant="link"
                    onClick={handleCancelEdit}
                    className="text-sm whitespace-nowrap !text-gray-600 hover:!text-gray-700"
                  >
                    Hủy
                  </Button>
                </>
              ) : (
                <>
                  <span className="text-gray-900">
                    {maskEmail(userData.email)}
                  </span>
                  <Button
                    variant="link"
                    onClick={() => handleChangeClick("email")}
                    className="text-sm whitespace-nowrap"
                  >
                    Thay đổi
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Phone */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="text-sm font-medium text-gray-700 w-32 flex-shrink-0">
              Số điện thoại
            </label>
            <div className="flex-1 flex items-center gap-2">
              {editingField === "phone" ? (
                <>
                  <Input
                    type="tel"
                    value={tempValues.phone || ""}
                    onChange={(e) =>
                      setTempValues({ ...tempValues, phone: e.target.value })
                    }
                    placeholder="Nhập số điện thoại"
                    className="flex-1"
                    size="large"
                  />
                  <Button
                    variant="link"
                    onClick={handleSave}
                    className="text-sm whitespace-nowrap"
                  >
                    Lưu
                  </Button>
                  <Button
                    variant="link"
                    onClick={handleCancelEdit}
                    className="text-sm whitespace-nowrap !text-gray-600 hover:!text-gray-700"
                  >
                    Hủy
                  </Button>
                </>
              ) : (
                <>
                  <span className="text-gray-900">
                    {maskPhone(userData.phone)}
                  </span>
                  <Button
                    variant="link"
                    onClick={() => handleChangeClick("phone")}
                    className="text-sm whitespace-nowrap"
                  >
                    Thay đổi
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Gender */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="text-sm font-medium text-gray-700 w-32 flex-shrink-0">
              Giới tính
            </label>
            <div className="flex-1 flex items-center gap-6">
              <CustomRadio
                name="gender"
                value="male"
                checked={userData.gender === "male"}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    gender: e.target.value as "male" | "female",
                  })
                }
                label="Nam"
              />
              <CustomRadio
                name="gender"
                value="female"
                checked={userData.gender === "female"}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    gender: e.target.value as "male" | "female",
                  })
                }
                label="Nữ"
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="text-sm font-medium text-gray-700 w-32 flex-shrink-0">
              Ngày sinh
            </label>
            <div className="flex-1 flex items-center gap-2">
              {editingField === "dateOfBirth" ? (
                <>
                  <DatePicker
                    value={tempValues.dateOfBirth}
                    onChange={(date) =>
                      setTempValues({
                        ...tempValues,
                        dateOfBirth: date,
                      })
                    }
                    format="DD/MM/YYYY"
                    placeholder="Chọn ngày sinh"
                    className="flex-1"
                    size="large"
                    disabledDate={(current) => {
                      return current && current > dayjs().endOf("day");
                    }}
                  />
                  <Button
                    variant="link"
                    onClick={handleSave}
                    className="text-sm whitespace-nowrap"
                  >
                    Lưu
                  </Button>
                  <Button
                    variant="link"
                    onClick={handleCancelEdit}
                    className="text-sm whitespace-nowrap !text-gray-600 hover:!text-gray-700"
                  >
                    Hủy
                  </Button>
                </>
              ) : (
                <>
                  <span className="text-gray-900">{userData.dateOfBirth}</span>
                  <Button
                    variant="link"
                    onClick={() => handleChangeClick("dateOfBirth")}
                    className="text-sm whitespace-nowrap"
                  >
                    Thay đổi
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-center pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={handleSave}
              className="!bg-[#ff6b35] hover:!bg-[#e55a2b] !border-[#ff6b35] hover:!border-[#e55a2b]"
            >
              Lưu
            </Button>
          </div>
        </div>

        {/* Right Column - Avatar Upload */}
        <div className="flex-shrink-0 flex flex-col items-center lg:items-start">
          <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 mb-4 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
            <img
              src={userData.avatar}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <Button variant="outline" size="md" onClick={handleChooseAvatar}>
            Chọn ảnh
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInformationTab;
