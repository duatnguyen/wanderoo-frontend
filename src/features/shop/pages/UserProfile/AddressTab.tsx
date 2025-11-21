import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Button from "../../../../components/shop/Button";
import { Select } from "antd";
import { Input, Textarea } from "../../../../components/shop/Input";
import Checkbox from "../../../../components/shop/Checkbox";

type Address = {
  id: string;
  name: string;
  phone: string;
  address: string;
  province?: string;
  district?: string;
  ward?: string;
  detailAddress?: string;
  isDefault: boolean;
};

type AddressFormData = {
  name: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  detailAddress: string;
  isDefault: boolean;
};

const AddressTab: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      name: "Nguyễn Thị Thanh",
      phone: "(+84) 363875603",
      address: "Số 79 Đinh Tiên Hoàng, Hoàn Kiếm, Hà Nội",
      province: "Hà Nội",
      district: "Hoàn Kiếm",
      ward: "Đinh Tiên Hoàng",
      detailAddress: "Số 79 Đinh Tiên Hoàng, Hoàn Kiếm, Hà Nội",
      isDefault: true,
    },
    {
      id: "2",
      name: "Hoàng Văn Dụ",
      phone: "(+84) 913875603",
      address:
        "Đường Đắp Mỹ Tạp Hóa Cô Hoa Đối Diện Có Đường Bê Tông Chay Hết Đường Bê Tông Quẹo Trái Nhà Nằm Bên Phải Thị Trấn An Phú, Huyện An Phú, An Giang",
      isDefault: false,
    },
  ]);

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<AddressFormData>({
    name: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    detailAddress: "",
    isDefault: false,
  });

  // Sample dropdown options
  const provinces = [
    { label: "Hà Nội", value: "ha-noi" },
    { label: "TP. Hồ Chí Minh", value: "ho-chi-minh" },
    { label: "Đà Nẵng", value: "da-nang" },
    { label: "Hải Phòng", value: "hai-phong" },
    { label: "An Giang", value: "an-giang" },
  ];

  const districts = [
    { label: "Hoàn Kiếm", value: "hoan-kiem" },
    { label: "Ba Đình", value: "ba-dinh" },
    { label: "Đống Đa", value: "dong-da" },
    { label: "Hai Bà Trưng", value: "hai-ba-trung" },
  ];

  const wards = [
    { label: "Đinh Tiên Hoàng", value: "dinh-tien-hoang" },
    { label: "Phúc Xá", value: "phuc-xa" },
    { label: "Trúc Bạch", value: "truc-bach" },
    { label: "Vĩnh Phú", value: "vinh-phu" },
  ];

  useEffect(() => {
    if (editingId) {
      const address = addresses.find((a) => a.id === editingId);
      if (address) {
        setFormData({
          name: address.name,
          phone: address.phone.replace(/[()]/g, "").replace("+84 ", ""),
          province: address.province || "ha-noi",
          district: address.district || "hoan-kiem",
          ward: address.ward || "dinh-tien-hoang",
          detailAddress: address.detailAddress || address.address,
          isDefault: address.isDefault,
        });
      }
    } else if (isAddingNew) {
      setFormData({
        name: "",
        phone: "",
        province: "",
        district: "",
        ward: "",
        detailAddress: "",
        isDefault: false,
      });
    }
  }, [editingId, isAddingNew, addresses]);

  const handleSetDefault = (id: string) => {
    setAddresses((prev) => {
      const updated = prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }));
      // Move the default address to the top
      updated.sort((a, b) =>
        a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1
      );
      return updated;
    });
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  const handleUpdate = (id: string) => {
    setEditingId(id);
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
  };

  const handleCloseModal = () => {
    setEditingId(null);
    setIsAddingNew(false);
    setFormData({
      name: "",
      phone: "",
      province: "",
      district: "",
      ward: "",
      detailAddress: "",
      isDefault: false,
    });
  };

  const handleSave = () => {
    if (editingId) {
      // Update existing address
      setAddresses((prev) => {
        const mapped = prev.map((addr) =>
          addr.id === editingId
            ? {
                ...addr,
                name: formData.name,
                phone: `(+84) ${formData.phone}`,
                address: `${formData.detailAddress}, ${formData.ward}, ${formData.district}, ${formData.province}`,
                province: formData.province,
                district: formData.district,
                ward: formData.ward,
                detailAddress: formData.detailAddress,
                isDefault: formData.isDefault,
              }
            : formData.isDefault
              ? { ...addr, isDefault: false }
              : addr
        );
        // If this becomes default, ensure it appears first
        mapped.sort((a, b) =>
          a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1
        );
        return mapped;
      });
    } else if (isAddingNew) {
      // Add new address
      const newAddress: Address = {
        id: Date.now().toString(),
        name: formData.name,
        phone: `(+84) ${formData.phone}`,
        address: `${formData.detailAddress}, ${formData.ward}, ${formData.district}, ${formData.province}`,
        province: formData.province,
        district: formData.district,
        ward: formData.ward,
        detailAddress: formData.detailAddress,
        isDefault: formData.isDefault,
      };
      setAddresses((prev) => {
        const updated = formData.isDefault
          ? prev.map((addr) => ({ ...addr, isDefault: false }))
          : prev;
        // If new address is default, place it at the top; otherwise append
        return formData.isDefault
          ? [newAddress, ...updated]
          : [...updated, newAddress];
      });
    }
    handleCloseModal();
  };

  const handleInputChange = (
    field: keyof AddressFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 min-h-[507px]">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-[13px] border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-[18px] font-bold text-gray-900 mb-0">
              Địa chỉ của tôi
            </h1>
            <p className="text-[14px] text-gray-600">
              Quản lý địa chỉ nhận hàng của bạn
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={handleAddNew}
            className="flex items-center gap-2 !bg-[#E04D30] !border-[#E04D30] hover:!bg-[#c93d24] hover:!border-[#c93d24]"
          >
            <Plus size={20} />
            <span>Thêm địa chỉ mới</span>
          </Button>
        </div>
      </div>

      {/* Address List */}
      <div className="px-4 sm:px-6 py-4 sm:py-6">
        {/* Tiêu đề danh mục địa chỉ đã được bỏ theo yêu cầu */}

        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="border border-gray-200 rounded-2xl px-4 sm:px-6 py-4 sm:py-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                {/* Address Info */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <span className="font-bold text-gray-900 text-[18px]">
                      {address.name}
                    </span>
                    <span className="hidden sm:inline text-gray-400">|</span>
                    <span className="text-gray-700 text-[14px]">
                      {address.phone}
                    </span>
                  </div>
                  <p className="text-gray-700 text-[14px] mb-2">
                    {address.address}
                  </p>
                  {address.isDefault && (
                    <div className="bg-[#b2ffb4] inline-flex items-center h-[24px] px-[8px] rounded-[12px] w-fit">
                      <span className="font-semibold text-[#04910c] text-[12px] leading-[1.2]">
                        Địa chỉ mặc định
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col items-start sm:items-end gap-2 sm:text-right self-stretch">
                  <div className="flex flex-row items-center gap-4 w-full justify-start sm:justify-end">
                    {!address.isDefault && (
                      <button
                        onClick={() => handleDelete(address.id)}
                        className="text-blue-600 hover:text-blue-700 font-medium text-[14px] transition-colors"
                      >
                        Xoá
                      </button>
                    )}
                    <button
                      onClick={() => handleUpdate(address.id)}
                      className="text-blue-600 hover:text-blue-700 font-medium text-[14px] transition-colors"
                    >
                      Cập nhật
                    </button>
                  </div>
                  {address.isDefault ? (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      className="whitespace-nowrap rounded-md px-4 py-2 mt-1 self-start sm:self-end cursor-not-allowed !bg-[#f5f5f5] !border-gray-300 !text-gray-400"
                    >
                      Thiết lập mặc định
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
                      className="whitespace-nowrap rounded-md !bg-white !border-[#E04D30] !text-[#E04D30] hover:!bg-white hover:!text-[#E04D30] px-4 py-2 mt-1 self-start sm:self-end"
                    >
                      Thiết lập mặc định
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {addresses.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Bạn chưa có địa chỉ nào.</p>
              <Button
                variant="primary"
                size="md"
                onClick={handleAddNew}
                className="flex items-center gap-2 mx-auto"
              >
                <Plus size={20} />
                <span>Thêm địa chỉ mới</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Update/Add Address Modal */}
      {(editingId !== null || isAddingNew) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Blurred Backdrop - not too dark */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={handleCloseModal}
          />

          {/* Modal Content */}
          <div
            className="relative z-50 bg-white rounded-lg shadow-xl w-full max-w-[520px] max-h-[90vh] overflow-y-auto m-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {editingId ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
              </h2>
            </div>

            {/* Form Content */}
            <div className="px-6 py-4 space-y-3">
              {/* Full Name */}
              <Input
                label="Họ và tên"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Nhập họ và tên của bạn"
                className="hover:!border-[#E04D30] focus:!border-[#E04D30] focus:!ring-[#E04D30]"
              />

              {/* Phone */}
              <Input
                label="Số điện thoại"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Nhập số điện thoại của bạn"
                className="hover:!border-[#E04D30] focus:!border-[#E04D30] focus:!ring-[#E04D30]"
              />

              {/* Address Section */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Địa chỉ
                </h3>

                <div className="space-y-2">
                  {/* Province/City */}
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-[2px]">
                      Tỉnh/Thành Phố
                    </label>
                    <Select
                      value={formData.province}
                      onChange={(value: string) =>
                        handleInputChange("province", value)
                      }
                      placeholder="Chọn Tỉnh/Thành Phố"
                      className="w-full [&_.ant-select-selector:hover]:!border-[#E04D30] [&.ant-select-focused_.ant-select-selector]:!border-[#E04D30]"
                      options={provinces}
                    />
                  </div>

                  {/* District */}
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-[2px]">
                      Quận/Huyện
                    </label>
                    <Select
                      value={formData.district}
                      onChange={(value: string) =>
                        handleInputChange("district", value)
                      }
                      placeholder="Chọn Quận/Huyện"
                      className="w-full [&_.ant-select-selector:hover]:!border-[#E04D30] [&.ant-select-focused_.ant-select-selector]:!border-[#E04D30]"
                      options={districts}
                    />
                  </div>

                  {/* Ward/Commune */}
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-[2px]">
                      Phường/Xã
                    </label>
                    <Select
                      value={formData.ward}
                      onChange={(value: string) =>
                        handleInputChange("ward", value)
                      }
                      placeholder="Chọn Phường/Xã"
                      className="w-full [&_.ant-select-selector:hover]:!border-[#E04D30] [&.ant-select-focused_.ant-select-selector]:!border-[#E04D30]"
                      options={wards}
                    />
                  </div>

                  {/* Detail Address */}
                  <Textarea
                    label="Địa chỉ chi tiết"
                    value={formData.detailAddress}
                    onChange={(e) =>
                      handleInputChange("detailAddress", e.target.value)
                    }
                    placeholder="Nhập địa chỉ chi tiết"
                    rows={3}
                    className="hover:!border-[#E04D30] focus:!border-[#E04D30] focus:!ring-[#E04D30]"
                  />
                </div>
              </div>

              {/* Default Address Checkbox */}
              <Checkbox
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) =>
                  handleInputChange("isDefault", e.target.checked)
                }
                label="Đặt làm địa chỉ mặc định"
              />
            </div>

            {/* Footer Buttons */}
            <div className="px-6 py-4 flex justify-end gap-3 sticky bottom-0 bg-white">
              <Button
                variant="outline"
                size="md"
                onClick={handleCloseModal}
                className="!bg-white !border-[#E04D30] !text-[#E04D30] hover:!bg-white hover:!text-[#E04D30]"
              >
                Trở Lại
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleSave}
                className="px-6 !bg-[#E04D30] !border-[#E04D30] hover:!bg-[#c93d24] hover:!border-[#c93d24]"
              >
                Lưu
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressTab;
