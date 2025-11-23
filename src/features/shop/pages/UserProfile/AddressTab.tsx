import React, { useState, useEffect } from "react";
import { Plus, X, MapPin, User, Home } from "lucide-react";
import Button from "../../../../components/shop/Button";
import { Select } from "antd";
import { Input, Textarea } from "../../../../components/shop/Input";
import Checkbox from "../../../../components/shop/Checkbox";
import {
  getUserAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getAddressById,
} from "../../../../api/endpoints/userApi";
import {
  getProvinces,
  getDistrictsByPath,
  getWardsByPath,
} from "../../../../api/endpoints/shippingApi";
import type {
  AddressResponse,
  AddressCreationRequest,
  AddressUpdateRequest,
} from "../../../../types";
import type {
  ProvinceResponse,
  DistrictResponse,
  WardResponse,
} from "../../../../types/shipping";
import { message } from "antd";

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
  // API fields
  wardCode?: string;
  districtId?: number;
  provinceName?: string;
  districtName?: string;
  wardName?: string;
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
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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

  // Location data from API
  const [provinces, setProvinces] = useState<
    Array<{ label: string; value: number }>
  >([]);
  const [districts, setDistricts] = useState<
    Array<{ label: string; value: number; provinceId: number }>
  >([]);
  const [wards, setWards] = useState<
    Array<{ label: string; value: string; districtId: number }>
  >([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);

  // Fetch provinces from API
  const fetchProvinces = async () => {
    try {
      setIsLoadingLocations(true);
      const provincesData = await getProvinces();
      const mappedProvinces = provincesData.map((p: ProvinceResponse) => ({
        label: p.provinceName,
        value: p.provinceId,
      }));
      setProvinces(mappedProvinces);
    } catch (error: any) {
      console.error("Error fetching provinces:", error);
      message.error("Không thể tải danh sách tỉnh/thành phố");
    } finally {
      setIsLoadingLocations(false);
    }
  };

  // Fetch districts from API based on province
  const fetchDistricts = async (provinceId: number) => {
    try {
      setIsLoadingLocations(true);
      const districtsData = await getDistrictsByPath(provinceId);
      const mappedDistricts = districtsData.map((d: DistrictResponse) => ({
        label: d.districtName,
        value: d.districtId,
        provinceId: d.provinceId,
      }));
      setDistricts(mappedDistricts);
      // Reset wards when province changes
      setWards([]);
      setFormData((prev) => ({ ...prev, district: "", ward: "" }));
    } catch (error: any) {
      console.error("Error fetching districts:", error);
      message.error("Không thể tải danh sách quận/huyện");
    } finally {
      setIsLoadingLocations(false);
    }
  };

  // Fetch wards from API based on district
  const fetchWards = async (districtId: number) => {
    try {
      setIsLoadingLocations(true);
      const wardsData = await getWardsByPath(districtId);
      const mappedWards = wardsData.map((w: WardResponse) => ({
        label: w.wardName,
        value: w.wardCode,
        districtId: w.districtId,
      }));
      setWards(mappedWards);
      // Reset ward selection when district changes
      setFormData((prev) => ({ ...prev, ward: "" }));
    } catch (error: any) {
      console.error("Error fetching wards:", error);
      message.error("Không thể tải danh sách phường/xã");
    } finally {
      setIsLoadingLocations(false);
    }
  };

  // Helper functions to get name from ID/code
  const getProvinceName = (provinceId: number | string): string => {
    const id = typeof provinceId === "string" ? parseInt(provinceId) : provinceId;
    const province = provinces.find((p) => p.value === id);
    return province ? province.label : "";
  };

  const getDistrictName = (districtId: number | string): string => {
    const id = typeof districtId === "string" ? parseInt(districtId) : districtId;
    const district = districts.find((d) => d.value === id);
    return district ? district.label : "";
  };

  const getWardName = (wardCode: string): string => {
    const ward = wards.find((w) => w.value === wardCode);
    return ward ? ward.label : "";
  };

  // Helper functions to get ID/code from name (for editing)
  const getProvinceIdByName = (name: string): number | null => {
    const province = provinces.find((p) => p.label === name);
    return province ? province.value : null;
  };

  const getDistrictIdByName = (name: string): number | null => {
    const district = districts.find((d) => d.label === name);
    return district ? district.value : null;
  };


  // Fetch addresses from API
  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      const response = await getUserAddresses();
      
      // Handle different response structures
      // getUserAddresses returns AddressPageResponse which has { addresses: AddressResponse[] }
      let addressesList: AddressResponse[] = [];
      if (Array.isArray(response)) {
        addressesList = response;
      } else if (response?.addresses && Array.isArray(response.addresses)) {
        addressesList = response.addresses;
      }
      
      const mappedAddresses: Address[] = addressesList.map(
        (addr: AddressResponse) => {
          // Format phone number - keep original format if already formatted
          let phoneDisplay = addr.receiverPhone || addr.phone || "";
          // If phone doesn't have format, add it
          if (phoneDisplay && !phoneDisplay.includes("+84") && !phoneDisplay.includes("(")) {
            // Format: (+84) 912345678
            const cleanedPhone = phoneDisplay.replace(/\D/g, "");
            if (cleanedPhone.length >= 9) {
              phoneDisplay = `(+84) ${cleanedPhone.slice(-9)}`;
            }
          }
          
          // Build full address string - use fullAddress if available, otherwise build from parts
          let fullAddressString = "";
          if (addr.fullAddress) {
            fullAddressString = addr.fullAddress;
          } else {
            const addressParts = [];
            if (addr.street) addressParts.push(addr.street);
            if (addr.wardName) addressParts.push(addr.wardName);
            if (addr.districtName) addressParts.push(addr.districtName);
            if (addr.provinceName) addressParts.push(addr.provinceName);
            fullAddressString = addressParts.join(", ");
          }
          
          return {
            id: addr.id.toString(),
            name: addr.receiverName || addr.name || "",
            phone: phoneDisplay,
            address: fullAddressString,
            province: addr.provinceName || "",
            district: addr.districtName || "",
            ward: addr.wardName || "",
            detailAddress: addr.street || "",
            isDefault:
              addr.isDefault === true ||
              addr.isDefault === "Địa chỉ mặc định" ||
              addr.isDefault === "true" ||
              String(addr.isDefault).toLowerCase() === "true",
            // API fields
            wardCode: addr.wardCode || "",
            districtId: addr.districtId || 0,
            provinceName: addr.provinceName || "",
            districtName: addr.districtName || "",
            wardName: addr.wardName || "",
          };
        }
      );
      
      // Sort: default addresses first
      mappedAddresses.sort((a, b) =>
        a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1
      );
      
      setAddresses(mappedAddresses);
    } catch (error: any) {
      console.error("Error fetching addresses:", error);
      message.error(
        error?.response?.data?.message || "Không thể tải danh sách địa chỉ"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
    fetchProvinces();
  }, []);

  useEffect(() => {
    const loadAddressForEdit = async () => {
      if (editingId) {
        try {
          const addressId = parseInt(editingId);
          const addressDetail = await getAddressById(addressId);

          // Find province ID from name
          const provinceId = addressDetail.provinceName
            ? getProvinceIdByName(addressDetail.provinceName)
            : null;

          // Load districts if we have province
          if (provinceId) {
            await fetchDistricts(provinceId);

            // Find district ID from name
            const districtId = addressDetail.districtName
              ? getDistrictIdByName(addressDetail.districtName)
              : null;

            // Load wards if we have district
            if (districtId) {
              await fetchWards(districtId);
            }
          }

          setFormData({
            name: addressDetail.receiverName || addressDetail.name || "",
            phone: (addressDetail.receiverPhone || addressDetail.phone || "")
              .replace(/[()]/g, "")
              .replace("+84 ", "")
              .replace(/\s/g, ""),
            province: provinceId ? provinceId.toString() : "",
            district: addressDetail.districtId
              ? addressDetail.districtId.toString()
              : "",
            ward: addressDetail.wardCode || "",
            detailAddress: addressDetail.street || "",
            isDefault:
              addressDetail.isDefault === true ||
              addressDetail.isDefault === "Địa chỉ mặc định" ||
              addressDetail.isDefault === "true",
          });
        } catch (error: any) {
          console.error("Error loading address:", error);
          message.error("Không thể tải thông tin địa chỉ");
          handleCloseModal();
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
        setDistricts([]);
        setWards([]);
      }
    };

    loadAddressForEdit();
  }, [editingId, isAddingNew]);

  const handleSetDefault = async (id: string) => {
    try {
      const addressId = parseInt(id);
      await setDefaultAddress(addressId);
      message.success("Đã đặt làm địa chỉ mặc định");
      await fetchAddresses();
    } catch (error: any) {
      console.error("Error setting default address:", error);
      message.error(
        error?.response?.data?.message || "Không thể đặt địa chỉ mặc định"
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const addressId = parseInt(id);
      await deleteAddress(addressId);
      message.success("Đã xóa địa chỉ");
      await fetchAddresses();
    } catch (error: any) {
      console.error("Error deleting address:", error);
      message.error(error?.response?.data?.message || "Không thể xóa địa chỉ");
    }
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

  const handleSave = async () => {
    // Validate form
    if (!formData.name.trim()) {
      message.error("Vui lòng nhập họ và tên");
      return;
    }
    if (!formData.phone.trim()) {
      message.error("Vui lòng nhập số điện thoại");
      return;
    }
    if (!formData.province || !formData.district || !formData.ward) {
      message.error("Vui lòng chọn đầy đủ Tỉnh/Thành phố, Quận/Huyện, Phường/Xã");
      return;
    }
    if (!formData.detailAddress.trim()) {
      message.error("Vui lòng nhập địa chỉ chi tiết");
      return;
    }

    try {
      setIsLoading(true);

      // Find the address being edited to get API fields
      const editingAddress = editingId
        ? addresses.find((a) => a.id === editingId)
        : null;

      // Get IDs and names from form data
      const provinceId = parseInt(formData.province);
      const districtId = parseInt(formData.district);
      const wardCode = formData.ward;

      const provinceName = getProvinceName(provinceId);
      const districtName = getDistrictName(districtId);
      const wardName = getWardName(wardCode);

      if (editingId && editingAddress) {
        // Update existing address
        const updateRequest: AddressUpdateRequest = {
          id: parseInt(editingId),
          street: formData.detailAddress.trim(),
          wardCode: wardCode,
          wardName: wardName,
          districtId: districtId,
          districtName: districtName,
          provinceName: provinceName,
          fullAddress: `${formData.detailAddress.trim()}, ${wardName}, ${districtName}, ${provinceName}, Vietnam`,
          name: formData.name.trim(),
          phone: formData.phone.trim().replace(/[()]/g, "").replace("+84 ", "").replace(/\s/g, ""),
        };

        await updateAddress(updateRequest);
        message.success("Đã cập nhật địa chỉ");

        // If setting as default, call setDefaultAddress
        if (formData.isDefault) {
          await setDefaultAddress(parseInt(editingId));
        }
      } else if (isAddingNew) {
        // Add new address
        const createRequest: AddressCreationRequest = {
          street: formData.detailAddress.trim(),
          wardCode: wardCode,
          wardName: wardName,
          districtId: districtId,
          districtName: districtName,
          provinceName: provinceName,
          fullAddress: `${formData.detailAddress.trim()}, ${wardName}, ${districtName}, ${provinceName}, Vietnam`,
          name: formData.name.trim(),
          phone: formData.phone.trim().replace(/[()]/g, "").replace("+84 ", "").replace(/\s/g, ""),
        };

        const response = await addAddress(createRequest);
        message.success("Đã thêm địa chỉ mới");

        // If setting as default, call setDefaultAddress
        if (formData.isDefault && response.data) {
          await setDefaultAddress(response.data);
        }
      }

      await fetchAddresses();
      handleCloseModal();
    } catch (error: any) {
      console.error("Error saving address:", error);
      message.error(
        error?.response?.data?.message || "Không thể lưu địa chỉ"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof AddressFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle province change - fetch districts
  const handleProvinceChange = async (provinceId: number) => {
    setFormData((prev) => ({
      ...prev,
      province: provinceId.toString(),
      district: "",
      ward: "",
    }));
    setDistricts([]);
    setWards([]);
    await fetchDistricts(provinceId);
  };

  // Handle district change - fetch wards
  const handleDistrictChange = async (districtId: number) => {
    setFormData((prev) => ({
      ...prev,
      district: districtId.toString(),
      ward: "",
    }));
    setWards([]);
    await fetchWards(districtId);
  };

  // Handle ward change
  const handleWardChange = (wardCode: string) => {
    setFormData((prev) => ({ ...prev, ward: wardCode }));
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

        {isLoading && addresses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Đang tải danh sách địa chỉ...</p>
          </div>
        ) : (
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
        )}
      </div>

      {/* Update/Add Address Modal */}
      {(editingId !== null || isAddingNew) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          {/* Blurred Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={handleCloseModal}
          />

          {/* Modal Content */}
          <div
            className="relative z-50 bg-white rounded-2xl shadow-2xl w-full max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#E04D30]/10 rounded-lg">
                  <MapPin className="w-5 h-5 text-[#E04D30]" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {editingId ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {editingId
                      ? "Chỉnh sửa thông tin địa chỉ của bạn"
                      : "Điền thông tin địa chỉ nhận hàng"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-gray-400 hover:text-gray-600"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Content - Scrollable */}
            <div className="px-6 py-6 space-y-5 overflow-y-auto flex-1">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-[#E04D30]" />
                  <h3 className="text-base font-semibold text-gray-900">
                    Thông tin người nhận
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="sm:col-span-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Nhập họ và tên người nhận"
                        className="hover:!border-[#E04D30] focus:!border-[#E04D30] focus:!ring-[#E04D30] transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="sm:col-span-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="Nhập số điện thoại (ví dụ: 0912345678)"
                        className="hover:!border-[#E04D30] focus:!border-[#E04D30] focus:!ring-[#E04D30] transition-all"
                      />
                      <p className="text-xs text-gray-500 mt-1.5">
                        Số điện thoại để liên hệ khi giao hàng
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-2"></div>

              {/* Address Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <Home className="w-4 h-4 text-[#E04D30]" />
                  <h3 className="text-base font-semibold text-gray-900">
                    Địa chỉ nhận hàng
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* Province/City */}
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span>
                        Tỉnh/Thành Phố <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <Select
                      value={formData.province ? parseInt(formData.province) : undefined}
                      onChange={(value: number) => handleProvinceChange(value)}
                      placeholder="Chọn Tỉnh/Thành Phố"
                      loading={isLoadingLocations}
                      disabled={isLoadingLocations}
                      size="large"
                      className="w-full [&_.ant-select-selector]:!h-11 [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector:hover]:!border-[#E04D30] [&.ant-select-focused_.ant-select-selector]:!border-[#E04D30] [&_.ant-select-selector]:!transition-all"
                      options={provinces.map((p) => ({
                        label: p.label,
                        value: p.value,
                      }))}
                      notFoundContent={
                        isLoadingLocations ? (
                          <div className="py-4 text-center text-gray-500">
                            <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-[#E04D30] border-t-transparent mr-2"></div>
                            Đang tải...
                          </div>
                        ) : (
                          "Không có dữ liệu"
                        )
                      }
                    />
                  </div>

                  {/* District */}
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span>
                        Quận/Huyện <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <Select
                      value={formData.district ? parseInt(formData.district) : undefined}
                      onChange={(value: number) => handleDistrictChange(value)}
                      placeholder="Chọn Quận/Huyện"
                      loading={isLoadingLocations}
                      disabled={!formData.province || isLoadingLocations}
                      size="large"
                      className="w-full [&_.ant-select-selector]:!h-11 [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector:hover]:!border-[#E04D30] [&.ant-select-focused_.ant-select-selector]:!border-[#E04D30] [&_.ant-select-selector]:!transition-all"
                      options={districts.map((d) => ({
                        label: d.label,
                        value: d.value,
                      }))}
                      notFoundContent={
                        isLoadingLocations ? (
                          <div className="py-4 text-center text-gray-500">
                            <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-[#E04D30] border-t-transparent mr-2"></div>
                            Đang tải...
                          </div>
                        ) : !formData.province ? (
                          <div className="py-4 text-center text-gray-400">
                            Vui lòng chọn Tỉnh/Thành phố trước
                          </div>
                        ) : (
                          "Không có dữ liệu"
                        )
                      }
                    />
                  </div>

                  {/* Ward/Commune */}
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span>
                        Phường/Xã <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <Select
                      value={formData.ward}
                      onChange={(value: string) => handleWardChange(value)}
                      placeholder="Chọn Phường/Xã"
                      loading={isLoadingLocations}
                      disabled={!formData.district || isLoadingLocations}
                      size="large"
                      className="w-full [&_.ant-select-selector]:!h-11 [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector:hover]:!border-[#E04D30] [&.ant-select-focused_.ant-select-selector]:!border-[#E04D30] [&_.ant-select-selector]:!transition-all"
                      options={wards.map((w) => ({
                        label: w.label,
                        value: w.value,
                      }))}
                      notFoundContent={
                        isLoadingLocations ? (
                          <div className="py-4 text-center text-gray-500">
                            <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-[#E04D30] border-t-transparent mr-2"></div>
                            Đang tải...
                          </div>
                        ) : !formData.district ? (
                          <div className="py-4 text-center text-gray-400">
                            Vui lòng chọn Quận/Huyện trước
                          </div>
                        ) : (
                          "Không có dữ liệu"
                        )
                      }
                    />
                  </div>

                  {/* Detail Address */}
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ chi tiết <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      value={formData.detailAddress}
                      onChange={(e) =>
                        handleInputChange("detailAddress", e.target.value)
                      }
                      placeholder="Nhập số nhà, tên đường, tòa nhà..."
                      rows={3}
                      className="hover:!border-[#E04D30] focus:!border-[#E04D30] focus:!ring-[#E04D30] transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-1.5">
                      Ví dụ: Số 123, Đường ABC, Tòa nhà XYZ
                    </p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-2"></div>

              {/* Default Address Checkbox */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) =>
                      handleInputChange("isDefault", e.target.checked)
                    }
                    label=""
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="isDefault"
                      className="text-sm font-medium text-gray-700 cursor-pointer block"
                    >
                      Đặt làm địa chỉ mặc định
                    </label>
                    <p className="text-xs text-gray-500 mt-1.5">
                      Địa chỉ này sẽ được sử dụng mặc định khi đặt hàng
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-6 py-5 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-end gap-3 sticky bottom-0">
              <Button
                variant="outline"
                size="md"
                onClick={handleCloseModal}
                disabled={isLoading}
                className="w-full sm:w-auto !bg-white !border-gray-300 !text-gray-700 hover:!bg-gray-50 hover:!border-gray-400 transition-all"
              >
                Hủy
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleSave}
                disabled={isLoading}
                className="w-full sm:w-auto px-8 !bg-[#E04D30] !border-[#E04D30] hover:!bg-[#c93d24] hover:!border-[#c93d24] disabled:!opacity-50 disabled:!cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Đang lưu...
                  </span>
                ) : (
                  "Lưu địa chỉ"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressTab;
