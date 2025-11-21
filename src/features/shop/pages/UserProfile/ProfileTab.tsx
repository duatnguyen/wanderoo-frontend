import React, { useState, useCallback } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
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
    }
> = {
    fullName: {
        label: "Họ và tên",
        type: "text",
        accessor: (user) => user?.name || "",
        payloadKey: "name",
    },
    email: {
        label: "Email",
        type: "email",
        accessor: (user) => user?.email || "",
        payloadKey: "email",
    },
    phone: {
        label: "Số điện thoại",
        type: "tel",
        accessor: (user) => user?.phone || "",
        payloadKey: "phone",
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

    const displayValue = (value?: string | null, placeholder = "Chưa có thông tin") => {
        if (!value || value.trim() === "" || value === "**/**/****") {
            return placeholder;
        }
        return value;
    };

    if (isLoading || !user) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-8">
                <div className="flex items-center justify-center">
                    <LoadingSpinner size="md" className="mr-3" />
                    <span className="text-gray-600">Đang tải thông tin hồ sơ...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 sm:p-5">

            {/* Header */}
            <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-1">Thông tin tài khoản</h2>
                <p className="text-sm text-gray-600">Cập nhật thông tin cá nhân và liên hệ của bạn</p>
            </div>

            {/* Messages */}
            {successMessage && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
                    {successMessage}
                </div>
            )}
            {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                    {errorMessage}
                </div>
            )}

            {/* Profile Fields */}
            <div className="space-y-4">
                {/* Username Field */}
                <div className="pb-3 border-b border-gray-100">
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Tên tài khoản</dt>
                    <dd className="text-sm text-gray-900 font-medium">@
                        {displayValue(user.username, "Không xác định")}
                    </dd>
                </div>

                {/* Editable Fields */}
                {(Object.keys(fieldConfig) as EditableField[]).map((field) => {
                    const config = fieldConfig[field];
                    const currentValue = config.accessor(user);
                    const isFieldEditing = editingField === field;

                    return (
                        <div key={field} className={`pb-3 border-b border-gray-100 ${isFieldEditing ? 'bg-gray-50 -mx-2 px-2 py-3 rounded-md' : ''}`}>
                            <div className="flex items-center justify-between mb-2">
                                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    {config.label}
                                </dt>
                                {!isFieldEditing && (
                                    <button
                                        onClick={() => beginEditingField(field)}
                                        className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
                                    >
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
                                            className="w-full"
                                            autoFocus
                                        />
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={cancelFieldEdit}
                                                disabled={isSaving}
                                                className="flex-1 sm:flex-none"
                                            >
                                                Hủy
                                            </Button>
                                            <Button
                                                variant="default"
                                                size="sm"
                                                onClick={() => void saveField()}
                                                disabled={isSaving || pendingValue === currentValue}
                                                className="flex-1 sm:flex-none"
                                            >
                                                {isSaving ? "Đang lưu..." : "Lưu"}
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-900 font-medium">
                                        {displayValue(currentValue)}
                                    </p>
                                )}
                            </dd>
                        </div>
                    );
                })}

                {/* Gender Field */}
                <div className={`pb-3 border-b border-gray-100 ${isEditingGender ? 'bg-gray-50 -mx-2 px-2 py-3 rounded-md' : ''}`}>
                    <div className="flex items-center justify-between mb-1">
                        <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Giới tính
                        </dt>
                        {!isEditingGender && (
                            <button
                                onClick={() => {
                                    const currentGender = user?.gender || "MALE";
                                    setPendingGender(currentGender as "MALE" | "FEMALE");
                                    setIsEditingGender(true);
                                }}
                                className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
                            >
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
                                <div className="flex flex-col sm:flex-row gap-2">
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
                                        className="flex-1 sm:flex-none"
                                    >
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
                                        className="flex-1 sm:flex-none"
                                    >
                                        {isSaving ? "Đang lưu..." : "Lưu"}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-900 font-medium">
                                {user.gender?.toUpperCase() === "FEMALE" ? "Nữ" : "Nam"}
                            </p>
                        )}
                    </dd>
                </div>

                {/* Date of Birth Field */}
                <div className={`pb-3 ${isEditingDateOfBirth ? 'bg-gray-50 -mx-2 px-2 py-3 rounded-md' : ''}`}>
                    <div className="flex items-center justify-between mb-1">
                        <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Ngày sinh
                        </dt>
                        {!isEditingDateOfBirth && (
                            <button
                                onClick={() => {
                                    const currentDateOfBirth = user?.dateOfBirth || "";
                                    setPendingDateOfBirth(currentDateOfBirth ? new Date(currentDateOfBirth) : undefined);
                                    setIsEditingDateOfBirth(true);
                                }}
                                className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
                            >
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
                                            className="w-full justify-start text-left font-normal"
                                            variant="outline"
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {pendingDateOfBirth ? format(pendingDateOfBirth, "PPP") : <span>Chọn ngày sinh</span>}
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
                                <div className="flex flex-col sm:flex-row gap-2">
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
                                        className="flex-1 sm:flex-none"
                                    >
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
                                        className="flex-1 sm:flex-none"
                                    >
                                        {isSaving ? "Đang lưu..." : "Lưu"}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-900 font-medium">
                                {displayValue(user.dateOfBirth)}
                            </p>
                        )}
                    </dd>
                </div>
            </div>
        </div>
    );
};

export default ProfileTab;

