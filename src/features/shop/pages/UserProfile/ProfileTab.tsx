import React, { useState, useCallback } from "react";
import { format } from "date-fns";
import { CalendarIcon, User, Mail, Phone, UserCircle, Edit2, Check, X, Venus, Mars } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import CustomRadio from "../../../../components/ui/custom-radio";
import LoadingSpinner from "../../../../components/ui/LoadingSpinner";
import { Calendar } from "../../../../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../../components/ui/select";
import { updateUserProfile } from "../../../../api/endpoints/userApi";
import { useAuth } from "../../../../context/AuthContext";
import type { UserUpdateRequest } from "../../../../types/auth";

type EditableField = "fullName" | "email" | "phone";

const fieldConfig: Record<
    EditableField,
    {
        label: string;
        type: "text" | "email" | "tel";
        accessor: (user: ReturnType<typeof useAuth>["user"]) => string;
        payloadKey: keyof UserUpdateRequest;
        icon: React.ReactNode;
    }
> = {
    fullName: {
        label: "Họ và tên",
        type: "text",
        accessor: (user) => user?.name || "",
        payloadKey: "name",
        icon: <User className="w-4 h-4" />,
    },
    email: {
        label: "Email",
        type: "email",
        accessor: (user) => user?.email || "",
        payloadKey: "email",
        icon: <Mail className="w-4 h-4" />,
    },
    phone: {
        label: "Số điện thoại",
        type: "tel",
        accessor: (user) => user?.phone || "",
        payloadKey: "phone",
        icon: <Phone className="w-4 h-4" />,
    },
};

