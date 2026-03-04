import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  getUserAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  addAddress
} from "../api/endpoints/userApi";
import type { AddressOption, AddressFormData } from "../types/checkout";
import type { AddressCreationRequest, AddressUpdateRequest } from "../types/auth";
import { mapAddressListToOptions, parseRegion } from "../utils/addressUtils";

export const useAddressManagement = () => {
  const [addresses, setAddresses] = useState<AddressOption[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number>(0);

  const fetchAddresses = useCallback(async () => {
    try {
      const addressResponse = await getUserAddresses();
      const addressList = addressResponse.addresses || [];
      const mappedAddresses = mapAddressListToOptions(addressList);
      setAddresses(mappedAddresses);

      // Set default address if exists
      const defaultAddress = mappedAddresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      } else if (mappedAddresses.length > 0) {
        setSelectedAddressId(mappedAddresses[0].id);
      }

      return mappedAddresses;
    } catch (error: any) {
      console.error("Error fetching addresses:", error);
      toast.error("Không thể tải danh sách địa chỉ");
      return [];
    }
  }, []);

  const refreshAddresses = useCallback(async () => {
    try {
      const addressResponse = await getUserAddresses();
      const addressList = addressResponse.addresses || [];
      const mappedAddresses = mapAddressListToOptions(addressList);
      setAddresses(mappedAddresses);

      // Update selected address if needed
      const defaultAddress = mappedAddresses.find(addr => addr.isDefault);
      if (defaultAddress && !mappedAddresses.find(a => a.id === selectedAddressId)) {
        setSelectedAddressId(defaultAddress.id);
      }

      return mappedAddresses;
    } catch (error: any) {
      console.error("Error refreshing addresses:", error);
      toast.error("Không thể tải lại danh sách địa chỉ");
      return [];
    }
  }, [selectedAddressId]);

  const createAddress = useCallback(async (
    addressFormData: AddressFormData,
    getProvinceName: (id: number) => string,
    getDistrictName: (id: number) => string,
    getWardName: (code: string) => string
  ) => {
    const provinceId = parseInt(addressFormData.province);
    const districtId = parseInt(addressFormData.district);
    const wardCode = addressFormData.ward;

    const provinceName = getProvinceName(provinceId);
    const districtName = getDistrictName(districtId);
    const wardName = getWardName(wardCode);

    const createRequest: AddressCreationRequest = {
      street: addressFormData.detailAddress.trim(),
      wardCode: wardCode,
      wardName: wardName,
      districtId: districtId,
      districtName: districtName,
      provinceName: provinceName,
      fullAddress: `${addressFormData.detailAddress.trim()}, ${wardName}, ${districtName}, ${provinceName}, Vietnam`,
      name: addressFormData.name.trim(),
      phone: addressFormData.phone.trim().replace(/[()]/g, "").replace("+84 ", "").replace(/\s/g, ""),
    };

    const response = await addAddress(createRequest);

    if (addressFormData.isDefault && response.data) {
      await setDefaultAddress(response.data);
    }

    const updatedAddresses = await refreshAddresses();
    
    // Select the new address
    const newAddress = updatedAddresses.find(addr => addr.id === response.data);
    if (newAddress) {
      setSelectedAddressId(newAddress.id);
    }

    return response;
  }, [refreshAddresses]);

  const updateExistingAddress = useCallback(async (
    editingAddress: AddressOption,
    editForm: any,
    setAsDefault: boolean
  ) => {
    const { province, district, ward } = parseRegion(editingAddress.region);

    const updateData: AddressUpdateRequest = {
      id: editingAddress.id,
      name: editForm.name,
      phone: editForm.phone,
      street: editForm.detailAddress,
      wardName: ward,
      districtName: district,
      provinceName: province,
      wardCode: "",
      districtId: 0,
      fullAddress: `${editForm.detailAddress}, ${[ward, district, province].filter(Boolean).join(", ")}`,
    };

    await updateAddress(updateData);

    if (setAsDefault) {
      await setDefaultAddress(editingAddress.id);
    }

    await refreshAddresses();

    if (setAsDefault || editingAddress.id === selectedAddressId) {
      setSelectedAddressId(editingAddress.id);
    }
  }, [selectedAddressId, refreshAddresses]);

  const removeAddress = useCallback(async (addressId: number) => {
    await deleteAddress(addressId);

    if (addressId === selectedAddressId) {
      const remainingAddresses = addresses.filter(a => a.id !== addressId);
      if (remainingAddresses.length > 0) {
        const defaultAddr = remainingAddresses.find(a => a.isDefault) || remainingAddresses[0];
        setSelectedAddressId(defaultAddr.id);
      } else {
        setSelectedAddressId(0);
      }
    }

    await refreshAddresses();
  }, [addresses, selectedAddressId, refreshAddresses]);

  return {
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    fetchAddresses,
    refreshAddresses,
    createAddress,
    updateExistingAddress,
    removeAddress,
  };
};