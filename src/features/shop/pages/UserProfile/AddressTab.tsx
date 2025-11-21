import React, { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import Button from "../../../../components/shop/Button";
import { Select } from "antd";
import { Input, Textarea } from "../../../../components/shop/Input";
import Checkbox from "../../../../components/shop/Checkbox";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getUserAddresses,
  addAddress as addAddressApi,
  updateAddress as updateAddressApi,
  deleteAddress as deleteAddressApi,
  setDefaultAddress as setDefaultAddressApi,
} from "../../../../api/endpoints/userApi";
import {
  getProvinces,
  getDistrictsByPath,
  getWardsByPath,
} from "../../../../api/endpoints/shippingApi";
import type {
  AddressDetailResponse,
  AddressCreationRequest,
  AddressUpdateRequest,
} from "../../../../types";

type AddressViewModel = {
  id: string;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
  raw: AddressDetailResponse;
};

type AddressFormData = {
  name: string;
  phone: string;
  province: string;
  provinceId?: number;
  district: string;
  districtId?: number;
  ward: string;
  wardCode?: string;
  detailAddress: string;
  isDefault: boolean;
};

type AddressFormErrors = {
  name?: string;
  phone?: string;
  province?: string;
  district?: string;
  ward?: string;
  detailAddress?: string;
};

const toBooleanDefault = (value: AddressDetailResponse["isDefault"]) => {
  if (typeof value === "boolean") return value;
  if (!value) return false;
  const normalized = value.toString().toLowerCase();
  if (normalized.includes("không") || normalized.includes("khong")) {
    return false;
  }
  return normalized.includes("mặc định") || normalized.includes("mac dinh");
};

const formatAddress = (address: AddressDetailResponse) =>
  [address.location, address.ward, address.district, address.province]
    .filter(Boolean)
    .join(", ");

