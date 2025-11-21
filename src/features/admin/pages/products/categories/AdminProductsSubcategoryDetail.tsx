import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { Icon } from "@/components/icons";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import CustomCheckbox from "@/components/ui/custom-checkbox";
import { SearchBar } from "@/components/ui/search-bar";
import { Button } from "@/components/ui/button";
import {
  getCategoryChildListByParent,
  getCategoryParentList,
  updateCategoryChild,
} from "@/api/endpoints/attributeApi";
import {
  deleteProductPrivate,
  getProductsByCategoryPrivate,
} from "@/api/endpoints/productApi";
import type {
  CategoryChildResponse,
  CategoryParentResponse,
  CategoryStatus,
  ProductResponse,
} from "@/types";

type UpdateCategoryVariables = {
  payload: {
    id: number;
    name: string;
    imageUrl?: string;
  };
  status: CategoryStatus;
  successMessage?: string;
};

const DEFAULT_PAGE_SIZE = 200;
const PRODUCT_PAGE_SIZE = 10;

const AdminProductsSubcategoryDetail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { categoryId, subcategoryId } =
    useParams<{ categoryId: string; subcategoryId: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const parentCategoryId = Number(categoryId);
  const childCategoryId = Number(subcategoryId);
  const isIdsValid =
    Number.isFinite(parentCategoryId) && Number.isFinite(childCategoryId);

  const locationState = location.state as
    | {
        parentCategory?: CategoryParentResponse;
        childCategory?: CategoryChildResponse;
      }
    | undefined;

  const parentFromState = locationState?.parentCategory;
  const childFromState = locationState?.childCategory;

  const {
    data: parentFromQuery,
    isLoading: isParentLoading,
  } = useQuery({
    queryKey: ["category-parent", parentCategoryId],
    queryFn: () =>
      getCategoryParentList({ page: 1, size: DEFAULT_PAGE_SIZE }),
    select: (resp) =>
      resp.categories.find((parent) => parent.id === parentCategoryId),
    enabled: !parentFromState && Number.isFinite(parentCategoryId),
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });

  const {
    data: childFromQuery,
    isLoading: isChildLoading,
    isFetching: isChildFetching,
    isError: isChildError,
    error: childError,
  } = useQuery({
    queryKey: ["category-child-detail", parentCategoryId],
    queryFn: () =>
      getCategoryChildListByParent(parentCategoryId, {
        page: 0,
        size: DEFAULT_PAGE_SIZE,
      }),
    select: (resp) =>
      resp.categoryChildResponseList.find(
        (child) => child.id === childCategoryId
      ),
    enabled: Number.isFinite(parentCategoryId),
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });

  const parentCategory = parentFromState ?? parentFromQuery ?? null;
  const [subcategory, setSubcategory] = useState<CategoryChildResponse | null>(
    childFromState ?? null
  );

  useEffect(() => {
    if (childFromQuery) {
      setSubcategory(childFromQuery);
    }
  }, [childFromQuery]);

  const parentCategoryName = useMemo(() => {
    if (parentCategory?.name) {
      return parentCategory.name;
    }
    if (parentCategoryId && Number.isFinite(parentCategoryId)) {
      return `Danh mục #${parentCategoryId}`;
    }
    return "Danh mục";
  }, [parentCategory, parentCategoryId]);

  const [isEditingName, setIsEditingName] = useState(false);
  const [editingName, setEditingName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (subcategory && !isEditingName) {
      setEditingName(subcategory.name ?? "");
    }
  }, [subcategory, isEditingName]);

  const childQueryKey = useMemo(
    () => ["category-child-detail", parentCategoryId],
    [parentCategoryId]
  );

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

  const updateCategoryMutation = useMutation({
    mutationFn: ({ payload, status }: UpdateCategoryVariables) =>
      updateCategoryChild(payload, status),
    onSuccess: (_res, variables) => {
      toast.success(
        variables.successMessage ?? "Cập nhật danh mục con thành công"
      );
      queryClient.invalidateQueries({ queryKey: childQueryKey });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err));
    },
  });

  const normalizedSearch = searchQuery.trim();

  const deleteProductMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      await Promise.all(ids.map((id) => deleteProductPrivate(id)));
    },
    onSuccess: (_res, ids) => {
      const message =
        ids.length === 1
          ? "Đã xoá 1 sản phẩm"
          : `Đã xoá ${ids.length} sản phẩm`;
      toast.success(message);
      setSelectedProducts((prev) =>
        prev.filter((id) => !ids.includes(id))
      );
      queryClient.invalidateQueries({
        queryKey: ["category-products", childCategoryId],
      });
      queryClient.invalidateQueries({
        queryKey: ["category-child-detail", parentCategoryId],
      });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err));
    },
  });

  const isProductMutating = deleteProductMutation.isPending;

  const {
    data: productPage,
    isLoading: isProductLoading,
    isFetching: isProductFetching,
    isError: isProductError,
    error: productError,
  } = useQuery({
    queryKey: [
      "category-products",
      childCategoryId,
      currentPage,
      normalizedSearch,
    ],
    queryFn: () =>
      getProductsByCategoryPrivate(childCategoryId, {
        page: Math.max(currentPage - 1, 0),
        size: PRODUCT_PAGE_SIZE,
        keyword: normalizedSearch || undefined,
      }),
    enabled: Number.isFinite(childCategoryId),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  const products: ProductResponse[] = productPage?.productResponseList ?? [];
  const totalProducts =
    productPage?.totalElements ?? subcategory?.productCount ?? 0;
  const totalProductPages = Math.max(1, productPage?.totalPages ?? 1);

  useEffect(() => {
    if (currentPage > totalProductPages) {
      setCurrentPage(totalProductPages);
    }
  }, [currentPage, totalProductPages]);

  useEffect(() => {
    setSelectedProducts((prev) => {
      const validIds = prev.filter((id) =>
        products.some((product) => product.id === id)
      );
      const isSameLength = validIds.length === prev.length;
      const isSameOrder = isSameLength
        ? validIds.every((id, index) => id === prev[index])
        : false;
      return isSameOrder ? prev : validIds;
    });
  }, [products]);

  const displayRange = useMemo(() => {
    if (!products.length) {
      return { start: 0, end: 0 };
    }
    const start = (currentPage - 1) * PRODUCT_PAGE_SIZE + 1;
    const end = start + products.length - 1;
    return { start, end };
  }, [currentPage, products.length]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products.map((p) => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: number, checked: boolean) => {
    setSelectedProducts((prev) => {
      if (checked) {
        return prev.includes(productId) ? prev : [...prev, productId];
      }
      return prev.filter((id) => id !== productId);
    });
  };

  const handleEditName = () => {
    if (!subcategory) return;
    setIsEditingName(true);
    setEditingName(subcategory.name);
  };

  const handleSaveName = async () => {
    if (!subcategory) return;
    const trimmed = editingName.trim();
    if (!trimmed) {
      toast.error("Tên danh mục không được để trống");
      return;
    }
    try {
      await updateCategoryMutation.mutateAsync({
        payload: {
          id: subcategory.id,
          name: trimmed,
          imageUrl: subcategory.imageUrl ?? "",
        },
        status: subcategory.status,
        successMessage: "Đã cập nhật tên danh mục con",
      });
      setIsEditingName(false);
    } catch (error) {
      // handled
    }
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setEditingName(subcategory?.name ?? "");
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !subcategory) return;

    if (file.size > 2 * 1024 * 1024) {
      alert(`${file.name} vượt quá dung lượng 2MB`);
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert(`${file.name} không phải là file hình ảnh`);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result;
      if (result && typeof result === "string") {
        try {
          await updateCategoryMutation.mutateAsync({
            payload: {
              id: subcategory.id,
              name: subcategory.name,
              imageUrl: result,
            },
            status: subcategory.status,
            successMessage: "Đã cập nhật hình ảnh danh mục con",
          });
        } catch (error) {
          // handled
        }
      }
    };
    reader.readAsDataURL(file);

    event.target.value = "";
  };

  const handleDeleteProduct = async (productId: number) => {
    if (isProductMutating) return;
    const confirmed = window.confirm("Bạn có chắc muốn xoá sản phẩm này?");
    if (!confirmed) return;
    await deleteProductMutation.mutateAsync([productId]);
  };

  const handleDeleteSelected = async () => {
    if (selectedProducts.length === 0 || isProductMutating) return;
    const confirmed = window.confirm(
      `Bạn có chắc muốn xoá ${selectedProducts.length} sản phẩm đã chọn?`
    );
    if (!confirmed) return;
    await deleteProductMutation.mutateAsync(selectedProducts);
    setSelectedProducts([]);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalProductPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center px-0 w-full">
      {/* Header */}
      <div className="flex flex-col gap-[8px] h-[29px] items-start justify-center w-full">
        <div className="flex gap-[30px] items-center w-full">
          <div className="flex gap-[8px] items-center">
            <button
              onClick={() => navigate(-1)}
              className="cursor-pointer hover:opacity-70 transition-opacity"
            >
              <div className="w-[24px] h-[24px] flex items-center justify-center rotate-180 scale-y-[-100%]">
                <svg
                  width="18"
                  height="10"
                  viewBox="0 0 18 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 5H17M17 5L13 1M17 5L13 9"
                    stroke="#737373"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </button>
            <div className="flex gap-[4px] items-center justify-center">
              <h1 className="font-bold text-[24px] text-[#272424] leading-[normal]">
                {parentCategoryName}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Subcategory Info Card */}
      <div className="bg-white border-2 border-[#e7e7e7] rounded-[24px] p-[24px] flex gap-[16px] items-start w-full">
        {/* Image Upload */}
        <div
          onClick={handleImageClick}
          className={`bg-[#ffeeea] border-2 border-dashed border-[#e04d30] rounded-[8px] w-[100px] h-[100px] flex flex-col items-center justify-center gap-[8px] cursor-pointer hover:bg-[#ffe4dd] transition-colors flex-shrink-0 ${
            subcategory?.imageUrl ? "" : "p-[20px]"
          }`}
        >
          {subcategory?.imageUrl ? (
            <img
              src={subcategory.imageUrl}
              alt={subcategory?.name}
              className="w-full h-full object-cover rounded-[8px]"
            />
          ) : (
            <>
              <Icon name="image" size={32} color="#e04d30" />
              <p className="text-[10px] font-medium text-[#737373] text-center leading-[1.4]">
                Thêm hình ảnh
              </p>
            </>
          )}
        </div>

        {/* Subcategory Details */}
        <div className="flex flex-col items-start justify-between flex-1">
          <div className="flex gap-[8px] items-start w-[282px]">
            <div className="flex gap-[8px] items-center">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="px-3 py-1 border-2 border-[#e04d30] rounded-[8px] text-[20px] font-bold text-[#272424] outline-none focus:border-[#c43d20]"
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
                    className="w-6 h-6 flex items-center justify-center bg-[#e04d30] hover:bg-[#c43d20] rounded-[4px] transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
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
                    className="w-6 h-6 flex items-center justify-center bg-[#d1d1d1] hover:bg-[#b8b8bd] rounded-[4px] transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
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
                  <h2 className="font-bold text-[20px] text-[#272424] leading-[normal]">
                    {subcategory?.name ?? `Danh mục #${childCategoryId}`}
                  </h2>
                  <button
                    onClick={handleEditName}
                    className="cursor-pointer hover:opacity-70 transition-opacity"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17 3C17.2626 2.73735 17.5744 2.52901 17.9176 2.38687C18.2608 2.24473 18.6286 2.17157 19 2.17157C19.3714 2.17157 19.7392 2.24473 20.0824 2.38687C20.4256 2.52901 20.7374 2.73735 21 3C21.2626 3.26264 21.471 3.57444 21.6131 3.9176C21.7553 4.26077 21.8284 4.62856 21.8284 5C21.8284 5.37143 21.7553 5.73923 21.6131 6.08239C21.471 6.42555 21.2626 6.73735 21 7L7.5 20.5L2 22L3.5 16.5L17 3Z"
                        stroke="#1a71f6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
          <p className="font-medium text-[14px] text-[#272424] leading-[1.4]">
            Sản phẩm: {totalProducts}
          </p>
        </div>

      </div>

      {/* Products List Section */}
        <div className="bg-white border-2 border-[#e7e7e7] rounded-[24px] p-[24px] flex flex-col gap-[16px] items-start w-full relative">
        <h2 className="font-bold text-[20px] text-[#272424] leading-[normal]">
          Danh sách sản phẩm
        </h2>

        {/* Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:justify-start w-full">
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Tìm kiếm"
            className="w-full sm:w-[500px] h-[40px]"
          />
        </div>

          {/* Products Table */}
        <div className="bg-white border border-[#e7e7e7] rounded-[16px] w-full overflow-hidden">
          {/* Table Header */}
          <div className="flex items-center w-full">
            <div className="bg-[#f6f6f6] border-b border-[#e7e7e7] h-[50px] flex gap-[10px] items-center overflow-clip px-[12px] py-[15px] rounded-tl-[12px]">
              <CustomCheckbox
                checked={
                  products.length > 0 &&
                  selectedProducts.length === products.length
                }
                onChange={handleSelectAll}
                disabled={isProductMutating}
              />
            </div>
            <div className="bg-[#f6f6f6] border-b border-[#e7e7e7] h-[50px] flex gap-[10px] items-center overflow-clip px-[12px] py-[15px] w-[400px]">
              {selectedProducts.length > 0 ? (
                <>
                  <span className="font-semibold text-[14px] text-[#272424] leading-[1.4]">
                    Đã chọn {selectedProducts.length} sản phẩm
                  </span>
                  <Button
                    variant="secondary"
                    onClick={handleDeleteSelected}
                    className="h-[36px] ml-2"
                    disabled={isProductMutating}
                  >
                    Xóa
                  </Button>
                </>
              ) : (
                <p className="font-semibold text-[14px] text-[#272424] leading-[1.4]">
                  Tên sản phẩm
                </p>
              )}
            </div>
            <div className="bg-[#f6f6f6] border-b border-[#e7e7e7] h-[50px] flex gap-[4px] items-center justify-end px-[24px] py-[15px] flex-1 rounded-tr-[12px]">
              <p
                className={`font-semibold text-[14px] text-[#272424] leading-[1.4] ${
                  selectedProducts.length > 0 ? "invisible" : ""
                }`}
              >
                Thao tác
              </p>
            </div>
          </div>

          {/* Table Body */}
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center border-t border-[#d1d1d1] w-full"
            >
              <div className="flex flex-col gap-[8px] items-center justify-center p-[12px]">
                <CustomCheckbox
                  checked={selectedProducts.includes(product.id)}
                  onChange={(checked) =>
                    handleSelectProduct(product.id, checked)
                  }
                  disabled={isProductMutating}
                />
              </div>
              <div className="flex gap-[8px] items-center overflow-clip px-[12px] py-[14px] w-[400px]">
                <div className="border-[0.5px] border-[#d1d1d1] rounded-[8px] w-[60px] h-[60px] flex-shrink-0">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-[8px]"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#f6f6f6] rounded-[8px]" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[14px] text-[#272424] leading-[1.4]">
                    {product.name}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end justify-center px-[18px] py-[12px] flex-1 pr-[24px]">
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="font-bold text-[14px] text-[#1a71f6] leading-[normal] hover:opacity-70 transition-opacity"
                  disabled={isProductMutating}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}

          {products.length === 0 &&
            !(isProductLoading || isProductFetching) &&
            !isProductError && (
              <div className="flex flex-col items-center justify-center py-10 text-[#737373]">
                <p className="font-semibold">Chưa có sản phẩm nào.</p>
                <p className="text-sm">Hãy thêm sản phẩm vào danh mục này.</p>
              </div>
            )}
          {(isChildLoading ||
            isChildFetching ||
            isParentLoading ||
            isProductLoading ||
            isProductFetching) && (
            <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center gap-2 rounded-[12px]">
              <Loader2 className="w-6 h-6 text-[#e04d30] animate-spin" />
              <p className="text-sm font-semibold text-[#e04d30]">
                Đang tải dữ liệu danh mục con...
              </p>
            </div>
          )}

          {(isChildError || isProductError) && (
            <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center gap-2 px-4 text-center rounded-[12px]">
              <p className="font-semibold text-red-600">
                Không thể tải danh mục con
              </p>
              <p className="text-sm text-[#737373]">
                {getErrorMessage(childError || productError)}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="bg-white border border-[#e7e7e7] flex h-[48px] items-center justify-between px-[30px] py-[10px] rounded-[12px] w-full">
          <div className="flex gap-[3px] items-start">
            <p className="font-normal text-[12px] text-[#272424] leading-[1.5]">
              Đang hiển thị{" "}
              {displayRange.start === 0 && displayRange.end === 0
                ? "0 - 0"
                : `${displayRange.start} - ${displayRange.end}`}{" "}
              trong tổng {totalProducts} sản phẩm | Trang {currentPage}/
              {totalProductPages}
            </p>
          </div>
          <div className="flex gap-[16px] items-start">
            <div className="flex gap-[13px] items-center">
              <p className="font-normal text-[12px] text-[#272424] leading-[1.5]">
                Trang số
              </p>
              <div className="flex gap-[2px] items-center pl-[8px] pr-[6px] py-[4px] rounded-[8px]">
                <p className="font-normal text-[12px] text-[#272424] leading-[1.5]">
                  {currentPage}
                </p>
              </div>
            </div>
            <div className="flex gap-[6px] items-start">
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
                  currentPage >= totalProductPages
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

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
};

export default AdminProductsSubcategoryDetail;

