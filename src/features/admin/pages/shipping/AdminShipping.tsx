// src/pages/admin/AdminShipping.tsx
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import TabMenuAccount, { type TabItem } from "@/components/ui/tab-menu-account";
import AddressForm from "@/components/ui/address-form";
import { Button } from "@/components/ui/button";
import Icon from "@/components/icons/Icon";
import {
  PageContainer,
  ContentCard,
} from "@/components/common";
import {
  getAdminAddresses,
  createAdminAddress,
  updateAdminAddress,
  deleteAdminAddress,
  setDefaultAdminAddress,
} from "@/api/endpoints/userApi";
import { toast } from "sonner";
import type { AddressResponse, AddressPageResponse } from "@/types";
import type { AddressCreationRequest, AddressUpdateRequest } from "@/types";

interface AddressFormData {
  fullName: string;
  phone: string;
  province: string;
  provinceId?: number;
  district: string;
  districtId?: number;
  ward: string;
  wardCode?: string;
  detailAddress: string;
  isDefault: boolean;
}

interface Address {
  id: number;
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
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("address");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const tabs: TabItem[] = [
    { id: "address", label: "Địa chỉ" },
    { id: "shipping", label: "Đơn vị vận chuyển" },
  ];

  // Fetch admin addresses
  const {
    data: addressesData,
    isLoading: isLoadingAddresses,
    refetch: refetchAddresses,
  } = useQuery({
    queryKey: ["admin-addresses"],
    queryFn: () => getAdminAddresses(),
  });

  const formatAddressText = (addr: AddressResponse) => {
    if (addr.fullAddress && String(addr.fullAddress).trim().length > 0) {
      return String(addr.fullAddress).trim();
    }
    return [
      addr.street || addr.location || "",
      addr.wardName || addr.ward || "",
      addr.districtName || addr.district || "",
      addr.provinceName || addr.province || "",
    ]
      .map((part) => (part ? String(part).trim() : ""))
      .filter((part) => part)
      .join(", ");
  };

  // Convert API response to local Address format and sort: default address first
  const addresses: Address[] = (addressesData?.addresses?.map((addr: AddressResponse) => ({
    id: addr.id,
    name: addr.receiverName || addr.name || "",
    phone: addr.receiverPhone || addr.phone || "",
    address: formatAddressText(addr),
    isDefault: typeof addr.isDefault === "string" 
      ? addr.isDefault === "Địa chỉ mặc định" || addr.isDefault === "true"
      : addr.isDefault === true,
  })) || []).sort((a, b) => {
    // Sort: default address first
    if (a.isDefault && !b.isDefault) return -1;
    if (!a.isDefault && b.isDefault) return 1;
    return 0;
  });

  const shippingMethods: ShippingMethod[] = [
    {
      id: "fast",
      name: "Giao hàng nhanh",
      description:
        "Phương thức vận chuyển chuyên nghiệp, nhanh chóng và đáng tin cậy",
      isEnabled: true,
      isExpanded: false,
    },
  ];

  // Set default address mutation
  const setDefaultMutation = useMutation({
    mutationFn: (addressId: number) => setDefaultAdminAddress(addressId),
    onMutate: async (addressId: number) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["admin-addresses"] });

      // Snapshot the previous value
      const previousAddresses = queryClient.getQueryData<AddressPageResponse>(["admin-addresses"]);

      // Optimistically update to the new value
      if (previousAddresses) {
        queryClient.setQueryData<AddressPageResponse>(["admin-addresses"], {
          ...previousAddresses,
          addresses: previousAddresses.addresses.map((addr: AddressResponse) => ({
            ...addr,
            isDefault: addr.id === addressId ? "Địa chỉ mặc định" : "Địa chỉ không mặc định",
          })),
        });
      }