const AddressTab: React.FC = () => {
  const queryClient = useQueryClient();
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
  const [formErrors, setFormErrors] = useState<AddressFormErrors>({});
  const [currentAddressId, setCurrentAddressId] = useState<number | null>(null);
  const [pendingDefaultId, setPendingDefaultId] = useState<number | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const {
    data: addressesData,
    isLoading: isLoadingAddresses,
    isError: isAddressError,
    refetch: refetchAddresses,
  } = useQuery({
    queryKey: ["user-addresses"],
    queryFn: getUserAddresses,
  });

  const addresses: AddressViewModel[] = useMemo(() => {
    const list = Array.isArray(addressesData?.addresses) ? addressesData!.addresses! : [];
    return list
      .map((address) => ({
        id: address.id?.toString() ?? crypto.randomUUID(),
        name: address.name,
        phone: address.phone,
        address: formatAddress(address),
        isDefault: toBooleanDefault(address.isDefault),
        raw: address,
      }))
      .sort((a, b) => (a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1));
  }, [addressesData]);

  const invalidateAddresses = () =>
    queryClient.invalidateQueries({ queryKey: ["user-addresses"] });

  const addAddressMutation = useMutation({
    mutationFn: addAddressApi,
    onSuccess: async () => {
      invalidateAddresses();
      await refetchAddresses();
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: updateAddressApi,
    onSuccess: async () => {
      invalidateAddresses();
      await refetchAddresses();
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: deleteAddressApi,
    onSuccess: async () => {
      invalidateAddresses();
      await refetchAddresses();
    },
  });

  const setDefaultAddressMutation = useMutation({
    mutationFn: setDefaultAddressApi,
    onSuccess: async () => {
      invalidateAddresses();
      await refetchAddresses();
    },
  });

  const {
    data: provincesData,
    isLoading: isLoadingProvinces,
    isError: isProvinceError,
  } = useQuery({
    queryKey: ["shipping-provinces"],
    queryFn: getProvinces,
  });

  const provinces = useMemo(() => {
    if (!Array.isArray(provincesData)) return [];
    return [...provincesData].sort((a, b) =>
      (a.provinceName || "").localeCompare(b.provinceName || "", "vi", {
        sensitivity: "base",
      })
    );
  }, [provincesData]);

  const {
    data: districtsData,
    isLoading: isLoadingDistricts,
    isError: isDistrictError,
  } = useQuery({
    queryKey: ["shipping-districts", formData.provinceId],
    queryFn: async () => {
      if (!formData.provinceId) return [];
      return getDistrictsByPath(formData.provinceId);
    },
    enabled: Boolean(formData.provinceId),
  });

  const districts = useMemo(() => {
    if (!Array.isArray(districtsData)) return [];
    return [...districtsData].sort((a, b) =>
      (a.districtName || "").localeCompare(b.districtName || "", "vi", {
        sensitivity: "base",
      })
    );
  }, [districtsData]);

  const {
    data: wardsData,
    isLoading: isLoadingWards,
    isError: isWardError,
  } = useQuery({
    queryKey: ["shipping-wards", formData.districtId],
    queryFn: async () => {
      if (!formData.districtId) return [];
      return getWardsByPath(formData.districtId);
    },
    enabled: Boolean(formData.districtId),
  });

  const wards = useMemo(() => {
    if (!Array.isArray(wardsData)) return [];
    return [...wardsData].sort((a, b) =>
      (a.wardName || "").localeCompare(b.wardName || "", "vi", {
        sensitivity: "base",
      })
    );
  }, [wardsData]);

  useEffect(() => {
    if (editingId) {
      const address = addresses.find((addr) => addr.id === editingId);
      if (address) {
        setFormData({
          name: address.raw.name,
          phone: address.raw.phone,
          province: address.raw.province,
          district: address.raw.district,
          ward: address.raw.ward,
          detailAddress: address.raw.location,
          isDefault: address.isDefault,
          provinceId: undefined,
          districtId: address.raw.districtId,
          wardCode: address.raw.wardCode,
        });
        setCurrentAddressId(address.raw.id ?? null);
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
        provinceId: undefined,
        districtId: undefined,
        wardCode: undefined,
      });
      setCurrentAddressId(null);
    }
  }, [editingId, isAddingNew, addresses]);

  useEffect(() => {
    if (provinces.length > 0 && formData.province && !formData.provinceId) {
      const matched = provinces.find(
        (province) => province.provinceName === formData.province
      );
      if (matched) {
        setFormData((prev) => ({ ...prev, provinceId: matched.provinceId }));
      }
    }
  }, [provinces, formData.province, formData.provinceId]);

  useEffect(() => {
    if (districts.length > 0 && formData.district && !formData.districtId) {
      const matched = districts.find(
        (district) => district.districtName === formData.district
      );
      if (matched) {
        setFormData((prev) => ({ ...prev, districtId: matched.districtId }));
      }
    }
  }, [districts, formData.district, formData.districtId]);

  useEffect(() => {
    if (wards.length > 0 && formData.ward && !formData.wardCode) {
      const matched = wards.find((ward) => ward.wardName === formData.ward);
      if (matched) {
        setFormData((prev) => ({ ...prev, wardCode: matched.wardCode }));
      }
    }
  }, [wards, formData.ward, formData.wardCode]);

  const handleInputChange = (
    field: keyof AddressFormData,
    value: string | boolean | number | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field as keyof AddressFormErrors]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field as keyof AddressFormErrors];
        return next;
      });
    }
  };

  const handleProvinceChange = (provinceId: number) => {
    const province = provinces.find((p) => p.provinceId === provinceId);
    setFormData((prev) => ({
      ...prev,
      province: province?.provinceName ?? "",
      provinceId,
      district: "",
      districtId: undefined,
      ward: "",
      wardCode: undefined,
    }));
  };

  const handleDistrictChange = (districtId: number) => {
    const district = districts.find((d) => d.districtId === districtId);
    setFormData((prev) => ({
      ...prev,
      district: district?.districtName ?? "",
      districtId,
      ward: "",
      wardCode: undefined,
    }));
  };

  const handleWardChange = (wardCode: string) => {
    const ward = wards.find((w) => w.wardCode === wardCode);
    setFormData((prev) => ({
      ...prev,
      ward: ward?.wardName ?? "",
      wardCode,
    }));
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingId(null);
  };

  const handleUpdate = (id: string) => {
    setEditingId(id);
    setIsAddingNew(false);
  };

  const handleCloseModal = () => {
    setEditingId(null);
    setIsAddingNew(false);
    setCurrentAddressId(null);
    setFormData({
      name: "",
      phone: "",
      province: "",
      district: "",
      ward: "",
      detailAddress: "",
      isDefault: false,
      provinceId: undefined,
      districtId: undefined,
      wardCode: undefined,
    });
  };

  const ensureFormValid = () => {
    const errors: AddressFormErrors = {};
    if (!formData.name.trim()) {
      errors.name = "Vui lòng nhập họ và tên";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Họ và tên phải có ít nhất 2 ký tự";
    }
    const phone = formData.phone.trim();
    if (!phone) {
      errors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^\d{9,11}$/.test(phone)) {
      errors.phone = "Số điện thoại chỉ gồm 9-11 chữ số";
    }
    if (!formData.provinceId) {
      errors.province = "Vui lòng chọn tỉnh/thành phố";
    }
    if (!formData.districtId) {
      errors.district = "Vui lòng chọn quận/huyện";
    }
    if (!formData.wardCode) {
      errors.ward = "Vui lòng chọn phường/xã";
    }
    if (!formData.detailAddress.trim()) {
      errors.detailAddress = "Vui lòng nhập địa chỉ chi tiết";
    } else if (formData.detailAddress.trim().length < 5) {
      errors.detailAddress = "Địa chỉ chi tiết phải có ít nhất 5 ký tự";
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return "invalid";
    }
    return null;
  };

  const buildPayload = (): AddressCreationRequest => ({
    name: formData.name.trim(),
    phone: formData.phone.trim(),
    province: formData.province,
    district: formData.district,
    ward: formData.ward,
    location: formData.detailAddress.trim(),
    wardCode: formData.wardCode ?? "",
    districtId: formData.districtId ?? 0,
  });

  const handleSave = async () => {
    const error = ensureFormValid();
    if (error) {
      return;
    }

    try {
      if (editingId && currentAddressId) {
        const payload: AddressUpdateRequest = {
          ...buildPayload(),
          id: currentAddressId,
        };
        await updateAddressMutation.mutateAsync(payload);
        if (formData.isDefault) {
          await setDefaultAddressMutation.mutateAsync(currentAddressId);
        }
      } else {
        const response = await addAddressMutation.mutateAsync(buildPayload());
        const newAddressId = response.data;
        if (formData.isDefault && newAddressId) {
          await setDefaultAddressMutation.mutateAsync(newAddressId);
        }
      }
      await refetchAddresses();
      handleCloseModal();
    } catch (err) {
      console.error("Failed to save address", err);
      window.alert("Không thể lưu địa chỉ. Vui lòng thử lại.");
    }
  };

  const handleDelete = async (id: string) => {
    const numericId = Number(id);
    if (!numericId) return;
    setPendingDeleteId(numericId);
    try {
      await deleteAddressMutation.mutateAsync(numericId);
    } catch (err) {
      console.error("Failed to delete address", err);
      window.alert("Không thể xoá địa chỉ. Vui lòng thử lại.");
    } finally {
      setPendingDeleteId(null);
    }
  };

  const handleSetDefault = async (id: string) => {
    const numericId = Number(id);
    if (!numericId) return;
    setPendingDefaultId(numericId);
    try {
      await setDefaultAddressMutation.mutateAsync(numericId);
    } catch (err) {
      console.error("Failed to set default address", err);
      window.alert("Không thể đặt làm mặc định. Vui lòng thử lại.");
    } finally {
      setPendingDefaultId(null);
    }
  };

  const isSaving = addAddressMutation.isPending || updateAddressMutation.isPending;

  return (
    <div className="bg-white rounded-lg border border-gray-200 min-h-[507px]">
      <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-[13px] border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-[18px] font-bold text-gray-900 mb-0">Địa chỉ của tôi</h1>
            <p className="text-[14px] text-gray-600">Quản lý địa chỉ nhận hàng của bạn</p>
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

      <div className="px-4 sm:px-6 py-4 sm:py-6">
        {isLoadingAddresses ? (
          <p className="text-center text-gray-500 py-8">Đang tải địa chỉ...</p>
        ) : isAddressError ? (
          <p className="text-center text-red-500 py-8">
            Không thể tải danh sách địa chỉ. Vui lòng thử lại.
          </p>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="border border-gray-200 rounded-2xl px-4 sm:px-6 py-4 sm:py-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
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
                    <p className="text-gray-700 text-[14px] mb-2">{address.address}</p>
                    {address.isDefault && (
                      <div className="bg-[#b2ffb4] inline-flex items-center h-[24px] px-[8px] rounded-[12px] w-fit">
                        <span className="font-semibold text-[#04910c] text-[12px] leading-[1.2]">
                          Địa chỉ mặc định
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-start sm:items-end gap-2 sm:text-right self-stretch">
                    <div className="flex flex-row items-center gap-4 w-full justify-start sm:justify-end">
                      {!address.isDefault && (
                        <button
                          onClick={() => handleDelete(address.id)}
                          className="text-blue-600 hover:text-blue-700 font-medium text-[14px] transition-colors"
                          disabled={pendingDeleteId === Number(address.id)}
                        >
                          {pendingDeleteId === Number(address.id) ? "Đang xoá..." : "Xoá"}
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
                        disabled={pendingDefaultId === Number(address.id)}
                        className="whitespace-nowrap rounded-md !bg-white !border-[#E04D30] !text-[#E04D30] hover:!bg-white hover:!text-[#E04D30] px-4 py-2 mt-1 self-start sm:self-end"
                      >
                        {pendingDefaultId === Number(address.id)
                          ? "Đang thiết lập..."
                          : "Thiết lập mặc định"}
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
        )}
      </div>

      {(editingId !== null || isAddingNew) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={handleCloseModal}
          />
          <div
            className="relative z-50 bg-white rounded-lg shadow-xl w-full max-w-[520px] max-h-[90vh] overflow-y-auto m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {editingId ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
              </h2>
            </div>

            <div className="px-6 py-4 space-y-3">
              <Input
                label="Họ và tên"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Nhập họ và tên của bạn"
                className={`hover:!border-[#E04D30] focus:!border-[#E04D30] focus:!ring-[#E04D30] ${
                  formErrors.name ? "!border-red-500" : ""
                }`}
              />
              {formErrors.name && (
                <p className="text-red-500 text-sm -mt-2">{formErrors.name}</p>
              )}

              <Input
                label="Số điện thoại"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Nhập số điện thoại của bạn"
                className={`hover:!border-[#E04D30] focus:!border-[#E04D30] focus:!ring-[#E04D30] ${
                  formErrors.phone ? "!border-red-500" : ""
                }`}
              />
              {formErrors.phone && (
                <p className="text-red-500 text-sm -mt-2">{formErrors.phone}</p>
              )}

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Địa chỉ</h3>

                <div className="space-y-2">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-[2px]">
                      Tỉnh/Thành Phố
                    </label>
                    <Select
                      value={formData.provinceId}
                      onChange={handleProvinceChange}
                      placeholder={
                        isProvinceError
                          ? "Không thể tải tỉnh/thành"
                          : isLoadingProvinces
                          ? "Đang tải..."
                          : "Chọn Tỉnh/Thành Phố"
                      }
                      loading={isLoadingProvinces}
                      className={`w-full [&_.ant-select-selector:hover]:!border-[#E04D30] [&.ant-select-focused_.ant-select-selector]:!border-[#E04D30] ${
                        formErrors.province ? "!border-red-500 [&_.ant-select-selector]:!border-red-500" : ""
                      }`}
                      options={provinces.map((province) => ({
                        label: province.provinceName,
                        value: province.provinceId,
                      }))}
                    />
                    {formErrors.province && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.province}</p>
                    )}
                  </div>

                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-[2px]">
                      Quận/Huyện
                    </label>
                    <Select
                      value={formData.districtId}
                      onChange={handleDistrictChange}
                      placeholder={
                        !formData.provinceId
                          ? "Chọn tỉnh/thành trước"
                          : isDistrictError
                          ? "Không thể tải quận/huyện"
                          : isLoadingDistricts
                          ? "Đang tải..."
                          : "Chọn Quận/Huyện"
                      }
                      disabled={!formData.provinceId}
                      loading={isLoadingDistricts}
                      className={`w-full [&_.ant-select-selector:hover]:!border-[#E04D30] [&.ant-select-focused_.ant-select-selector]:!border-[#E04D30] ${
                        formErrors.district ? "!border-red-500 [&_.ant-select-selector]:!border-red-500" : ""
                      }`}
                      options={districts.map((district) => ({
                        label: district.districtName,
                        value: district.districtId,
                      }))}
                    />
                    {formErrors.district && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.district}</p>
                    )}
                  </div>

                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-[2px]">
                      Phường/Xã
                    </label>
                    <Select
                      value={formData.wardCode}
                      onChange={handleWardChange}
                      placeholder={
                        !formData.districtId
                          ? "Chọn quận/huyện trước"
                          : isWardError
                          ? "Không thể tải phường/xã"
                          : isLoadingWards
                          ? "Đang tải..."
                          : "Chọn Phường/Xã"
                      }
                      disabled={!formData.districtId}
                      loading={isLoadingWards}
                      className={`w-full [&_.ant-select-selector:hover]:!border-[#E04D30] [&.ant-select-focused_.ant-select-selector]:!border-[#E04D30] ${
                        formErrors.ward ? "!border-red-500 [&_.ant-select-selector]:!border-red-500" : ""
                      }`}
                      options={wards.map((ward) => ({
                        label: ward.wardName,
                        value: ward.wardCode,
                      }))}
                    />
                    {formErrors.ward && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.ward}</p>
                    )}
                  </div>

                  <Textarea
                    label="Địa chỉ chi tiết"
                    value={formData.detailAddress}
                    onChange={(e) => handleInputChange("detailAddress", e.target.value)}
                    placeholder="Nhập địa chỉ chi tiết"
                    rows={3}
                    className={`hover:!border-[#E04D30] focus:!border-[#E04D30] focus:!ring-[#E04D30] ${
                      formErrors.detailAddress ? "!border-red-500" : ""
                    }`}
                  />
                  {formErrors.detailAddress && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.detailAddress}</p>
                  )}
                </div>
              </div>

              <Checkbox
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) => handleInputChange("isDefault", e.target.checked)}
                label="Đặt làm địa chỉ mặc định"
              />
            </div>

            <div className="px-6 py-4 flex justify-end gap-3 sticky bottom-0 bg-white">
              <Button
                variant="outline"
                size="md"
                onClick={handleCloseModal}
                className="!bg-white !border-[#E04D30] !text-[#E04D30] hover:!bg-white hover:!text-[#E04D30]"
                disabled={isSaving}
              >
                Trở Lại
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 !bg-[#E04D30] !border-[#E04D30] hover:!bg-[#c93d24] hover:!border-[#c93d24]"
              >
                {isSaving ? "Đang lưu..." : "Lưu"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressTab;
