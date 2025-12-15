import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useMemo, useState } from "react";
import FormInput from "@/components/ui/form-input";
import CustomRadio from "@/components/ui/custom-radio";
import { createCustomer, createCustomerAddress } from "@/api/endpoints/userApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CaretDown from "@/components/ui/caret-down";
import { getProvinces, getDistrictsByPath, getWardsByPath } from "@/api/endpoints/shippingApi";
import { toast } from "sonner";
import type { CustomerCreationRequest } from "@/types/api";
import type {
  AddressCreationRequest,
  ProvinceResponse,
  DistrictResponse,
  WardResponse,
} from "@/types";

type CustomerField = "name" | "phone" | "birthdate" | "email" | "username" | "password" | "addressName" | "addressPhone" | "province" | "district" | "ward" | "location";
type FormErrors = Partial<Record<CustomerField, string>>;
type CustomerFormData = {
  name: string;
  phone: string;
  birthdate: string;
  gender: "Nam" | "Nữ";
  email: string;
  username: string;
  password: string;
  addressName: string;
  addressPhone: string;
  province: string;
  provinceId: number | null;
  district: string;
  districtId: number | null;
  ward: string;
  location: string;
  wardCode: string;
};

const NAME_REGEX = /^[\p{L}\s'.-]+$/u;
const USERNAME_REGEX = /^[a-zA-Z0-9_]{4,30}$/;
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const AdminAddCustomer = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<CustomerFormData>({
    name: "",
    phone: "",
    birthdate: "",
    gender: "Nữ",
    email: "",
    username: "",
    password: "",
    addressName: "",
    addressPhone: "",
    province: "",
    provinceId: null as number | null,
    district: "",
    districtId: null as number | null,
    ward: "",
    location: "",
    wardCode: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const setFieldError = (field: CustomerField, error?: string) => {
    setFormErrors((prev) => {
      const next = { ...prev };
      if (error) {
        next[field] = error;
      } else {
        delete next[field];
      }
      return next;
    });
  };

  const validateField = (field: CustomerField, value: string) => {
    return validateFieldWithData(field, value, formData);
  };

  const handleFieldChange = (field: CustomerField, value: string) => {
    const updatedFormData = {
      ...formData,
      [field]: value,
    };
    setFormData(updatedFormData);
    setApiError(null);
    
    // Validate the changed field with updated formData
    validateFieldWithData(field, value, updatedFormData);
    
    // If address field changes, re-validate related address fields
    if (field === "province" || field === "district" || field === "ward" || field === "location" || field === "addressName" || field === "addressPhone") {
      // Re-validate all address fields when one changes
      setTimeout(() => {
        validateFieldWithData("addressName", updatedFormData.addressName, updatedFormData);
        validateFieldWithData("addressPhone", updatedFormData.addressPhone, updatedFormData);
        validateFieldWithData("province", updatedFormData.province, updatedFormData);
        validateFieldWithData("district", updatedFormData.district, updatedFormData);
        validateFieldWithData("ward", updatedFormData.ward, updatedFormData);
        validateFieldWithData("location", updatedFormData.location, updatedFormData);
      }, 0);
    }
  };
  
  const validateFieldWithData = (field: CustomerField, value: string, currentFormData: CustomerFormData) => {
    let error: string | undefined;
    const trimmedValue = value.trim();

    switch (field) {
      case "name":
        if (!trimmedValue) {
          error = "Vui lòng nhập họ tên.";
        } else if (trimmedValue.length < 3) {
          error = "Họ tên phải có ít nhất 3 ký tự.";
        } else if (!NAME_REGEX.test(trimmedValue)) {
          error = "Họ tên không được chứa ký tự đặc biệt.";
        }
        break;
      case "phone": {
        if (!trimmedValue) {
          error = "Vui lòng nhập số điện thoại.";
          break;
        }
        const digits = trimmedValue.replace(/\D/g, "");
        if (!/^\d+$/.test(trimmedValue)) {
          error = "Số điện thoại chỉ được chứa chữ số.";
        } else if (digits.length < 10 || digits.length > 13) {
          error = "Số điện thoại phải có từ 10 đến 13 chữ số.";
        }
        break;
      }
      case "email":
        if (trimmedValue && !EMAIL_REGEX.test(trimmedValue)) {
          error = "Định dạng email không đúng. Ví dụ: ten@gmail.com";
        }
        break;
      case "username":
        if (trimmedValue && !USERNAME_REGEX.test(trimmedValue)) {
          error =
            "Tên đăng nhập phải từ 4-30 ký tự và chỉ gồm chữ, số, dấu gạch dưới.";
        }
        break;
      case "birthdate":
        if (trimmedValue) {
          const inputDate = new Date(trimmedValue);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (Number.isNaN(inputDate.getTime())) {
            error = "Ngày sinh không hợp lệ.";
          } else if (inputDate > today) {
            error = "Ngày sinh không được lớn hơn hiện tại.";
          } else {
            // Check if age is at least 16 years old
            const age = today.getFullYear() - inputDate.getFullYear();
            const monthDiff = today.getMonth() - inputDate.getMonth();
            const dayDiff = today.getDate() - inputDate.getDate();
            const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
            if (actualAge < 16) {
              error = "Khách hàng phải từ 16 tuổi trở lên.";
            }
          }
        }
        break;
      case "password":
        if (trimmedValue && trimmedValue.length < 6) {
          error = "Mật khẩu phải có ít nhất 6 ký tự.";
        }
        break;
      case "addressName":
        // Validate only if address is being filled (at least one address field is filled)
        const hasAddressData = currentFormData.province || currentFormData.district || currentFormData.ward || currentFormData.location.trim() || currentFormData.addressPhone.trim();
        if (hasAddressData && !trimmedValue) {
          error = "Vui lòng nhập họ tên người nhận.";
        } else if (trimmedValue && trimmedValue.length < 3) {
          error = "Họ tên người nhận phải có ít nhất 3 ký tự.";
        } else if (trimmedValue && !NAME_REGEX.test(trimmedValue)) {
          error = "Họ tên người nhận không được chứa ký tự đặc biệt.";
        }
        break;
      case "addressPhone": {
        const hasAddressData = currentFormData.province || currentFormData.district || currentFormData.ward || currentFormData.location.trim() || currentFormData.addressName.trim();
        if (hasAddressData && !trimmedValue) {
          error = "Vui lòng nhập số điện thoại người nhận.";
          break;
        }
        if (trimmedValue) {
          const digits = trimmedValue.replace(/\D/g, "");
          if (!/^\d+$/.test(trimmedValue)) {
            error = "Số điện thoại chỉ được chứa chữ số.";
          } else if (digits.length < 10 || digits.length > 13) {
            error = "Số điện thoại phải có từ 10 đến 13 chữ số.";
          }
        }
        break;
      }
      case "province":
        const hasOtherAddressData = currentFormData.district || currentFormData.ward || currentFormData.location.trim() || currentFormData.addressName.trim() || currentFormData.addressPhone.trim();
        if (hasOtherAddressData && !trimmedValue) {
          error = "Vui lòng chọn tỉnh/thành phố.";
        }
        break;
      case "district":
        if (currentFormData.province && !trimmedValue) {
          error = "Vui lòng chọn quận/huyện.";
        }
        break;
      case "ward":
        if (currentFormData.district && !trimmedValue) {
          error = "Vui lòng chọn phường/xã.";
        }
        break;
      case "location":
        const hasAddressFields = currentFormData.province || currentFormData.district || currentFormData.ward || currentFormData.addressName.trim() || currentFormData.addressPhone.trim();
        if (hasAddressFields && !trimmedValue) {
          error = "Vui lòng nhập địa chỉ cụ thể.";
        } else if (trimmedValue && trimmedValue.length < 5) {
          error = "Địa chỉ cụ thể phải có ít nhất 5 ký tự.";
        }
        break;
      default:
        break;
    }

    setFieldError(field, error);
    return error;
  };

  const validateForm = () => {
    let isValid = true;
    
    // Validate contact information
    (["name", "phone", "email", "username", "birthdate", "password"] as CustomerField[]).forEach(
      (field) => {
        const error = validateField(field, formData[field]);
        if (error) {
          isValid = false;
        }
      }
    );
    
    // Validate address fields if any address data is provided
    const hasAddressData = formData.province || formData.district || formData.ward || 
                          formData.location.trim() || formData.addressName.trim() || 
                          formData.addressPhone.trim();
    
    if (hasAddressData) {
      // If user starts filling address, all required fields must be filled
      (["addressName", "addressPhone", "province", "district", "ward", "location"] as CustomerField[]).forEach(
        (field) => {
          const error = validateField(field, formData[field] || "");
          if (error) {
            isValid = false;
          }
        }
      );
      
      // Additional validation: if province is selected, district and ward must be selected
      if (formData.province && (!formData.district || !formData.ward)) {
        if (!formData.district) {
          setFieldError("district", "Vui lòng chọn quận/huyện.");
          isValid = false;
        }
        if (!formData.ward) {
          setFieldError("ward", "Vui lòng chọn phường/xã.");
          isValid = false;
        }
      }
      
      // Validate provinceId, districtId, wardCode are set
      if (formData.province && !formData.provinceId) {
        setFieldError("province", "Vui lòng chọn tỉnh/thành phố hợp lệ.");
        isValid = false;
      }
      if (formData.district && !formData.districtId) {
        setFieldError("district", "Vui lòng chọn quận/huyện hợp lệ.");
        isValid = false;
      }
      if (formData.ward && !formData.wardCode.trim()) {
        setFieldError("ward", "Vui lòng chọn phường/xã hợp lệ.");
        isValid = false;
      }
    }
    
    return isValid;
  };

  const shouldHideLocationName = (name: string) => {
    const normalized = name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    return normalized.includes("test") || normalized === "ha noi 02";
  };

  const {
    data: provincesData,
    isLoading: isLoadingProvinces,
    isError: isProvinceError,
  } = useQuery({
    queryKey: ["shipping-provinces"],
    queryFn: getProvinces,
  });

  const provinces = useMemo(() => {
    if (!provincesData) return [];
    return provincesData
      .filter((province) => !shouldHideLocationName(province.provinceName))
      .sort((a, b) =>
        a.provinceName.localeCompare(b.provinceName, "vi", { sensitivity: "base" })
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
    if (!districtsData) return [];
    return districtsData
      .filter((district) => !shouldHideLocationName(district.districtName))
      .sort((a, b) =>
        a.districtName.localeCompare(b.districtName, "vi", { sensitivity: "base" })
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
    if (!wardsData) return [];
    return wardsData
      .filter((ward) => !shouldHideLocationName(ward.wardName))
      .sort((a, b) =>
        a.wardName.localeCompare(b.wardName, "vi", { sensitivity: "base" })
      );
  }, [wardsData]);

  const handleProvinceSelect = (province: ProvinceResponse) => {
    const updatedFormData = {
      ...formData,
      province: province.provinceName,
      provinceId: province.provinceId,
      district: "",
      districtId: null,
      ward: "",
      wardCode: "",
    };
    setFormData(updatedFormData);
    setFieldError("province", undefined);
    setFieldError("district", undefined);
    setFieldError("ward", undefined);
    // Re-validate address fields
    setTimeout(() => {
      validateFieldWithData("province", province.provinceName, updatedFormData);
      validateFieldWithData("district", "", updatedFormData);
      validateFieldWithData("ward", "", updatedFormData);
      validateFieldWithData("addressName", updatedFormData.addressName, updatedFormData);
      validateFieldWithData("addressPhone", updatedFormData.addressPhone, updatedFormData);
      validateFieldWithData("location", updatedFormData.location, updatedFormData);
    }, 0);
  };

  const handleDistrictSelect = (district: DistrictResponse) => {
    const updatedFormData = {
      ...formData,
      district: district.districtName,
      districtId: district.districtId,
      ward: "",
      wardCode: "",
    };
    setFormData(updatedFormData);
    setFieldError("district", undefined);
    setFieldError("ward", undefined);
    // Re-validate address fields
    setTimeout(() => {
      validateFieldWithData("district", district.districtName, updatedFormData);
      validateFieldWithData("ward", "", updatedFormData);
      validateFieldWithData("addressName", updatedFormData.addressName, updatedFormData);
      validateFieldWithData("addressPhone", updatedFormData.addressPhone, updatedFormData);
      validateFieldWithData("location", updatedFormData.location, updatedFormData);
    }, 0);
  };

  const handleWardSelect = (ward: WardResponse) => {
    const updatedFormData = {
      ...formData,
      ward: ward.wardName,
      wardCode: ward.wardCode,
    };
    setFormData(updatedFormData);
    setFieldError("ward", undefined);
    // Re-validate address fields
    setTimeout(() => {
      validateFieldWithData("ward", ward.wardName, updatedFormData);
      validateFieldWithData("addressName", updatedFormData.addressName, updatedFormData);
      validateFieldWithData("addressPhone", updatedFormData.addressPhone, updatedFormData);
      validateFieldWithData("location", updatedFormData.location, updatedFormData);
    }, 0);
  };

  const provinceLabel = useMemo(() => {
    if (isLoadingProvinces) return "Đang tải tỉnh/thành";
    if (isProvinceError) return "Không thể tải tỉnh/thành";
    return formData.province || "Chọn tỉnh/thành phố";
  }, [formData.province, isLoadingProvinces, isProvinceError]);

  const districtLabel = useMemo(() => {
    if (!formData.provinceId) return "Chọn tỉnh trước";
    if (isLoadingDistricts) return "Đang tải quận/huyện";
    if (isDistrictError) return "Không thể tải quận/huyện";
    return formData.district || "Chọn quận/huyện";
  }, [
    formData.district,
    formData.provinceId,
    isLoadingDistricts,
    isDistrictError,
  ]);

  const wardLabel = useMemo(() => {
    if (!formData.districtId) return "Chọn quận/huyện trước";
    if (isLoadingWards) return "Đang tải phường/xã";
    if (isWardError) return "Không thể tải phường/xã";
    return formData.ward || "Chọn phường/xã";
  }, [formData.ward, formData.districtId, isLoadingWards, isWardError]);

  const renderMenuContent = <T extends { [key: string]: any }>(
    list: T[] | null | undefined,
    onSelect: (item: T) => void,
    labelKey: keyof T
  ) => {
    if (!list || !Array.isArray(list) || list.length === 0) {
      return (
        <div className="px-3 py-2 text-[13px] text-[#888888]">
          Không có dữ liệu
        </div>
      );
    }

    return list.map((item) => (
      <DropdownMenuItem
        key={String(item[labelKey])}
        onClick={() => onSelect(item)}
        className="text-[14px]"
      >
        {item[labelKey]}
      </DropdownMenuItem>
    ));
  };

  const createCustomerMutation = useMutation({
    mutationFn: (data: CustomerCreationRequest) => createCustomer(data),
    onSuccess: async (response) => {
      setFormErrors({});
      setApiError(null);
      const customerId = response.data;
      console.log("Customer created with ID:", customerId);
      
      // Create address if provided
      if (
        formData.province &&
        formData.district &&
        formData.ward &&
        formData.location
      ) {
        if (!formData.provinceId || !formData.districtId || !formData.wardCode.trim()) {
          toast.warning("Không thể tạo địa chỉ vì thiếu thông tin tỉnh/thành hợp lệ");
        } else {
          try {
            const street = formData.location.trim();
            const wardName = formData.ward.trim();
            const districtName = formData.district.trim();
            const provinceName = formData.province.trim();
            const addressData: AddressCreationRequest = {
              name: formData.addressName.trim() || formData.name.trim(),
              phone: formData.addressPhone.trim() || formData.phone.trim(),
              street,
              wardCode: formData.wardCode.trim(),
              wardName,
              districtId: formData.districtId,
              districtName,
              provinceName,
              fullAddress: [street, wardName, districtName, provinceName]
                .filter(Boolean)
                .join(", "),
            };
            await createCustomerAddress(customerId, addressData);
            console.log("Address created for customer:", customerId);
          } catch (error) {
            console.error("Error creating address:", error);
            // Don't fail the whole operation if address creation fails
            toast.warning("Khách hàng đã được tạo nhưng không thể tạo địa chỉ giao hàng");
          }
        }
      }
      
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-customers"] }),
        queryClient.invalidateQueries({ queryKey: ["admin-customers-all"] }),
      ]);
      toast.success("Thêm khách hàng thành công");
      navigate("/admin/customers", { state: { shouldFocusLastPage: true } });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể tạo khách hàng";
      const lowerMessage = errorMessage.toLowerCase();

      const fieldErrorTranslations: Array<{
        field: CustomerField;
        keywords: string[];
        translatedMessage: string;
      }> = [
        {
          field: "phone",
          keywords: [
            "phone number must contain only digits",
            "phone number must be between 10 and 13 digits",
          ],
          translatedMessage: "Số điện thoại chỉ được chứa 10-13 chữ số.",
        },
        {
          field: "phone",
          keywords: ["phone number already exists", "duplicate entry", "constraint `phone`"],
          translatedMessage: "Số điện thoại đã tồn tại.",
        },
        {
          field: "email",
          keywords: ["email already exists"],
          translatedMessage: "Email đã tồn tại.",
        },
        {
          field: "username",
          keywords: ["username already exists"],
          translatedMessage: "Tên đăng nhập đã tồn tại.",
        },
        {
          field: "birthdate",
          keywords: ["birthday must be in the past"],
          translatedMessage: "Ngày sinh không được lớn hơn hiện tại.",
        },
      ];

      const matchedFieldError = fieldErrorTranslations.find(({ keywords }) =>
        keywords.some((keyword) => lowerMessage.includes(keyword.toLowerCase()))
      );

      if (matchedFieldError) {
        setFieldError(matchedFieldError.field, matchedFieldError.translatedMessage);
        toast.error(matchedFieldError.translatedMessage);
      } else {
        setApiError(errorMessage);
        toast.error(errorMessage);
      }
    },
  });

  const handleSubmit = () => {
    setApiError(null);
    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin.");
      return;
    }

    // Convert gender to backend format
    const gender = formData.gender === "Nam" ? "MALE" : formData.gender === "Nữ" ? "FEMALE" : undefined;

    const customerData: CustomerCreationRequest = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || undefined,
      username: formData.username.trim() || undefined, // Optional - backend will auto-generate
      password: formData.password.trim() || undefined, // Optional - backend will auto-generate
      gender: gender as any,
      birthday: formData.birthdate ? new Date(formData.birthdate).toISOString() : undefined,
      // Note: Address is managed separately via Address entity, not in customer creation
    };

    console.log("Creating customer with data:", customerData);
    createCustomerMutation.mutate(customerData);
  };

  return (
    <div className="flex flex-col gap-[10px] w-full">
      {/* Header */}
      <div className="flex items-center h-[24px] -mt-[5px]">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-[24px] h-[24px] rounded-lg transition-colors"
        >
          <ArrowLeft className="w-[16px] h-[16px] text-[#272424]" />
        </button>
        <h1 className="ml-[8px] font-bold text-[#272424] text-[20px] leading-[1]">
          Thêm mới khách hàng
        </h1>
      </div>

      {/* Contact Information Section */}
      <div className="bg-white border border-[#d1d1d1] rounded-[24px] p-[24px] w-full">
        <h2 className="font-bold text-[#272424] text-[16px] leading-[1.4] mb-[10px]">
          Thông tin liên hệ
        </h2>

        <div className="flex flex-col gap-[16px]">
          {/* Name and Phone */}
          <div className="grid grid-cols-2 gap-[16px]">
            <div className="flex flex-col gap-[8px]">
              <label className="font-semibold text-[#272424] text-[14px]">
                Họ và tên <span className="text-[#e04d30]">*</span>
              </label>
              <FormInput
                value={formData.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                placeholder="Nhập họ và tên"
                containerClassName="h-[36px] px-[12px] py-0"
              />
              {formErrors.name && (
                <p className="text-sm text-red-500">{formErrors.name}</p>
              )}
            </div>
            <div className="flex flex-col gap-[8px]">
              <label className="font-semibold text-[#272424] text-[14px]">
                Số điện thoại <span className="text-[#e04d30]">*</span>
              </label>
              <FormInput
                value={formData.phone}
                onChange={(e) => handleFieldChange("phone", e.target.value)}
                placeholder="Nhập số điện thoại"
                containerClassName="h-[36px] px-[12px] py-0"
              />
              {formErrors.phone && (
                <p className="text-sm text-red-500">{formErrors.phone}</p>
              )}
            </div>
          </div>

          {/* Birthdate and Gender */}
          <div className="grid grid-cols-2 gap-[16px]">
            <div className="flex flex-col gap-[8px]">
              <label className="font-semibold text-[#272424] text-[14px]">
                Ngày sinh
              </label>
              <div className="bg-white border border-[#d1d1d1] flex items-center h-[36px] px-[12px] py-0 rounded-[12px] w-full relative">
                <input
                  type="date"
                  value={formData.birthdate}
                  onChange={(e) => handleFieldChange("birthdate", e.target.value)}
                  placeholder="20 / 10 / 1997"
                  className={`hide-native-picker border-0 outline-none bg-transparent text-[14px] font-semibold placeholder:text-[#888888] ${formData.birthdate ? "text-[#272424]" : "text-[#888888]"} flex-1 w-full`}
                />
                <svg
                  className="w-5 h-5 text-[#272424] opacity-40 absolute right-3 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              {formErrors.birthdate && (
                <p className="text-sm text-red-500">{formErrors.birthdate}</p>
              )}
            </div>
            <div className="flex flex-col gap-[4px]">
              <label className="font-semibold text-[#272424] text-[14px]">
                Giới tính
              </label>
              <div className="flex gap-[16px] items-center h-[36px]">
                <CustomRadio
                  label="Nữ"
                  checked={formData.gender === "Nữ"}
                  onChange={() => setFormData({ ...formData, gender: "Nữ" })}
                />
                <CustomRadio
                  label="Nam"
                  checked={formData.gender === "Nam"}
                  onChange={() => setFormData({ ...formData, gender: "Nam" })}
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-[8px]">
            <label className="font-semibold text-[#272424] text-[14px]">
              Email
            </label>
            <FormInput
              type="email"
              value={formData.email}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              placeholder="Nhập email (không bắt buộc)"
              containerClassName="h-[36px] px-[12px] py-0"
            />
            {formErrors.email && (
              <p className="text-sm text-red-500">{formErrors.email}</p>
            )}
          </div>

          {/* Username */}
          <div className="flex flex-col gap-[8px]">
            <label className="font-semibold text-[#272424] text-[14px]">
              Tên đăng nhập
            </label>
            <FormInput
              value={formData.username}
              onChange={(e) => handleFieldChange("username", e.target.value)}
              placeholder="Nhập tên đăng nhập (không bắt buộc)"
              containerClassName="h-[36px] px-[12px] py-0"
            />
            {formErrors.username && (
              <p className="text-sm text-red-500">{formErrors.username}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-[8px]">
            <label className="font-semibold text-[#272424] text-[14px]">
              Mật khẩu
            </label>
            <FormInput
              type="password"
              value={formData.password}
              onChange={(e) => handleFieldChange("password", e.target.value)}
              placeholder="Nhập mật khẩu (không bắt buộc - tối thiểu 6 ký tự nếu nhập)"
              containerClassName="h-[36px] px-[12px] py-0"
            />
            {formErrors.password && (
              <p className="text-sm text-red-500">{formErrors.password}</p>
            )}
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div className="bg-white border border-[#d1d1d1] rounded-[24px] p-[24px] w-full">
        <h2 className="font-bold text-[#272424] text-[16px] leading-[1.4] mb-[10px]">
          Địa chỉ giao hàng
        </h2>

        <div className="flex flex-col gap-[16px]">
          {/* Name and Phone */}
          <div className="grid grid-cols-2 gap-[16px]">
            <div className="flex flex-col gap-[8px]">
              <label className="font-semibold text-[#272424] text-[14px]">
                Họ và tên người nhận
              </label>
              <FormInput
                value={formData.addressName}
                onChange={(e) =>
                  handleFieldChange("addressName", e.target.value)
                }
                placeholder="Nhập họ và tên (mặc định là tên khách hàng)"
                containerClassName={`h-[36px] px-[12px] py-0 ${formErrors.addressName ? "border-red-500" : ""}`}
              />
              {formErrors.addressName && (
                <p className="text-sm text-red-500">{formErrors.addressName}</p>
              )}
            </div>
            <div className="flex flex-col gap-[8px]">
              <label className="font-semibold text-[#272424] text-[14px]">
                Số điện thoại người nhận
              </label>
              <FormInput
                value={formData.addressPhone}
                onChange={(e) =>
                  handleFieldChange("addressPhone", e.target.value)
                }
                placeholder="Nhập số điện thoại (mặc định là số điện thoại khách hàng)"
                containerClassName={`h-[36px] px-[12px] py-0 ${formErrors.addressPhone ? "border-red-500" : ""}`}
              />
              {formErrors.addressPhone && (
                <p className="text-sm text-red-500">{formErrors.addressPhone}</p>
              )}
            </div>
          </div>

          {/* Province, District, Ward - 3 combobox on same line */}
          <div className="grid grid-cols-3 gap-[16px]">
            <div className="flex flex-col gap-[8px]">
              <label className="font-semibold text-[#272424] text-[14px]">
                Tỉnh/Thành phố
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div
                    className={`bg-white border ${isProvinceError || formErrors.province ? "border-[#ff4d4f]" : "border-[#d1d1d1]"} flex items-center justify-between h-[40px] px-[10px] rounded-[10px] cursor-pointer`}
                  >
                    <span
                      className={`text-[14px] font-semibold ${
                        formData.province ? "text-[#272424]" : "text-[#888888]"
                      }`}
                    >
                      {provinceLabel}
                    </span>
                    <CaretDown className="w-4 h-4 text-[#1a1a1a]" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-[240px] overflow-auto min-w-[220px]">
                  {isLoadingProvinces ? (
                    <div className="px-3 py-2 text-[13px] text-[#888888]">
                      Đang tải...
                    </div>
                  ) : (
                    renderMenuContent(provinces, handleProvinceSelect, "provinceName")
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              {formErrors.province && (
                <p className="text-sm text-red-500">{formErrors.province}</p>
              )}
            </div>

            <div className="flex flex-col gap-[8px]">
              <label className="font-semibold text-[#272424] text-[14px]">
                Quận/Huyện
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div
                    className={`bg-white border ${isDistrictError || formErrors.district ? "border-[#ff4d4f]" : "border-[#d1d1d1]"} flex items-center justify-between h-[40px] px-[10px] rounded-[10px] ${
                      !formData.provinceId ? "opacity-60 cursor-not-allowed pointer-events-none" : "cursor-pointer"
                    }`}
                  >
                    <span
                      className={`text-[14px] font-semibold ${
                        formData.district ? "text-[#272424]" : "text-[#888888]"
                      }`}
                    >
                      {districtLabel}
                    </span>
                    <CaretDown className="w-4 h-4 text-[#1a1a1a]" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-[240px] overflow-auto min-w-[220px]">
                  {!formData.provinceId ? (
                    <div className="px-3 py-2 text-[13px] text-[#888888]">
                      Vui lòng chọn tỉnh/thành trước
                    </div>
                  ) : isLoadingDistricts ? (
                    <div className="px-3 py-2 text-[13px] text-[#888888]">
                      Đang tải...
                    </div>
                  ) : (
                    renderMenuContent(districts, handleDistrictSelect, "districtName")
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              {formErrors.district && (
                <p className="text-sm text-red-500">{formErrors.district}</p>
              )}
            </div>

            <div className="flex flex-col gap-[8px]">
              <label className="font-semibold text-[#272424] text-[14px]">
                Phường/Xã
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div
                    className={`bg-white border ${isWardError || formErrors.ward ? "border-[#ff4d4f]" : "border-[#d1d1d1]"} flex items-center justify-between h-[40px] px-[10px] rounded-[10px] ${
                      !formData.districtId ? "opacity-60 cursor-not-allowed pointer-events-none" : "cursor-pointer"
                    }`}
                  >
                    <span
                      className={`text-[14px] font-semibold ${
                        formData.ward ? "text-[#272424]" : "text-[#888888]"
                      }`}
                    >
                      {wardLabel}
                    </span>
                    <CaretDown className="w-4 h-4 text-[#1a1a1a]" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-[240px] overflow-auto min-w-[220px]">
                  {!formData.districtId ? (
                    <div className="px-3 py-2 text-[13px] text-[#888888]">
                      Vui lòng chọn quận/huyện trước
                    </div>
                  ) : isLoadingWards ? (
                    <div className="px-3 py-2 text-[13px] text-[#888888]">
                      Đang tải...
                    </div>
                  ) : (
                    renderMenuContent(wards, handleWardSelect, "wardName")
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              {formErrors.ward && (
                <p className="text-sm text-red-500">{formErrors.ward}</p>
              )}
            </div>
          </div>

          {/* Detail Address */}
          <div className="flex flex-col gap-[8px]">
            <label className="font-semibold text-[#272424] text-[14px]">
              Địa chỉ cụ thể
            </label>
            <FormInput
              value={formData.location}
              onChange={(e) =>
                handleFieldChange("location", e.target.value)
              }
              placeholder="Nhập số nhà, tên đường..."
              containerClassName={`h-[36px] px-[12px] py-0 ${formErrors.location ? "border-red-500" : ""}`}
            />
            {formErrors.location && (
              <p className="text-sm text-red-500">{formErrors.location}</p>
            )}
          </div>
        </div>
      </div>

      {apiError && (
        <div className="w-full rounded-[16px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {apiError}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-[12px] justify-end py-[16px] w-full">
        <Button
          variant="secondary"
          onClick={() => navigate(-1)}
          className="text-[14px]"
        >
          Huỷ
        </Button>
        <Button
          variant="default"
          onClick={handleSubmit}
          className="text-[14px]"
          disabled={createCustomerMutation.isPending}
        >
          {createCustomerMutation.isPending ? "Đang thêm..." : "Thêm mới"}
        </Button>
      </div>
    </div>
  );
};

export default AdminAddCustomer;