const ProfileTab: React.FC = () => {
    const { user, refreshProfile, isLoading } = useAuth();
    const [editingField, setEditingField] = useState<EditableField | null>(null);
    const [pendingValue, setPendingValue] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isEditingGender, setIsEditingGender] = useState(false);
    const [pendingGender, setPendingGender] = useState<"MALE" | "FEMALE">("MALE");
    const [isEditingDateOfBirth, setIsEditingDateOfBirth] = useState(false);
    const [pendingDateOfBirth, setPendingDateOfBirth] = useState<Date | undefined>(undefined);
    const [month, setMonth] = useState<Date>(new Date());
    const [calendarOpen, setCalendarOpen] = useState(false);

    const handleCalendarChange = (
        value: string | number,
        event: any
    ) => {
        const newEvent = {
            target: {
                value: String(value),
            },
        } as any;
        event(newEvent);
    };

    const buildProfilePayload = useCallback(
        (override: Partial<UserUpdateRequest> = {}): UserUpdateRequest => {
            return {
                id: user?.id ?? 0,
                name: override.name ?? user?.name ?? "",
                phone: override.phone ?? user?.phone ?? "",
                email: override.email ?? user?.email ?? "",
                birthday: override.birthday ?? user?.dateOfBirth ?? undefined,
                gender: override.gender ?? (user?.gender as "MALE" | "FEMALE" | undefined),
                image_url: override.image_url ?? user?.avatar ?? null,
            };
        },
        [user]
    );

    const beginEditingField = (field: EditableField) => {
        const currentValue = fieldConfig[field].accessor(user) || "";
        setPendingValue(currentValue);
        setEditingField(field);
    };

    const cancelFieldEdit = () => {
        setEditingField(null);
        setPendingValue("");
        setErrorMessage(null);
        setSuccessMessage(null);
    };

    const saveField = async () => {
        if (!editingField) return;
        const payloadKey = fieldConfig[editingField].payloadKey;
        const overrides: Partial<UserUpdateRequest> = {};
        if (payloadKey === "name") {
            overrides.name = pendingValue;
        } else if (payloadKey === "email") {
            overrides.email = pendingValue;
        } else if (payloadKey === "phone") {
            overrides.phone = pendingValue;
        }
        const payload = buildProfilePayload(overrides);

        setIsSaving(true);
        setErrorMessage(null);
        try {
            await updateUserProfile(payload);
            await refreshProfile();
            setSuccessMessage("Thông tin đã được cập nhật thành công!");
            setEditingField(null);
            setPendingValue("");
            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            console.error("Failed to update profile", error);
            setErrorMessage("Không thể lưu thay đổi. Vui lòng thử lại.");
        } finally {
            setIsSaving(false);
        }
    };

    const displayValue = (value: unknown, placeholder = "Chưa có thông tin") => {
        if (value === null || value === undefined) {
            return placeholder;
        }
        const str = String(value).trim();
        if (!str || str === "**/**/****") {
            return placeholder;
        }
        return str;
    };

    if (isLoading || !user) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                <div className="flex items-center justify-center">
                    <LoadingSpinner size="md" className="mr-3" />
                    <span className="text-gray-600">Đang tải thông tin hồ sơ...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-5 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#E04D30]/10 flex items-center justify-center">
                        <UserCircle className="w-5 h-5 text-[#E04D30]" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Thông tin tài khoản</h2>
                        <p className="text-sm text-gray-600 mt-0.5">Cập nhật thông tin cá nhân và liên hệ của bạn</p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="px-6 pt-5">
                {successMessage && (
                    <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm font-medium">{successMessage}</p>
                    </div>
                )}
                {errorMessage && (
                    <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg flex items-start gap-3">
                        <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm font-medium">{errorMessage}</p>
                    </div>
                )}
            </div>

            {/* Profile Fields */}
            <div className="px-6 pb-6 space-y-3">
                {/* Username Field */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center">
                            <UserCircle className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                            <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Tên tài khoản</dt>
                            <dd className="text-sm text-gray-900 font-semibold">
                                @{displayValue(user.username, "Không xác định")}
                            </dd>
                        </div>
                    </div>
                </div>

                {/* Editable Fields */}
                {(Object.keys(fieldConfig) as EditableField[]).map((field) => {
                    const config = fieldConfig[field];
                    const currentValue = config.accessor(user);
                    const isFieldEditing = editingField === field;

                    return (
                        <div 
                            key={field} 
                            className={`bg-white rounded-lg border transition-all ${
                                isFieldEditing 
                                    ? 'border-[#E04D30] shadow-md' 
                                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                            }`}
                        >
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                                            isFieldEditing 
                                                ? 'bg-[#E04D30]/10 text-[#E04D30]' 
                                                : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {config.icon}
                                        </div>
                                        <dt className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                            {config.label}
                                        </dt>
                                    </div>
                                    {!isFieldEditing && (
                                        <button
                                            onClick={() => beginEditingField(field)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#E04D30] hover:text-[#c53b1d] hover:bg-[#E04D30]/5 rounded-lg transition-all"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                            Chỉnh sửa
                                        </button>
                                    )}
                                </div>
                                <dd>
                                    {isFieldEditing ? (
                                        <div className="space-y-3">
                                            <Input
                                                type={config.type}
                                                value={pendingValue}
                                                onChange={(e) => setPendingValue(e.target.value)}
                                                className="w-full border-gray-300 focus:border-[#E04D30] focus:ring-[#E04D30]"
                                                autoFocus
                                            />
                                            <div className="flex flex-col sm:flex-row gap-2 pt-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={cancelFieldEdit}
                                                    disabled={isSaving}
                                                    className="flex-1 sm:flex-none border-gray-300 hover:bg-gray-50"
                                                >
                                                    <X className="w-4 h-4 mr-1.5" />
                                                    Hủy
                                                </Button>
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    onClick={() => void saveField()}
                                                    disabled={isSaving || pendingValue === currentValue}
                                                    className="flex-1 sm:flex-none bg-[#E04D30] hover:bg-[#c53b1d] text-white"
                                                >
                                                    {isSaving ? (
                                                        <>
                                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1.5"></div>
                                                            Đang lưu...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Check className="w-4 h-4 mr-1.5" />
                                                            Lưu
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-900 font-medium ml-11">
                                            {displayValue(currentValue)}
                                        </p>
                                    )}
                                </dd>
                            </div>
                        </div>
                    );
                })}

                {/* Gender Field */}
                <div className={`bg-white rounded-lg border transition-all ${
                    isEditingGender 
                        ? 'border-[#E04D30] shadow-md' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}>
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                                    isEditingGender 
                                        ? 'bg-[#E04D30]/10 text-[#E04D30]' 
                                        : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {user.gender?.toUpperCase() === "FEMALE" ? (
                                        <Venus className="w-4 h-4" />
                                    ) : (
                                        <Mars className="w-4 h-4" />
                                    )}
                                </div>
                                <dt className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                    Giới tính
                                </dt>
                            </div>
                            {!isEditingGender && (
                                <button
                                    onClick={() => {
                                        const currentGender = user?.gender || "MALE";
                                        setPendingGender(currentGender as "MALE" | "FEMALE");
                                        setIsEditingGender(true);
                                    }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#E04D30] hover:text-[#c53b1d] hover:bg-[#E04D30]/5 rounded-lg transition-all"
                                >
                                    <Edit2 className="w-3.5 h-3.5" />
                                    Chỉnh sửa
                                </button>
                            )}
                        </div>
                        <dd>
                            {isEditingGender ? (
                                <div className="space-y-3">
                                    <div className="space-y-2">
                                        <CustomRadio
                                            name="gender"
                                            value="MALE"
                                            checked={pendingGender === "MALE"}
                                            onChange={(e) => setPendingGender(e.target.value as "MALE" | "FEMALE")}
                                            label="Nam"
                                        />
                                        <CustomRadio
                                            name="gender"
                                            value="FEMALE"
                                            checked={pendingGender === "FEMALE"}
                                            onChange={(e) => setPendingGender(e.target.value as "MALE" | "FEMALE")}
                                            label="Nữ"
                                        />
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setIsEditingGender(false);
                                                setPendingGender("MALE");
                                                setErrorMessage(null);
                                                setSuccessMessage(null);
                                            }}
                                            disabled={isSaving}
                                            className="flex-1 sm:flex-none border-gray-300 hover:bg-gray-50"
                                        >
                                            <X className="w-4 h-4 mr-1.5" />
                                            Hủy
                                        </Button>
                                        <Button
                                            variant="default"
                                            size="sm"
                                            onClick={async () => {
                                                setIsSaving(true);
                                                setErrorMessage(null);
                                                try {
                                                    const payload = buildProfilePayload({ gender: pendingGender });
                                                    await updateUserProfile(payload);
                                                    await refreshProfile();
                                                    setSuccessMessage("Thông tin đã được cập nhật thành công!");
                                                    setIsEditingGender(false);
                                                    setTimeout(() => setSuccessMessage(null), 3000);
                                                } catch (error) {
                                                    console.error("Failed to update gender", error);
                                                    setErrorMessage("Không thể lưu thay đổi. Vui lòng thử lại.");
                                                } finally {
                                                    setIsSaving(false);
                                                }
                                            }}
                                            disabled={isSaving}
                                            className="flex-1 sm:flex-none bg-[#E04D30] hover:bg-[#c53b1d] text-white"
                                        >
                                            {isSaving ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1.5"></div>
                                                    Đang lưu...
                                                </>
                                            ) : (
                                                <>
                                                    <Check className="w-4 h-4 mr-1.5" />
                                                    Lưu
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-900 font-medium ml-11">
                                    {user.gender?.toUpperCase() === "FEMALE" ? "Nữ" : "Nam"}
                                </p>
                            )}
                        </dd>
                    </div>
                </div>

                {/* Date of Birth Field */}
                <div className={`bg-white rounded-lg border transition-all ${
                    isEditingDateOfBirth 
                        ? 'border-[#E04D30] shadow-md' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}>
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                                    isEditingDateOfBirth 
                                        ? 'bg-[#E04D30]/10 text-[#E04D30]' 
                                        : 'bg-gray-100 text-gray-600'
                                }`}>
                                    <CalendarIcon className="w-4 h-4" />
                                </div>
                                <dt className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                    Ngày sinh
                                </dt>
                            </div>
                            {!isEditingDateOfBirth && (
                                <button
                                    onClick={() => {
                                        const currentDateOfBirth = user?.dateOfBirth || "";
                                        setPendingDateOfBirth(currentDateOfBirth ? new Date(currentDateOfBirth) : undefined);
                                        setIsEditingDateOfBirth(true);
                                    }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#E04D30] hover:text-[#c53b1d] hover:bg-[#E04D30]/5 rounded-lg transition-all"
                                >
                                    <Edit2 className="w-3.5 h-3.5" />
                                    Chỉnh sửa
                                </button>
                            )}
                        </div>
                        <dd>
                            {isEditingDateOfBirth ? (
                                <div className="space-y-3">
                                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                className="w-full justify-start text-left font-normal border-gray-300 hover:bg-gray-50"
                                                variant="outline"
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {pendingDateOfBirth ? format(pendingDateOfBirth, "PPP") : <span className="text-gray-500">Chọn ngày sinh</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent align="start" className="w-auto p-0">
                                            <Calendar
                                                captionLayout="dropdown"
                                                components={{
                                                    DropdownNav: (props) => (
                                                        <div className="flex w-full items-center gap-2">
                                                            {props.children}
                                                        </div>
                                                    ),
                                                    Dropdown: (props) => (
                                                        <Select
                                                            onValueChange={(value) => {
                                                                if (props.onChange) {
                                                                    handleCalendarChange(value, props.onChange);
                                                                }
                                                            }}
                                                            value={String(props.value)}
                                                        >
                                                            <SelectTrigger className="first:flex-1 last:shrink-0">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {props.options?.map((option) => (
                                                                    <SelectItem
                                                                        disabled={option.disabled}
                                                                        key={option.value}
                                                                        value={String(option.value)}
                                                                    >
                                                                        {option.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    ),
                                                }}
                                                hideNavigation
                                                mode="single"
                                                month={month}
                                                onMonthChange={setMonth}
                                                onSelect={(date) => {
                                                    setPendingDateOfBirth(date);
                                                    setCalendarOpen(false);
                                                }}
                                                selected={pendingDateOfBirth}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setIsEditingDateOfBirth(false);
                                                setPendingDateOfBirth(undefined);
                                                setErrorMessage(null);
                                                setSuccessMessage(null);
                                            }}
                                            disabled={isSaving}
                                            className="flex-1 sm:flex-none border-gray-300 hover:bg-gray-50"
                                        >
                                            <X className="w-4 h-4 mr-1.5" />
                                            Hủy
                                        </Button>
                                        <Button
                                            variant="default"
                                            size="sm"
                                            onClick={async () => {
                                                setIsSaving(true);
                                                setErrorMessage(null);
                                                try {
                                                    const dateString = pendingDateOfBirth
                                                        ? pendingDateOfBirth.toISOString().split('T')[0]
                                                        : null;
                                                    const payload = buildProfilePayload({ birthday: dateString });
                                                    await updateUserProfile(payload);
                                                    await refreshProfile();
                                                    setSuccessMessage("Thông tin đã được cập nhật thành công!");
                                                    setIsEditingDateOfBirth(false);
                                                    setTimeout(() => setSuccessMessage(null), 3000);
                                                } catch (error) {
                                                    console.error("Failed to update birthday", error);
                                                    setErrorMessage("Không thể lưu thay đổi. Vui lòng thử lại.");
                                                } finally {
                                                    setIsSaving(false);
                                                }
                                            }}
                                            disabled={isSaving}
                                            className="flex-1 sm:flex-none bg-[#E04D30] hover:bg-[#c53b1d] text-white"
                                        >
                                            {isSaving ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1.5"></div>
                                                    Đang lưu...
                                                </>
                                            ) : (
                                                <>
                                                    <Check className="w-4 h-4 mr-1.5" />
                                                    Lưu
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-900 font-medium ml-11">
                                    {displayValue(user.dateOfBirth)}
                                </p>
                            )}
                        </dd>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileTab;

