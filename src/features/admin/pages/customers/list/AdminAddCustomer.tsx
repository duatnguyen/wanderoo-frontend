import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import FormInput from "@/components/ui/form-input";
import CustomRadio from "@/components/ui/custom-radio";
import CityDropdown from "@/components/ui/city-dropdown";
import DistrictDropdown from "@/components/ui/district-dropdown";
import WardDropdown from "@/components/ui/ward-dropdown";

const AdminAddCustomer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    birthdate: "",
    gender: "Nữ",
    email: "",
    addressName: "",
    addressPhone: "",
    city: "",
    ward: "",
    district: "",
    detailAddress: "",
    note: "",
  });

  const handleSubmit = () => {
    // TODO: Implement API call to create customer
    console.log("Creating customer:", formData);
    // Navigate back to customers list after successful creation
    navigate("/admin/customers");
  };

  return (
    <div className="flex flex-col gap-[10px] w-full max-w-[930px] mx-auto">
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
                Họ và tên
              </label>
              <FormInput
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Nhập họ và tên"
                containerClassName="h-[36px] px-[12px] py-0"
              />
            </div>
            <div className="flex flex-col gap-[8px]">
              <label className="font-semibold text-[#272424] text-[14px]">
                Số điện thoại
              </label>
              <FormInput
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Nhập số điện thoại"
                containerClassName="h-[36px] px-[12px] py-0"
              />
            </div>
          </div>

          {/* Birthdate and Gender */}
          <div className="grid grid-cols-2 gap-[16px]">
            <div className="flex flex-col gap-[8px]">
              <label className="font-semibold text-[#272424] text-[14px]">
                Ngày sinh
              </label>
              <div className="bg-white border-2 border-[#e04d30] flex items-center h-[36px] px-[12px] py-0 rounded-[12px] w-full relative">
                <input
                  type="date"
                  value={formData.birthdate}
                  onChange={(e) =>
                    setFormData({ ...formData, birthdate: e.target.value })
                  }
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
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Nhập email"
              containerClassName="h-[36px] px-[12px] py-0"
            />
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div className="bg-white border border-[#d1d1d1] rounded-[24px] p-[24px] w-full">
        <h2 className="font-bold text-[#272424] text-[16px] leading-[1.4] mb-[10px]">
          Địa chỉ
        </h2>

        <div className="flex flex-col gap-[16px]">
          {/* Name and Phone */}
          <div className="grid grid-cols-2 gap-[16px]">
            <div className="flex flex-col gap-[8px]">
              <label className="font-semibold text-[#272424] text-[14px]">
                Họ và tên
              </label>
              <FormInput
                value={formData.addressName}
                onChange={(e) =>
                  setFormData({ ...formData, addressName: e.target.value })
                }
                placeholder="Nhập họ và tên"
                containerClassName="h-[36px] px-[12px] py-0"
              />
            </div>
            <div className="flex flex-col gap-[8px]">
              <label className="font-semibold text-[#272424] text-[14px]">
                Số điện thoại
              </label>
              <FormInput
                value={formData.addressPhone}
                onChange={(e) =>
                  setFormData({ ...formData, addressPhone: e.target.value })
                }
                placeholder="Nhập số điện thoại"
                containerClassName="h-[36px] px-[12px] py-0"
              />
            </div>
          </div>

          {/* City, Ward, District */}
          <div className="grid grid-cols-3 gap-[16px]">
            <div className="flex flex-col gap-[8px]">
              <label className="font-semibold text-[#272424] text-[14px]">
                Tỉnnh/TP <span className="text-[#e04d30]">*</span>
              </label>
              <CityDropdown
                value={formData.city}
                onValueChange={(value) =>
                  setFormData({ ...formData, city: value })
                }
                placeholder="Chọn vào"
              />
            </div>
            <div className="flex flex-col gap-[8px]">
              <label className="font-semibold text-[#272424] text-[14px]">
                Phường/Xã <span className="text-[#e04d30]">*</span>
              </label>
              <WardDropdown
                value={formData.ward}
                onValueChange={(value) =>
                  setFormData({ ...formData, ward: value })
                }
                placeholder="Chọn vào"
              />
            </div>
            <div className="flex flex-col gap-[8px]">
              <label className="font-semibold text-[#272424] text-[14px]">
                Quận/Huyện <span className="text-[#e04d30]">*</span>
              </label>
              <DistrictDropdown
                value={formData.district}
                onValueChange={(value) =>
                  setFormData({ ...formData, district: value })
                }
                placeholder="Chọn vào"
              />
            </div>
          </div>

          {/* Detail Address */}
          <div className="flex flex-col gap-[8px]">
            <label className="font-semibold text-[#272424] text-[14px]">
              Địa chỉ cụ thể
            </label>
            <FormInput
              value={formData.detailAddress}
              onChange={(e) =>
                setFormData({ ...formData, detailAddress: e.target.value })
              }
              placeholder="Nhập địa chỉ cụ thể"
              containerClassName="h-[36px] px-[12px] py-0"
            />
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="bg-white border border-[#d1d1d1] rounded-[24px] p-[24px] w-full">
        <h2 className="font-bold text-[#272424] text-[16px] leading-[1.4] mb-[10px]">
          Ghi chú
        </h2>

        <div className="flex flex-col gap-[8px]">
          <FormInput
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            placeholder="Nhập ghi chú (Nếu có)"
            containerClassName="h-[50px] px-[12px] py-0"
          />
        </div>
      </div>

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
        >
          Thêm mới
        </Button>
      </div>
    </div>
  );
};

export default AdminAddCustomer;
