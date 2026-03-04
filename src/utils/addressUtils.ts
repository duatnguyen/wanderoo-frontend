import type { AddressResponse } from "../types/auth";
import type { AddressOption, EditFormState } from "../types/checkout";

export const parseRegion = (
  region: string
): Pick<EditFormState, "province" | "district" | "ward"> => {
  if (!region) {
    return { province: "", district: "", ward: "" };
  }

  const parts = region
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  let ward = "";
  let district = "";
  let province = "";

  parts.forEach((part) => {
    if (!ward && (part.startsWith("Phường") || part.startsWith("Xã"))) {
      ward = part;
      return;
    }

    if (
      !district &&
      (part.startsWith("Quận") ||
        part.startsWith("Huyện") ||
        part.startsWith("Thành phố"))
    ) {
      district = part;
      return;
    }

    if (!province) {
      province = part;
    }
  });

  if (!province && parts.length) {
    province = parts[parts.length - 1];
  }

  return { province, district, ward };
};

export const mapAddressResponseToOption = (addr: AddressResponse): AddressOption => {
  const region = [
    addr.wardName,
    addr.districtName,
    addr.provinceName
  ].filter(Boolean).join(", ");

  const fullAddress = addr.fullAddress || `${addr.street}, ${region}`;

  // Use receiverName/receiverPhone if available, otherwise fallback to name/phone
  const displayName = addr.receiverName || addr.name;
  const displayPhone = addr.receiverPhone || addr.phone;

  return {
    id: addr.id,
    name: displayName,
    phone: displayPhone,
    detailAddress: addr.street || "",
    region: region,
    address: fullAddress,
    isDefault: addr.isDefault === true || addr.isDefault === "Địa chỉ mặc định",
  };
};

export const mapAddressListToOptions = (addresses: AddressResponse[]): AddressOption[] => {
  return addresses.map(mapAddressResponseToOption);
};