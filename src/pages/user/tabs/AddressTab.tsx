import React, { useState, useEffect } from "react";
import Button from "../../../features/shop/components/Button";
import DropdownList from "../../../features/shop/components/DropdownList";

function PlusIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 4V16M4 10H16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
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
      setAddresses((prev) =>
        prev.map((addr) =>
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
        )
      );
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
        return [...updated, newAddress];
      });
    }
    handleCloseModal();
  };

  const handleInputChange = (field: keyof AddressFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Địa chỉ của tôi
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Quản lý địa chỉ nhận hàng của bạn
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={handleAddNew}
            className="flex items-center gap-2"
          >
            <PlusIcon />
            <span>Thêm địa chỉ mới</span>
          </Button>
        </div>
      </div>

      {/* Address List */}
      <div className="px-4 sm:px-6 py-4 sm:py-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
          Địa chỉ
        </h2>

        <div className="space-y-4">
          {addresses.map((address, index) => (
            <div
              key={address.id}
              className={`${
                index < addresses.length - 1 ? "border-b border-gray-200 pb-4" : ""
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                {/* Address Info */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <span className="font-bold text-gray-900 text-base sm:text-lg">
                      {address.name}
                    </span>
                    <span className="hidden sm:inline text-gray-400">|</span>
                    <span className="text-gray-700 text-sm sm:text-base">
                      {address.phone}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm sm:text-base mb-2">
                    {address.address}
                  </p>
                  {address.isDefault && (
                    <span className="inline-block px-3 py-1 border border-red-500 text-red-600 text-xs sm:text-sm font-medium rounded">
                      Mặc định
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <button
                    onClick={() => handleUpdate(address.id)}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base transition-colors"
                  >
                    Cập nhật
                  </button>
                  {!address.isDefault && (
                    <>
                      <button
                        onClick={() => handleDelete(address.id)}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base transition-colors"
                      >
                        Xoá
                      </button>
                    </>
                  )}
                  {!address.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
                      className="whitespace-nowrap"
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
                <PlusIcon />
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
            className="relative z-50 bg-white rounded-lg shadow-xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto m-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {editingId ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
              </h2>
            </div>

            {/* Form Content */}
            <div className="px-6 py-6 space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Nhập họ và tên của bạn"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none text-sm sm:text-base"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Nhập số điện thoại của bạn"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none text-sm sm:text-base"
                />
              </div>

              {/* Address Section */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Địa chỉ</h3>
                
                <div className="space-y-4">
                  {/* Province/City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tỉnh/Thành Phố
                    </label>
                    <DropdownList
                      options={provinces}
                      value={formData.province}
                      onChange={(value) => handleInputChange("province", value)}
                      placeholder="Chọn Tỉnh/Thành Phố"
                      className="w-full"
                    />
                  </div>

                  {/* District */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quận/Huyện
                    </label>
                    <DropdownList
                      options={districts}
                      value={formData.district}
                      onChange={(value) => handleInputChange("district", value)}
                      placeholder="Chọn Quận/Huyện"
                      className="w-full"
                    />
                  </div>

                  {/* Ward/Commune */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phường/Xã
                    </label>
                    <DropdownList
                      options={wards}
                      value={formData.ward}
                      onChange={(value) => handleInputChange("ward", value)}
                      placeholder="Chọn Phường/Xã"
                      className="w-full"
                    />
                  </div>

                  {/* Detail Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ chi tiết
                    </label>
                    <textarea
                      value={formData.detailAddress}
                      onChange={(e) => handleInputChange("detailAddress", e.target.value)}
                      placeholder="Nhập địa chỉ chi tiết"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none resize-none text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>

              {/* Default Address Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => handleInputChange("isDefault", e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="isDefault"
                  className="text-sm sm:text-base text-gray-700 cursor-pointer"
                >
                  Đặt làm địa chỉ mặc định
                </label>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white">
              <Button
                variant="outline"
                size="md"
                onClick={handleCloseModal}
                className="border-[#ea5b0c] text-[#ea5b0c] hover:bg-[#ea5b0c] hover:text-white"
              >
                Trở Lại
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleSave}
                className="px-6"
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
