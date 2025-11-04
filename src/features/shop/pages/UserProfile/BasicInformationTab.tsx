import React, { useState, useEffect } from "react";
import { Form, Input, Radio, DatePicker, Upload, message } from "antd";
import type { UploadFile, UploadProps } from "antd";
import { CameraOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import ButtonComponent from "../../../../components/shop/Button";

interface UserData {
  fullName: string;
  email: string;
  phone: string;
  gender: "male" | "female";
  dateOfBirth: string;
  avatar: string;
}

const BasicInformationTab: React.FC = () => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFileList, setAvatarFileList] = useState<UploadFile[]>([]);
  const [userData] = useState<UserData>({
    fullName: "Thanh",
    email: "thanh@gmail.com",
    phone: "0812345678",
    gender: "male",
    dateOfBirth: "**/**/2003",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  });

  useEffect(() => {
    if (isEditing) {
      // Parse dateOfBirth if it's a valid date string, otherwise use null
      const dateOfBirth = userData.dateOfBirth.includes("**")
        ? null
        : dayjs(userData.dateOfBirth, "DD/MM/YYYY");

      form.setFieldsValue({
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        gender: userData.gender,
        dateOfBirth: dateOfBirth,
      });
    }
  }, [isEditing, form, userData]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      console.log("Saving user data:", {
        ...values,
        dateOfBirth: values.dateOfBirth
          ? values.dateOfBirth.format("DD/MM/YYYY")
          : userData.dateOfBirth,
      });
      setIsEditing(false);
      message.success("Cập nhật thông tin thành công");
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleAvatarChange: UploadProps["onChange"] = (info) => {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1); // Only keep the last file
    setAvatarFileList(fileList);

    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Hồ sơ của tôi
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </p>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Form Fields */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 order-2 lg:order-1 w-[70%]">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              fullName: userData.fullName,
              email: userData.email,
              phone: userData.phone,
              gender: userData.gender,
            }}
          >
            {/* Full Name */}
            {isEditing ? (
              <Form.Item
                label="Họ và tên"
                name="fullName"
                rules={[
                  { required: true, message: "Vui lòng nhập họ và tên" },
                  {
                    min: 2,
                    message: "Họ và tên phải có ít nhất 2 ký tự",
                  },
                ]}
              >
                <Input
                  placeholder="Nhập họ và tên"
                  className="text-gray-900 !h-12"
                  size="large"
                />
              </Form.Item>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên
                </label>
                <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 rounded-lg text-gray-900 text-sm sm:text-base">
                  {userData.fullName}
                </div>
              </div>
            )}

            {/* Email */}
            {isEditing ? (
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  {
                    type: "email",
                    message: "Email không hợp lệ",
                  },
                ]}
              >
                <Input
                  type="email"
                  placeholder="Nhập email"
                  className="text-gray-900 !h-12"
                  size="large"
                />
              </Form.Item>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 rounded-lg text-gray-900 text-sm sm:text-base break-all">
                  {userData.email}
                </div>
              </div>
            )}

            {/* Phone */}
            {isEditing ? (
              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại" },
                  {
                    pattern: /^[0-9]{10,11}$/,
                    message: "Số điện thoại không hợp lệ",
                  },
                ]}
              >
                <Input
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  className="text-gray-900 !h-12"
                  size="large"
                />
              </Form.Item>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 rounded-lg text-gray-900 text-sm sm:text-base">
                  {userData.phone}
                </div>
              </div>
            )}

            {/* Gender */}
            {isEditing ? (
              <Form.Item
                label="Giới tính"
                name="gender"
                rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
              >
                <Radio.Group>
                  <Radio value="male">Nam</Radio>
                  <Radio value="female">Nữ</Radio>
                </Radio.Group>
              </Form.Item>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giới tính
                </label>
                <div className="flex items-center gap-4 sm:gap-6">
                  <span className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 rounded-lg text-gray-900 text-sm sm:text-base">
                    {userData.gender === "male" ? "Nam" : "Nữ"}
                  </span>
                </div>
              </div>
            )}

            {/* Date of Birth */}
            {isEditing ? (
              <Form.Item
                label="Ngày sinh"
                name="dateOfBirth"
                rules={[
                  { required: false },
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();
                      const age = dayjs().diff(value, "year");
                      if (age < 0) {
                        return Promise.reject(
                          new Error("Ngày sinh không thể ở tương lai")
                        );
                      }
                      if (age > 120) {
                        return Promise.reject(
                          new Error("Ngày sinh không hợp lệ")
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <DatePicker
                  format="DD/MM/YYYY"
                  placeholder="Chọn ngày sinh"
                  className="w-full !h-12"
                  size="large"
                  disabledDate={(current) => {
                    return current && current > dayjs().endOf("day");
                  }}
                />
              </Form.Item>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày sinh
                </label>
                <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 rounded-lg text-gray-900 text-sm sm:text-base">
                  {userData.dateOfBirth}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {isEditing ? (
              <div className="pt-2 sm:pt-4 flex gap-3">
                <ButtonComponent
                  variant="primary"
                  size="lg"
                  onClick={handleSave}
                  className="w-full sm:w-auto px-6 sm:px-8"
                >
                  Lưu
                </ButtonComponent>
                <ButtonComponent
                  variant="outline"
                  size="lg"
                  onClick={handleCancel}
                  className="w-full sm:w-auto px-6 sm:px-8"
                >
                  Hủy
                </ButtonComponent>
              </div>
            ) : (
              <div className="pt-2 sm:pt-4">
                <ButtonComponent
                  variant="primary"
                  size="lg"
                  onClick={handleEdit}
                  className="w-full sm:w-auto px-6 sm:px-8"
                >
                  Chỉnh sửa
                </ButtonComponent>
              </div>
            )}
          </Form>
        </div>

        {/* Right Column - Profile Picture Upload */}
        <div className="lg:col-span-1 order-1 lg:order-2">
          <div className="flex flex-col items-center lg:items-start">
            <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 mb-3 sm:mb-4 rounded-lg overflow-hidden border-2 border-gray-200 relative">
              {avatarFileList.length > 0 && avatarFileList[0].thumbUrl ? (
                <img
                  src={avatarFileList[0].thumbUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={userData.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <Upload
              fileList={avatarFileList}
              onChange={handleAvatarChange}
              beforeUpload={() => false}
              listType="picture"
              maxCount={1}
              accept="image/*"
            >
              <ButtonComponent
                variant="outline"
                size="md"
                className="w-full sm:w-auto"
              >
                <span className="flex items-center gap-2">
                  <CameraOutlined />
                  Chọn ảnh
                </span>
              </ButtonComponent>
            </Upload>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInformationTab;
