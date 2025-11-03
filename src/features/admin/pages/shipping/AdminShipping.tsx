// src/pages/admin/AdminShipping.tsx
import React, { useState } from "react";
import TabMenuAccount, { type TabItem } from "@/components/ui/tab-menu-account";
import CaretDown from "@/components/ui/caret-down";
import AddressForm from "@/components/ui/address-form";
import { Button } from "@/components/ui/button";
import Icon from "@/components/icons/Icon";

interface AddressFormData {
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  detailAddress: string;
  isDefault: boolean;
}

interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  isExpanded: boolean;
}

const AdminShipping: React.FC = () => {
  const [activeTab, setActiveTab] = useState("address");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const tabs: TabItem[] = [
    { id: "address", label: "Địa chỉ" },
    { id: "shipping", label: "Đơn vị vận chuyển" },
  ];

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      name: "Nguyễn Thị Thanh",
      phone: "(+84)123456789",
      address: "Số 70 Đinh Tiên Hoàng, Hoàn Kiếm, Hà Nội",
      isDefault: true,
    },
    {
      id: "2",
      name: "Nguyễn Thị Thanh",
      phone: "(+84) 423294892",
      address: "17 ngõ 120 Bà Triệu, Hoàn Kiếm, Hà Nội",
      isDefault: false,
    },
  ]);

  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([
    {
      id: "fast",
      name: "Nhanh",
      description:
        "Phương thức vận chuyển chuyên nghiệp, nhanh chóng và đáng tin cậy",
      isEnabled: true,
      isExpanded: false,
    },
    {
      id: "economy",
      name: "Tiết kiệm",
      description: "Phương thức vận chuyển mức phí cạnh tranh nhất",
      isEnabled: false,
      isExpanded: true,
    },
  ]);

  const handleSetDefault = (addressId: string) => {
    // FE-only: update state so the selected address becomes default
    setAddresses((prev) => {
      const updated = prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === addressId,
      }));
      // Move the default address to the top of the list
      updated.sort((a, b) => (a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1));
      return updated;
    });
  };

  const handleUpdate = (addressId: string) => {
    const address = addresses.find((addr) => addr.id === addressId);
    if (address) {
      setEditingAddress(address);
      setShowAddressForm(true);
    }
  };

  const handleDelete = (addressId: string) => {
    // Handle delete address
    console.log("Delete address:", addressId);
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setShowAddressForm(true);
  };

  const handleAddressFormSubmit = (formData: AddressFormData) => {
    if (editingAddress) {
      // Update existing address
      console.log("Update address:", editingAddress.id, formData);
    } else {
      // Add new address
      console.log("Add new address:", formData);
    }
    setShowAddressForm(false);
    setEditingAddress(null);
  };

  const handleAddressFormCancel = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
  };

  const handleToggleShipping = (methodId: string) => {
    setShippingMethods((prev) =>
      prev.map((method) =>
        method.id === methodId
          ? { ...method, isEnabled: !method.isEnabled }
          : method
      )
    );
  };

  const handleToggleExpand = (methodId: string) => {
    setShippingMethods((prev) =>
      prev.map((method) =>
        method.id === methodId
          ? { ...method, isExpanded: !method.isExpanded }
          : method
      )
    );
  };

  return (
    <div className="flex flex-col gap-[5px] items-start w-full max-w-[930px] mx-auto px-[16px] sm:px-[24px] lg:px-0">
      {/* Page Title */}
      <div className="w-full mb-[5px]">
        <h1 className="text-[24px] font-bold text-[#272424] font-montserrat leading-[100%]">
          Vận chuyển
        </h1>
      </div>

      {/* Tab Menu */}
      <TabMenuAccount
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="w-full"
      />

      {/* Content based on active tab wrapped in an outer card */}
      <div className="bg-white border border-[#d1d1d1] rounded-[24px] w-full overflow-x-auto">
        <div className="min-w-[643px] p-[24px]">
          {activeTab === "address" ? (
          /* Address Cards */
          <div className="flex flex-col gap-[10px] items-start w-full">
            {/* Header only for Address tab */}
            <div className="w-full mb-[8px] flex items-start justify-between gap-[12px]">
              <div className="flex flex-col gap-[6px]">
                <h1 className="text-[18px] font-bold text-[#272424] font-montserrat leading-[100%]">
                  Địa chỉ của tôi
                </h1>
                <p className="text-[14px] text-[#272424]">
                  Quản lý địa chỉ giao hàng và vận chuyển của bạn
                </p>
              </div>
              <Button onClick={handleAddNewAddress} className="h-[36px] flex-shrink-0 whitespace-nowrap">
                <Icon name="plus" size={14} color="#ffffff" strokeWidth={3} />
                <span>Thêm địa chỉ mới</span>
              </Button>
            </div>
            <div className="bg-white border border-[#d1d1d1] flex flex-col items-start rounded-[24px] w-full">
              {addresses.map((address, index) => (
                <div
                  key={address.id}
                  className={`flex flex-col gap-[12px] items-start p-[24px] w-full ${
                    index === 0 ? "border-b border-[#d1d1d1]" : ""
                  }`}
                >
                  {/* Row 1: Name/Phone on left, actions on right */}
                  <div className="flex items-center justify-between w-full">
                    <div className="flex gap-[2px] items-center text-[14px]">
                      <span className="font-semibold text-[#272424] leading-[1.4] whitespace-nowrap">
                        {address.name}
                      </span>
                      <span className="font-normal text-black leading-[1.4]">
                        |
                      </span>
                      <span className="font-normal text-[#272424] leading-[1.4] whitespace-nowrap">
                        {address.phone}
                      </span>
                    </div>
                    <div className="flex gap-[24px] items-center">
                      {address.isDefault ? (
                        <button
                          onClick={() => handleUpdate(address.id)}
                          className="font-semibold text-[#1a71f6] text-[14px] leading-[1.4] cursor-pointer"
                        >
                          Cập nhật
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleDelete(address.id)}
                            className="font-semibold text-[#1a71f6] text-[14px] leading-[1.4] cursor-pointer"
                          >
                            Xóa
                          </button>
                          <button
                            onClick={() => handleUpdate(address.id)}
                            className="font-semibold text-[#1a71f6] text-[14px] leading-[1.4] cursor-pointer"
                          >
                            Cập nhật
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Address on left, default button on right */}
                  <div className="flex items-center justify-between w-full">
                    <span className="font-normal text-[#272424] text-[14px] leading-[1.4]">
                      {address.address}
                    </span>
                    {address.isDefault ? (
                      <button
                        disabled
                        className="bg-white border border-[#e04d30] flex gap-[4px] items-center px-[12px] py-[6px] rounded-[10px] opacity-40 cursor-not-allowed flex-shrink-0 whitespace-nowrap"
                      >
                        <span className="font-medium text-[#e04d30] text-[14px] leading-[1.4]">
                          Thiết lập địa chỉ mặc định
                        </span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSetDefault(address.id)}
                        className="bg-white border border-[#e04d30] flex gap-[4px] items-center px-[12px] py-[6px] rounded-[10px] flex-shrink-0 whitespace-nowrap"
                      >
                        <span className="font-medium text-[#e04d30] text-[14px] leading-[1.4]">
                          Thiết lập địa chỉ mặc định
                        </span>
                      </button>
                    )}
                  </div>

                  {/* Default address chip */}
                  {address.isDefault && (
                    <div className="bg-[#b2ffb4] flex gap-[10px] items-center h-[24px] px-[8px] rounded-[12px]">
                      <span className="font-semibold text-[#04910c] text-[12px] leading-[1.2]">
                        Địa chỉ mặc định
                      </span>
                    </div>
                  )}

                  {/* No separate bottom actions */}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Shipping Methods */
          <div className="flex flex-col gap-[10px] items-start w-full">
            {shippingMethods.map((method) => (
              <div key={method.id} className="w-full">
                {/* Method Header */}
                <div className="flex items-center justify-between w-full mb-[10px]">
                  <div className="flex flex-col gap-[5px] items-start">
                    <div className="font-bold text-[14px] text-[#1a1a1b] leading-normal">
                      {method.name}
                    </div>
                    <div className="font-normal text-[12px] text-black leading-[1.5]">
                      {method.description}
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleExpand(method.id)}
                    className="bg-white border border-[#e04d30] flex gap-[6px] items-center pl-[12px] pr-[8px] py-[8px] rounded-[12px] flex-shrink-0 whitespace-nowrap"
                  >
                    <span className="font-bold text-[#e04d30] text-[12px] leading-[1.5]">
                      {method.isExpanded ? "Thu gọn" : "Mở rộng"}
                    </span>
                    <div className={`${method.isExpanded ? "rotate-180" : ""}`}>
                      <CaretDown className="text-[#e04d30]" />
                    </div>
                  </button>
                </div>

                {/* Expanded Content */}
                {method.isExpanded && (
                  <div className="bg-white border-2 border-[#e7e7e7] flex items-center justify-between px-[20px] py-[12px] rounded-[12px] w-full">
                    <div className="font-semibold text-[14px] text-[#1a1a1b] leading-[1.4] pl-[8px]">
                      {method.name}
                    </div>
                    <div className="relative w-[50px] h-[26px] flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={method.isEnabled}
                        onChange={() => handleToggleShipping(method.id)}
                        className="w-full h-full opacity-0 absolute cursor-pointer z-10"
                      />
                      <div
                        className={`w-full h-full rounded-full transition-colors duration-200 ${
                          method.isEnabled ? "bg-[#e04d30]" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`absolute top-[2px] w-[22px] h-[22px] bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                            method.isEnabled
                              ? "translate-x-[24px]"
                              : "translate-x-[2px]"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        </div>
      </div>

      {/* Address Form Modal */}
      {showAddressForm && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 px-[16px] sm:px-4">
          <div className="relative w-full max-w-[530px] mx-auto">
            <AddressForm
              title={editingAddress ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
              initialData={
                editingAddress
                  ? {
                      fullName: editingAddress.name,
                      phone: editingAddress.phone,
                      detailAddress: editingAddress.address,
                      isDefault: editingAddress.isDefault,
                    }
                  : undefined
              }
              onSubmit={handleAddressFormSubmit}
              onCancel={handleAddressFormCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminShipping;