      // Return a context object with the snapshotted value
      return { previousAddresses };
    },
    onSuccess: () => {
      toast.success("Đã thiết lập địa chỉ mặc định");
      // Refetch to ensure data is in sync with server
      refetchAddresses();
    },
    onError: (error: any, _addressId: number, context: any) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousAddresses) {
        queryClient.setQueryData(["admin-addresses"], context.previousAddresses);
      }
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể thiết lập địa chỉ mặc định";
      toast.error(errorMessage);
    },
  });

  // Delete address mutation
  const deleteMutation = useMutation({
    mutationFn: (addressId: number) => deleteAdminAddress(addressId),
    onSuccess: () => {
      toast.success("Đã xóa địa chỉ");
      refetchAddresses();
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể xóa địa chỉ";
      toast.error(errorMessage);
    },
  });

  // Create address mutation
  const createMutation = useMutation({
    mutationFn: (addressData: AddressCreationRequest) => createAdminAddress(addressData),
    onSuccess: () => {
      toast.success("Đã thêm địa chỉ mới");
      refetchAddresses();
      setShowAddressForm(false);
      setEditingAddress(null);
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể thêm địa chỉ";
      toast.error(errorMessage);
    },
  });

  // Update address mutation
  const updateMutation = useMutation({
    mutationFn: (addressData: AddressUpdateRequest) => updateAdminAddress(addressData),
    onSuccess: () => {
      toast.success("Đã cập nhật địa chỉ");
      refetchAddresses();
      setShowAddressForm(false);
      setEditingAddress(null);
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể cập nhật địa chỉ";
      toast.error(errorMessage);
    },
  });

  const handleSetDefault = (addressId: number) => {
    setDefaultMutation.mutate(addressId);
  };

  const handleUpdate = (addressId: number) => {
    // Find original address data from API response
    const originalAddress = addressesData?.addresses?.find((addr: AddressResponse) => addr.id === addressId);
    if (originalAddress) {
      setEditingAddress({
        id: originalAddress.id,
        name: originalAddress.receiverName || originalAddress.name || "",
        phone: originalAddress.receiverPhone || originalAddress.phone || "",
        address: formatAddressText(originalAddress),
        isDefault: typeof originalAddress.isDefault === "string" 
          ? originalAddress.isDefault === "Địa chỉ mặc định" || originalAddress.isDefault === "true"
          : originalAddress.isDefault === true,
      });
      setShowAddressForm(true);
    }
  };

  const handleDelete = (addressId: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
      deleteMutation.mutate(addressId);
    }
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setShowAddressForm(true);
  };

  const handleAddressFormSubmit = (formData: AddressFormData) => {
    if (!formData.districtId || !formData.wardCode) {
      toast.error("Vui lòng chọn đầy đủ tỉnh/thành, quận/huyện và phường/xã");
      return;
    }

    const location = formData.detailAddress.trim();
    const ward = formData.ward.trim();
    const district = formData.district.trim();
    const province = formData.province.trim();

    const street = location;
    const wardName = ward;
    const districtName = district;
    const provinceName = province;
    const commonPayload = {
      name: formData.fullName.trim(),
      phone: formData.phone.trim(),
      street,
      wardCode: formData.wardCode,
      wardName,
      districtId: formData.districtId,
      districtName,
      provinceName,
      fullAddress: [street, wardName, districtName, provinceName]
        .filter(Boolean)
        .join(", "),
    };

    if (editingAddress) {
      // Update existing address
      const updateData: AddressUpdateRequest = {
        id: editingAddress.id,
        ...commonPayload,
      };
      updateMutation.mutate(updateData);
    } else {
      // Add new address
      const createData: AddressCreationRequest = {
        ...commonPayload,
      };
      createMutation.mutate(createData);
    }
  };

  const handleAddressFormCancel = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
  };


  return (
    <PageContainer>
      <div className="flex flex-col gap-2 items-center w-full">
        {/* Page Title */}
        <div className="flex items-center justify-between w-full">
          <h1 className="font-bold text-[#272424] text-[24px] leading-normal">
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
        <ContentCard>
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
                <Button
                  onClick={handleAddNewAddress}
                  className="h-[36px] flex-shrink-0 whitespace-nowrap"
                >
                  <Icon name="plus" size={14} color="#ffffff" strokeWidth={3} />
                  <span>Thêm địa chỉ mới</span>
                </Button>
              </div>
              <div className="bg-white border border-[#d1d1d1] flex flex-col items-start rounded-[24px] w-full">
                {isLoadingAddresses ? (
                  <div className="flex items-center justify-center w-full py-8">
                    <p className="text-[#272424] text-[14px]">Đang tải địa chỉ...</p>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="flex items-center justify-center w-full py-8">
                    <p className="text-[#272424] text-[14px]">Chưa có địa chỉ nào</p>
                  </div>
                ) : (
                  addresses.map((address, index) => (
                  <div
                    key={address.id}
                    className={`flex flex-col gap-[12px] items-start p-[24px] w-full ${index < addresses.length - 1 ? "border-b border-[#d1d1d1]" : ""
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
                  ))
                )}
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
                  </div>

                  {/* Expanded Content - Always visible */}
                  <div className="bg-white border-2 border-[#e7e7e7] flex items-center justify-between px-[20px] py-[12px] rounded-[12px] w-full">
                    <div className="font-semibold text-[14px] text-[#1a1a1b] leading-[1.4] pl-[8px]">
                      {method.name}
                    </div>
                    <div className="relative w-[50px] h-[26px] flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={true}
                        disabled
                        className="w-full h-full opacity-0 absolute cursor-not-allowed z-10"
                      />
                      <div className="w-full h-full rounded-full transition-colors duration-200 bg-[#e04d30]">
                        <div className="absolute top-[2px] w-[22px] h-[22px] bg-white rounded-full shadow-md transform transition-transform duration-200 translate-x-[24px]" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ContentCard>

        {/* Address Form Modal */}
        {showAddressForm && (
          <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 px-[16px] sm:px-4">
            <div className="relative w-full max-w-[530px] mx-auto">
              <AddressForm
                title={editingAddress ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
                initialData={
                  editingAddress && addressesData?.addresses
                    ? (() => {
                        const originalAddress = addressesData.addresses.find((addr: AddressResponse) => addr.id === editingAddress.id);
                        return originalAddress
                          ? {
                              fullName: originalAddress.receiverName || originalAddress.name || "",
                              phone: originalAddress.receiverPhone || originalAddress.phone || "",
                              province: originalAddress.provinceName || originalAddress.province || "",
                              district: originalAddress.districtName || originalAddress.district || "",
                              ward: originalAddress.wardName || originalAddress.ward || "",
                              detailAddress: originalAddress.street || originalAddress.location || "",
                              districtId: originalAddress.districtId ?? undefined,
                              wardCode: originalAddress.wardCode || "",
                              isDefault: typeof originalAddress.isDefault === "string" 
                                ? originalAddress.isDefault === "Địa chỉ mặc định" || originalAddress.isDefault === "true"
                                : originalAddress.isDefault === true,
                            }
                          : undefined;
                      })()
                    : undefined
                }
                onSubmit={handleAddressFormSubmit}
                onCancel={handleAddressFormCancel}
              />
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default AdminShipping;
