import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form-input";
import CustomCheckbox from "@/components/ui/custom-checkbox";
import ToggleSwitch from "@/components/ui/toggle-switch";
import { Icon } from "@/components/icons";
import { AlertCircle, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import {
  createCategoryChild,
  disableAllCategories,
  enableAllCategories,
  getCategoryChildListByParent,
  updateCategoryChild,
} from "@/api/endpoints/attributeApi";
import type {
  CategoryChildResponse,
  CategoryChildUpdateRequest,
  CategoryParentResponse,
  CategoryStatus,
} from "@/types";

const PAGE_SIZE = 10;

type UpdateCategoryVariables = {
  payload: CategoryChildUpdateRequest;
  status: CategoryStatus;
  successMessage?: string;
};

type BulkStatusVariables = {
  ids: number[];
  status: CategoryStatus;
};

const getErrorMessage = (err: unknown) => {
  if (isAxiosError(err)) {
    return (
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      "Đã xảy ra lỗi"
    );
  }
  if (err instanceof Error) {
    return err.message;
  }
  return "Đã xảy ra lỗi, vui lòng thử lại.";
};

const AdminProductsCategoryDetail: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const parentCategoryId = Number(categoryId);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parentCategory =
    (location.state as { category?: CategoryParentResponse } | undefined)
      ?.category;

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [uploadingImageFor, setUploadingImageFor] = useState<number | null>(
    null
  );
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [pendingCategoryId, setPendingCategoryId] = useState<number | null>(
    null
  );
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [shouldFocusLastPage, setShouldFocusLastPage] = useState(false);

  const isParentIdValid = Number.isFinite(parentCategoryId);

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: [
      "category-child",
      parentCategoryId,
      { page: currentPage, size: PAGE_SIZE },
    ],
    queryFn: () =>
      getCategoryChildListByParent(parentCategoryId, {
        page: Math.max(currentPage - 1, 0),
        size: PAGE_SIZE,
      }),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
    enabled: isParentIdValid,
  });

  const categories = data?.categoryChildResponseList ?? [];
  const totalPages = Math.max(1, data?.totalPages ?? 1);
  const totalElements = data?.totalElements ?? categories.length;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (shouldFocusLastPage && data?.totalPages) {
      const lastPage = Math.max(1, data.totalPages);
      if (currentPage !== lastPage) {
        setCurrentPage(lastPage);
      }
      setShouldFocusLastPage(false);
    }
  }, [shouldFocusLastPage, currentPage, data?.totalPages]);

  useEffect(() => {
    setSelectedCategories((prev) =>
      prev.filter((id) => categories.some((cat) => cat.id === id))
    );
  }, [categories]);

  const updateCategoryMutation = useMutation({
    mutationFn: ({ payload, status }: UpdateCategoryVariables) =>
      updateCategoryChild(payload, status),
    onSuccess: (_res, variables) => {
      toast.success(
        variables.successMessage ?? "Cập nhật danh mục con thành công"
      );
      queryClient.invalidateQueries({
        queryKey: ["category-child", parentCategoryId],
      });
      setEditingId(null);
      setEditingName("");
      setUploadingImageFor(null);
    },
    onError: (err) => {
      toast.error(getErrorMessage(err));
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: createCategoryChild,
    onSuccess: () => {
      toast.success("Thêm danh mục con thành công");
      setShouldFocusLastPage(true);
      queryClient.invalidateQueries({
        queryKey: ["category-child", parentCategoryId],
      });
      setShowAddCategoryModal(false);
      setNewCategoryName("");
    },
    onError: (err) => {
      toast.error(getErrorMessage(err));
    },
  });

  const bulkStatusMutation = useMutation({
    mutationFn: ({ ids, status }: BulkStatusVariables) =>
      status === "ACTIVE"
        ? enableAllCategories({ getAll: ids })
        : disableAllCategories({ getAll: ids }),
    onSuccess: (_res, variables) => {
      const message =
        variables.status === "ACTIVE"
          ? `Đã kích hoạt ${variables.ids.length} danh mục con`
          : `Đã ngừng kích hoạt ${variables.ids.length} danh mục con`;
      toast.success(message);
      setSelectedCategories([]);
      queryClient.invalidateQueries({
        queryKey: ["category-child", parentCategoryId],
      });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err));
    },
  });

  const isMutating =
    updateCategoryMutation.isPending ||
    createCategoryMutation.isPending ||
    bulkStatusMutation.isPending;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCategories(categories.map((cat) => cat.id));
    } else {
      setSelectedCategories([]);
    }
  };

  const handleSelectCategory = (categoryId: number, checked: boolean) => {
    setSelectedCategories((prev) => {
      if (checked) {
        return prev.includes(categoryId) ? prev : [...prev, categoryId];
      }
      return prev.filter((id) => id !== categoryId);
    });
  };

  const handleToggleActive = async (category: CategoryChildResponse) => {
    setPendingCategoryId(category.id);
    try {
      await updateCategoryMutation.mutateAsync({
        payload: {
          id: category.id,
          name: category.name,
          imageUrl: category.imageUrl ?? "",
        },
        status: category.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
        successMessage:
          category.status === "ACTIVE"
            ? "Đã ngừng kích hoạt danh mục con"
            : "Đã kích hoạt danh mục con",
      });
    } finally {
      setPendingCategoryId(null);
    }
  };

  const handleEditName = (categoryId: number, currentName: string) => {
    setEditingId(categoryId);
    setEditingName(currentName);
  };

  const handleSaveName = async () => {
    if (!editingId) return;
    const target = categories.find((cat) => cat.id === editingId);
    if (!target || !editingName.trim()) {
      toast.error("Tên danh mục không được để trống");
      return;
    }
    setPendingCategoryId(target.id);
    try {
      await updateCategoryMutation.mutateAsync({
        payload: {
          id: target.id,
          name: editingName.trim(),
          imageUrl: target.imageUrl ?? "",
        },
        status: target.status,
        successMessage: "Đã cập nhật tên danh mục con",
      });
    } finally {
      setPendingCategoryId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleAddCategory = () => {
    setShowAddCategoryModal(true);
    setNewCategoryName("");
  };

  const handleCloseAddModal = () => {
    setShowAddCategoryModal(false);
    setNewCategoryName("");
  };

  const handleConfirmAddCategory = async () => {
    if (isAddingCategory) return;
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      toast.error("Vui lòng nhập tên danh mục con");
      return;
    }
    setIsAddingCategory(true);
    try {
      await createCategoryMutation.mutateAsync({
        name: trimmed,
        parentId: parentCategoryId,
      });
    } finally {
      setIsAddingCategory(false);
    }
  };

  const handleViewChildDetails = (childId: number) => {
    navigate(
      `/admin/products/categories/${parentCategoryId}/subcategories/${childId}`
    );
  };

  const handleBulkStatusChange = async (status: CategoryStatus) => {
    if (selectedCategories.length === 0) return;
    await bulkStatusMutation.mutateAsync({ ids: selectedCategories, status });
  };

  const handleImageClick = (categoryId: number) => {
    setUploadingImageFor(categoryId);
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || uploadingImageFor === null) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error(`${file.name} vượt quá dung lượng 2MB`);
      event.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error(`${file.name} không phải là file hình ảnh`);
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result;
      if (typeof result !== "string") return;
      const target = categories.find((cat) => cat.id === uploadingImageFor);
      if (!target) return;
      setPendingCategoryId(target.id);
      try {
        await updateCategoryMutation.mutateAsync({
          payload: {
            id: target.id,
            name: target.name,
            imageUrl: result,
          },
          status: target.status,
          successMessage: "Đã cập nhật hình ảnh danh mục con",
        });
      } finally {
        setPendingCategoryId(null);
        setUploadingImageFor(null);
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const displayRange = useMemo(() => {
    if (totalElements === 0) {
      return { start: 0, end: 0 };
    }
    const start = (currentPage - 1) * PAGE_SIZE + 1;
    const end = Math.min(currentPage * PAGE_SIZE, totalElements);
    return { start, end };
  }, [currentPage, totalElements]);

  if (!isParentIdValid) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p className="text-red-600 font-semibold">
          Không tìm thấy danh mục lớn hợp lệ.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 items-center w-full">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="cursor-pointer hover:opacity-70 transition-opacity"
          >
            <div className="w-[32px] h-[32px] flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 18 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17 5H1M1 5L5 1M1 5L5 9"
                  stroke="#737373"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </button>
          <div>
            <h1 className="font-bold text-[#272424] text-[24px] leading-normal">
              {parentCategory?.name ?? `Danh mục #${parentCategoryId}`}
            </h1>
          </div>
        </div>

        <Button
          onClick={handleAddCategory}
          className="h-[36px] px-4 flex items-center gap-2"
        >
          <span className="text-[18px] leading-none font-light">+</span>
          Thêm danh mục con
        </Button>
      </div>

      <div className="bg-white border border-[#b0b0b0] flex flex-col gap-[16px] items-start px-[24px] py-[24px] rounded-[24px] w-full">
        <div className="relative border-[0.5px] border-[#d1d1d1] flex flex-col items-start rounded-[24px] w-full overflow-hidden">
          <div className="bg-[#f6f6f6] flex items-center px-[15px] py-0 rounded-tl-[24px] rounded-tr-[24px] w-full min-h-[60px]">
            <div className="flex flex-row items-center w-full">
              <div className="flex gap-[8px] h-full items-center px-[5px] py-[14px] flex-1 min-w-[260px]">
                <CustomCheckbox
                  checked={
                    categories.length > 0 &&
                    selectedCategories.length === categories.length
                  }
                  onChange={handleSelectAll}
                />
                <span className="font-semibold text-[#272424] text-[14px] leading-[1.5] whitespace-nowrap">
                  {selectedCategories.length > 0
                    ? `Đã chọn ${selectedCategories.length} danh mục con`
                    : "Tên danh mục con"}
                </span>
                {selectedCategories.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      size="sm"
                      onClick={() => handleBulkStatusChange("ACTIVE")}
                      disabled={bulkStatusMutation.isPending}
                    >
                      Kích hoạt
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleBulkStatusChange("INACTIVE")}
                      disabled={bulkStatusMutation.isPending}
                    >
                      Ngừng kích hoạt
                    </Button>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-[80px_80px_auto] gap-[30px] items-center px-[5px] py-[14px] min-w-[325px]">
                <span
                  className={`font-semibold text-[#272424] text-[14px] leading-[1.5] text-center ${
                    selectedCategories.length > 0 ? "invisible" : ""
                  }`}
                >
                  SL sản phẩm
                </span>
                <span
                  className={`font-semibold text-[#272424] text-[14px] leading-[1.5] text-center ${
                    selectedCategories.length > 0 ? "invisible" : ""
                  }`}
                >
                  Bật/Tắt
                </span>
                <span
                  className={`font-semibold text-[#272424] text-[14px] leading-[1.5] ${
                    selectedCategories.length > 0 ? "invisible" : ""
                  } justify-self-end`}
                >
                  Thao tác
                </span>
              </div>
            </div>
          </div>

          {categories.map((category, index) => (
            <div
              key={category.id}
              className={`border-[0px_0px_1px] border-solid flex flex-col items-start justify-center px-[15px] py-0 w-full ${
                index === categories.length - 1
                  ? "border-transparent"
                  : "border-[#e7e7e7]"
              } ${
                selectedCategories.includes(category.id)
                  ? "bg-blue-50"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center w-full">
                <div className="flex flex-row items-center w-full">
                  <div className="flex gap-[8px] h-full items-center px-[5px] py-[14px] flex-1 min-w-[260px]">
                    <CustomCheckbox
                      checked={selectedCategories.includes(category.id)}
                      onChange={(checked) =>
                        handleSelectCategory(category.id, checked)
                      }
                    />
                    <div
                      className={`relative w-[60px] h-[60px] rounded-[8px] overflow-hidden flex-shrink-0 cursor-pointer ${
                        category.imageUrl
                          ? ""
                          : "bg-[#ffeeea] border-2 border-dashed border-[#e04d30]"
                      }`}
                      onClick={() => handleImageClick(category.id)}
                    >
                      {category.imageUrl ? (
                        <img
                          src={category.imageUrl}
                          alt={category.name}
                          className="w-full h-full object-cover rounded-[8px]"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Icon name="image" size={24} color="#e04d30" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      {editingId === category.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="flex-1 p-2 border-2 border-[#e04d30] rounded-[8px] text-[12px] font-semibold text-[#272424] font-montserrat outline-none focus:border-[#c43d20]"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleSaveName();
                              } else if (e.key === "Escape") {
                                handleCancelEdit();
                              }
                            }}
                          />
                          <button
                            onClick={handleSaveName}
                            className="w-8 h-8 flex items-center justify-center bg-[#e04d30] hover:bg-[#c43d20] rounded-[6px] transition-colors"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                            >
                              <path
                                d="M13.3334 4L6.00002 11.3333L2.66669 8"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="w-8 h-8 flex items-center justify-center bg-[#d1d1d1] hover:bg-[#b8b8bd] rounded-[6px] transition-colors"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                            >
                              <path
                                d="M12 4L4 12M4 4L12 12"
                                stroke="#272424"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="font-semibold text-[14px] text-[#272424] leading-[1.5]">
                            {category.name}
                          </span>
                          <button
                            onClick={() =>
                              handleEditName(category.id, category.name)
                            }
                            className="cursor-pointer hover:opacity-70 transition-opacity"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                            >
                              <path
                                d="M11.3334 2.00004C11.5085 1.82494 11.7163 1.68605 11.9451 1.59129C12.1739 1.49653 12.4191 1.44775 12.6667 1.44775C12.9143 1.44775 13.1595 1.49653 13.3883 1.59129C13.6171 1.68605 13.8249 1.82494 14 2.00004C14.1751 2.17513 14.314 2.38289 14.4088 2.61171C14.5036 2.84053 14.5523 3.08575 14.5523 3.33337C14.5523 3.58099 14.5036 3.82622 14.4088 4.05504C14.314 4.28386 14.1751 4.49161 14 4.66671L5.00004 13.6667L1.33337 14.6667L2.33337 11L11.3334 2.00004Z"
                                stroke="#1a71f6"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-[80px_80px_auto] gap-[30px] justify-items-center items-center px-[5px] py-[14px] min-w-[325px]">
                    <span className="font-semibold text-[#272424] text-[14px] leading-[1.5]">
                      {category.productCount ?? 0}
                    </span>
                    <ToggleSwitch
                      checked={category.status === "ACTIVE"}
                      onChange={() => handleToggleActive(category)}
                      disabled={isMutating || pendingCategoryId === category.id}
                    />
                    <button
                      onClick={() => handleViewChildDetails(category.id)}
                      className="font-bold text-[14px] text-[#1a71f6] leading-[1.5] hover:opacity-70 transition-opacity whitespace-nowrap justify-self-end"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {categories.length === 0 && !isLoading && !isFetching && !isError && (
            <div className="flex flex-col items-center justify-center py-10 text-[#737373] text-center w-full">
              <p className="font-semibold">Chưa có danh mục con nào.</p>
              <p className="text-sm">Hãy thêm danh mục con mới để bắt đầu.</p>
            </div>
          )}

          {(isLoading || isFetching) && (
            <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 text-[#e04d30] animate-spin" />
              <p className="text-sm font-semibold text-[#e04d30]">
                Đang tải danh mục con...
              </p>
            </div>
          )}

          {isError && (
            <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center gap-2 px-4 text-center">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <p className="font-semibold text-red-600">
                Không thể tải danh mục con
              </p>
              <p className="text-sm text-[#737373]">
                {getErrorMessage(error)}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white border border-[#e7e7e7] flex h-[48px] items-center justify-between px-[30px] py-[10px] rounded-[12px] w-full">
          <div className="flex flex-col font-normal justify-center text-[12px] text-[#737373]">
            <p className="leading-[1.5]">
              Đang hiển thị {displayRange.start} - {displayRange.end} trong tổng{" "}
              {totalElements} danh mục con | Trang {currentPage}/{totalPages}
            </p>
          </div>
          <div className="flex gap-[16px] items-center">
            <div className="flex gap-[13px] items-center">
              <div className="flex flex-col font-normal justify-center text-[12px] text-[#454545]">
                <p className="leading-[1.5]">Trang số</p>
              </div>
              <div className="flex gap-[2px] items-center pl-[8px] pr-[6px] py-[4px] rounded-[8px]">
                <div className="flex flex-col font-normal justify-center text-[12px] text-[#454545]">
                  <p className="leading-[1.5]">{currentPage}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-[6px] items-center">
              <div
                className={`border border-[#b0b0b0] flex items-center justify-center px-[6px] py-[4px] rounded-[8px] cursor-pointer hover:bg-gray-50 ${
                  currentPage <= 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handlePrevPage}
              >
                <ChevronLeft className="w-[20px] h-[20px] text-[#d1d1d1]" />
              </div>
              <div
                className={`border border-[#b0b0b0] flex items-center justify-center px-[6px] py-[4px] rounded-[8px] cursor-pointer hover:bg-gray-50 ${
                  currentPage >= totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={handleNextPage}
              >
                <ChevronRight className="w-[20px] h-[20px] text-[#454545]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {showAddCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            onClick={handleCloseAddModal}
          />
          <div
            className="relative z-50 bg-white rounded-[24px] p-[10px] w-full max-w-[400px] shadow-2xl animate-scaleIn flex flex-col gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-start justify-center px-3 py-2">
              <h2 className="text-[20px] font-bold text-[#272424] font-montserrat leading-normal text-center w-full">
                Thêm danh mục con
              </h2>
            </div>

            <div className="flex flex-col gap-1 items-start justify-center px-3">
              <label className="text-[14px] font-semibold text-[#272424] font-montserrat leading-[140%]">
                Tên danh mục con
              </label>
              <FormInput
                placeholder="Nhập tên danh mục con"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleConfirmAddCategory();
                  } else if (e.key === "Escape") {
                    e.preventDefault();
                    handleCloseAddModal();
                  }
                }}
              />
            </div>

            <div className="flex gap-[10px] items-center justify-end px-3">
              <Button variant="secondary" onClick={handleCloseAddModal}>
                Huỷ
              </Button>
              <Button
                type="button"
                onClick={handleConfirmAddCategory}
                disabled={isAddingCategory || createCategoryMutation.isPending}
              >
                {createCategoryMutation.isPending ? "Đang tạo..." : "Xác nhận"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsCategoryDetail;


