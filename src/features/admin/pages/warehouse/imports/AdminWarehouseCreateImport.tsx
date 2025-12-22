import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Icon from "@/components/icons/Icon";
import { Pagination } from "@/components/ui/pagination";
import { Package } from "lucide-react";
import { getImageUrl } from "@/utils/imageUtils";
import {
  searchInvoiceProducts,
  getProviderList,
  createImportInvoice,
  createExportInvoice,
} from "@/api/endpoints/warehouseApi";
import type {
  ProductInvoiceResponse,
  ProviderResponse,
  ProviderPageResponse,
  ProductInvoicePageResponse,
  InvoiceCheckOutRequest,
} from "@/types/warehouse";

interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image?: string | null;
  availableStock?: number | null;
}

const AdminWarehouseCreateImport = () => {
  const PRODUCT_PAGE_SIZE = 8;

  const navigate = useNavigate();
  const location = useLocation();
  const isExportMode = location.pathname.includes("/warehouse/exports");
  const pageTitle = isExportMode ? "Tạo đơn xuất hàng" : "Tạo đơn nhập hàng";
  const invoiceTypeLabel = isExportMode ? "xuất" : "nhập";
  const providerAmountLabel = isExportMode
    ? "Tổng tiền phải thu"
    : "Tiền cần trả nhà cung cấp";
  const listPath = isExportMode ? "/admin/warehouse/exports" : "/admin/warehouse/imports";
  const detailPath = isExportMode ? "/admin/warehouse/exports" : "/admin/warehouse/imports";
  const [supplierSearch, setSupplierSearch] = useState("");
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [supplierSearchInput, setSupplierSearchInput] = useState("");
  const [debouncedSupplierSearch, setDebouncedSupplierSearch] = useState("");
  const [supplierPage, setSupplierPage] = useState(1);
  const [selectedSupplier, setSelectedSupplier] = useState<ProviderResponse | null>(null);
  const [highlightedSupplierId, setHighlightedSupplierId] = useState<number | null>(null);
  const [productFormSearch, setProductFormSearch] = useState("");
  const [debouncedProductSearch, setDebouncedProductSearch] = useState("");
  const [productSearchPage, setProductSearchPage] = useState(1);
  const [note, setNote] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<
    Record<number, ProductInvoiceResponse>
  >({});

  const totalQuantityLocal = products.reduce<number>(
    (sum, product: Product) => sum + product.quantity,
    0
  );
  const totalAmount = products.reduce<number>(
    (sum, product: Product) => sum + product.quantity * product.price,
    0
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedProductSearch(productFormSearch.trim());
      setProductSearchPage(1);
    }, 400);

    return () => clearTimeout(handler);
  }, [productFormSearch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSupplierSearch(supplierSearchInput.trim());
      setSupplierPage(1);
    }, 400);

    return () => clearTimeout(handler);
  }, [supplierSearchInput]);


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(amount)
      .replace(/\s/g, "")
      .replace(/₫/g, "đ");
  };

  const buildAttributeText = (
    attributes?: ProductInvoiceResponse["attribute"]
  ) => {
    if (!attributes || attributes.length === 0) {
      return "";
    }

    return attributes
      .map((attr) => {
        if (!attr) return null;
        const name = attr.name?.trim();
        const value = attr.value?.trim();
        if (name && value) {
          return `${name}: ${value}`;
        }
        return name || value || null;
      })
      .filter((text): text is string => Boolean(text && text.trim().length))
      .join(" • ");
  };

  const formatPriceDisplay = (value?: number | null) => {
    if (value === null || value === undefined) {
      return "—";
    }
    return formatCurrency(value);
  };

  const productQuery = useQuery<ProductInvoicePageResponse, Error>({
    queryKey: [
      "invoice-products",
      debouncedProductSearch,
      productSearchPage,
      PRODUCT_PAGE_SIZE,
    ],
    queryFn: () =>
      searchInvoiceProducts(
        debouncedProductSearch,
        productSearchPage,
        PRODUCT_PAGE_SIZE
      ),
    enabled: isProductFormOpen,
    staleTime: 0,
    retry: 1,
  });

  const productModalList = productQuery.data?.productInvoices ?? [];
  const modalTotalPages = productQuery.data?.totalPages ?? 0;
  const modalTotalElements = productQuery.data?.totalElements ?? 0;
  const modalCurrentPage = productSearchPage;
  const isModalLoading = productQuery.isLoading || productQuery.isFetching;
  const hasModalError = productQuery.isError;
  const isModalEmpty =
    !isModalLoading && !hasModalError && productModalList.length === 0;

  const supplierQuery = useQuery<ProviderPageResponse, Error>({
    queryKey: ["invoice-suppliers", debouncedSupplierSearch, supplierPage],
    queryFn: () =>
      getProviderList(
        debouncedSupplierSearch || undefined,
        undefined,
        supplierPage,
        10
      ),
    enabled: isSupplierModalOpen,
    staleTime: 0,
    retry: 1,
  });

  useEffect(() => {
    if (productQuery.isError && productQuery.error) {
      const message = isAxiosError(productQuery.error)
        ? productQuery.error.response?.data?.message ||
        "Không thể tải danh sách sản phẩm"
        : "Không thể tải danh sách sản phẩm";
      toast.error(message);
    }
  }, [productQuery.isError, productQuery.error]);

  useEffect(() => {
    if (supplierQuery.isError) {
      toast.error("Không thể tải danh sách nhà cung cấp");
    }
  }, [supplierQuery.isError]);

  const supplierList = supplierQuery.data?.providers ?? [];
  const supplierTotalPages = supplierQuery.data?.totalPages ?? 0;
  const supplierLoading = supplierQuery.isLoading || supplierQuery.isFetching;
  const supplierHasError = supplierQuery.isError;
  const supplierEmpty =
    !supplierLoading && !supplierHasError && supplierList.length === 0;

  const createInvoiceMutation = useMutation({
    mutationFn: (payload: InvoiceCheckOutRequest) =>
      isExportMode ? createExportInvoice(payload) : createImportInvoice(payload),
    onSuccess: (invoiceId) => {
      toast.success(
        `Tạo phiếu ${invoiceTypeLabel} thành công`
      );
      navigate(`${detailPath}/${invoiceId}`);
    },
    onError: (error) => {
      const message = isAxiosError(error)
        ? error.response?.data?.message ||
        `Không thể tạo hóa đơn ${invoiceTypeLabel}`
        : `Không thể tạo hóa đơn ${invoiceTypeLabel}`;
      toast.error(message);
    },
  });

  const selectedOnPageCount = useMemo(
    () =>
      productModalList.reduce<number>(
        (count, product: ProductInvoiceResponse) =>
          count + (selectedProducts[product.id] ? 1 : 0),
        0
      ),
    [productModalList, selectedProducts]
  );

  const isSelectAllChecked =
    productModalList.length > 0 &&
    selectedOnPageCount === productModalList.length;
  const isSelectAllIndeterminate =
    selectedOnPageCount > 0 && selectedOnPageCount < productModalList.length;
  const selectAllState = isSelectAllChecked
    ? true
    : isSelectAllIndeterminate
      ? "indeterminate"
      : false;

  const handleToggleSelectAllCurrentPage = (checked: boolean) => {
    setSelectedProducts((prev) => {
      const updated = { ...prev };
      if (checked) {
        productModalList.forEach((product: ProductInvoiceResponse) => {
          updated[product.id] = product;
        });
      } else {
        productModalList.forEach((product: ProductInvoiceResponse) => {
          delete updated[product.id];
        });
      }
      return updated;
    });
  };

  const handleCloseProductModal = useCallback(() => {
    setIsProductFormOpen(false);
    setSelectedProducts({});
    setProductFormSearch("");
    setProductSearchPage(1);
    setDebouncedProductSearch("");
  }, []);

  const handleOpenSupplierModal = () => {
    setIsSupplierModalOpen(true);
    setSupplierSearchInput("");
    setSupplierPage(1);
    setHighlightedSupplierId(selectedSupplier?.id ?? null);
  };

  const handleCloseSupplierModal = () => {
    setIsSupplierModalOpen(false);
    setHighlightedSupplierId(selectedSupplier?.id ?? null);
  };

  const handleConfirmSupplierSelection = () => {
    if (!highlightedSupplierId) {
      toast.error("Vui lòng chọn nhà cung cấp");
      return;
    }
    const supplier = supplierList.find(
      (item: ProviderResponse) => item.id === highlightedSupplierId
    );
    if (!supplier) {
      toast.error("Không tìm thấy nhà cung cấp đã chọn");
      return;
    }
    setSelectedSupplier(supplier);
    setSupplierSearch(supplier.name);
    setIsSupplierModalOpen(false);
  };

  const buildInvoicePayload = (): InvoiceCheckOutRequest | null => {
    if (!selectedSupplier) {
      toast.error("Vui lòng chọn nhà cung cấp");
      return null;
    }

    if (!note.trim()) {
      toast.error("Vui lòng nhập ghi chú");
      return null;
    }

    if (products.length === 0) {
      toast.error("Vui lòng thêm ít nhất một sản phẩm");
      return null;
    }

    const invalidProduct = products.find(
      (product: Product) => !product.quantity || product.quantity <= 0
    );
    if (invalidProduct) {
      toast.error("Số lượng sản phẩm phải lớn hơn 0");
      return null;
    }

    return {
      providerId: selectedSupplier.id,
      note: note.trim(),
      cartItems: products.map((product: Product) => ({
        productDetailId: product.id,
        quantity: product.quantity,
      })),
    };
  };

  const handleCancel = () => {
    navigate(listPath);
  };

  const handleConfirm = async () => {
    const payload = buildInvoicePayload();
    if (!payload) {
      return;
    }
    await createInvoiceMutation.mutateAsync(payload);
  };

  const toggleProductSelection = (product: ProductInvoiceResponse) => {
    setSelectedProducts((prev) => {
      const updated = { ...prev };
      if (updated[product.id]) {
        delete updated[product.id];
      } else {
        updated[product.id] = product;
      }
      return updated;
    });
  };

  const handleAddProducts = () => {
    const selectedList = Object.values(selectedProducts);

    if (selectedList.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sản phẩm");
      return;
    }

    const newProducts = selectedList
      .filter((product: ProductInvoiceResponse) => !products.some((p) => p.id === product.id))
      .map((product: ProductInvoiceResponse) => ({
        id: product.id,
        name: product.productName,
        quantity: 1,
        price: product.importPrice ?? 0,
        image: product.imageUrl ? (getImageUrl(product.imageUrl) || product.imageUrl) : null,
        availableStock: product.totalQuantity ?? 0,
      }));

    if (newProducts.length === 0) {
      toast.info("Tất cả sản phẩm đã có trong danh sách");
    } else {
      setProducts((prev) => [...prev, ...newProducts]);
      toast.success("Đã thêm sản phẩm vào danh sách");
    }

    handleCloseProductModal();
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    setProducts((prev) =>
      prev.map((product: Product) =>
        product.id === productId
          ? { ...product, quantity: Math.max(1, quantity) }
          : product
      )
    );
  };

  const handleRemoveProduct = (productId: number) => {
    setProducts((prev) => prev.filter((product: Product) => product.id !== productId));
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isProductFormOpen) {
          handleCloseProductModal();
        }
        if (isSupplierModalOpen) {
          handleCloseSupplierModal();
        }
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [handleCloseProductModal, handleCloseSupplierModal, isProductFormOpen, isSupplierModalOpen]);

  const isCreatingInvoice = createInvoiceMutation.isPending;
  const summaryTotalQuantity = totalQuantityLocal;
  const summaryTotalAmount = totalAmount;
  useEffect(() => {
    document.title = `${pageTitle} | Wanderoo`;
  }, [pageTitle]);

  return (
    <div className="box-border flex flex-col gap-[10px] items-start px-4 pt-0 pb-[32px] relative w-full max-w-[1130px] mx-auto overflow-x-auto overflow-y-auto table-scroll-container">
      {/* Header */}
      <div className="box-border flex flex-col gap-[8px] items-start justify-center px-0 pb-[10px] relative shrink-0 w-full min-w-[1000px]">
        <div className="flex items-center gap-[8px] relative shrink-0 w-full">
          <button
            onClick={() => navigate("/admin/warehouse/imports")}
            className="relative shrink-0 size-[24px] flex items-center justify-center cursor-pointer"
          >
            <div className="flex items-center justify-center">
              <svg
                width="18"
                height="10"
                viewBox="0 0 18 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="rotate-180"
              >
                <path
                  d="M1 5H17M17 5L13 1M17 5L13 9"
                  stroke="#737373"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </button>
          <h1 className="font-['Montserrat'] font-bold text-[24px] text-[#272424] leading-normal">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-[12px] h-[700px] items-start relative rounded-lg flex-shrink-0 w-full -mt-[10px] min-w-[1000px]">
        {/* Left Column */}
        <div className="flex flex-col gap-[12px] h-full items-start relative flex-shrink-0 w-full lg:w-[695px] min-w-[650px]">
          {/* Products Section */}
          <div className="basis-0 bg-white border border-[#d1d1d1] box-border flex flex-col gap-[8px] grow items-start min-h-px min-w-px px-[24px] py-[16px] relative rounded-lg flex-shrink-0 w-full min-w-[600px]">
            <div className="flex items-center justify-between gap-[10px] relative shrink-0 w-full">
              <p className="font-['Montserrat'] font-semibold leading-[1.4] relative shrink-0 text-[#272424] text-[16px]">
                Sản phẩm
              </p>
              <Button
                variant="secondary"
                onClick={() => setIsProductFormOpen(true)}
                className="bg-white text-[#e04d30] border-2 border-[#e04d30] hover:bg-[#e04d30] hover:text-white transition-colors h-[40px] px-6 flex items-center gap-2 flex-shrink-0"
              >
                <Icon name="plus" size={18} color="currentColor" strokeWidth={2.5} />
                <span className="font-['Montserrat'] font-semibold text-[14px]">
                  Thêm sản phẩm
                </span>
              </Button>
            </div>

            {/* Products Table */}
            {products.length > 0 && (
              <div className="w-[calc(100%+48px)] mt-4 -mx-[24px]">
                {/* Table Header */}
                <div className="bg-[#f6f6f6] border-b border-[#d1d1d1] flex items-center py-[14px] pl-[24px] pr-0">
                  <div className="flex-[2] min-w-0 font-['Montserrat'] font-semibold text-[14px] text-[#272424]">
                    Sản phẩm
                  </div>
                  <div className="flex-1 font-['Montserrat'] font-semibold text-[14px] text-[#272424] text-center">
                    Số lượng
                  </div>
                  <div className="flex-1 font-['Montserrat'] font-semibold text-[14px] text-[#272424] text-center">
                    Đơn giá
                  </div>
                  <div className="flex-1 font-['Montserrat'] font-semibold text-[14px] text-[#272424] text-center">
                    Thành tiền
                  </div>
                  <div className="w-[40px] flex-shrink-0 flex justify-center pr-[8px]"></div>
                </div>

                {/* Products List */}
                <div className="flex flex-col">
                  {products.length > 0 ? (
                    products.map((product) => (
                      <div
                        key={product.id}
                        className="border-b border-[#e7e7e7] flex items-center py-[14px] pl-[24px] pr-0 hover:bg-gray-50"
                      >
                        {/* Product Info */}
                        <div className="flex-[2] min-w-0 flex items-start gap-3">
                          <div className="h-[38px] w-[38px] bg-gray-100 rounded-lg flex items-center justify-center shrink-0 border border-gray-200 overflow-hidden relative">
                            {product.image ? (
                              <img
                                src={getImageUrl(product.image) || product.image}
                                alt={product.name}
                                className="h-full w-full object-cover"
                                loading="lazy"
                                onError={(e) => {
                                  const target = e.currentTarget as HTMLImageElement;
                                  if (target.dataset.fallbackApplied === "true") {
                                    return;
                                  }
                                  target.dataset.fallbackApplied = "true";
                                  target.style.display = "none";
                                  const fallback = target.parentElement?.querySelector('.fallback-placeholder') as HTMLElement;
                                  if (fallback) {
                                    fallback.style.display = "flex";
                                  }
                                }}
                              />
                            ) : null}
                            <div 
                              className="fallback-placeholder w-full h-full flex items-center justify-center"
                              style={{ display: product.image ? 'none' : 'flex' }}
                            >
                              <Package className="w-5 h-5 text-gray-400" />
                            </div>
                          </div>
                          <span className="font-['Montserrat'] font-normal text-[14px] text-[#272424] truncate min-w-0">
                            {product.name}
                          </span>
                        </div>

                        {/* Quantity */}
                        <div className="flex-1 flex justify-center">
                          <input
                            type="number"
                            value={product.quantity}
                            onChange={(e) =>
                              handleUpdateQuantity(
                                product.id,
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="w-20 text-center border border-[#d1d1d1] rounded px-2 py-1 text-[12px] font-['Montserrat'] focus:border-[#e04d30] focus:outline-none"
                            min="1"
                          />
                        </div>

                        {/* Unit Price */}
                        <div className="flex-1 flex justify-center">
                          <span className="font-['Montserrat'] font-semibold text-[14px] text-[#272424]">
                            {formatCurrency(product.price)}
                          </span>
                        </div>

                        {/* Total Amount */}
                        <div className="flex-1 flex justify-center">
                          <span className="font-['Montserrat'] font-semibold text-[14px] text-[#272424]">
                            {formatCurrency(product.quantity * product.price)}
                          </span>
                        </div>

                        {/* Remove Button */}
                        <div className="w-[40px] flex-shrink-0 flex justify-center pr-[8px]">
                          <button
                            onClick={() => handleRemoveProduct(product.id)}
                            className="text-[#737373] hover:text-[#4a4a4a] cursor-pointer text-[28px] font-normal leading-none"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#d1d5db]">
                          <path d="M20 7h-4m0 0V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2m0 0H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z"></path>
                        </svg>
                        <div>
                          <p className="font-['Montserrat'] font-medium text-[15px] text-[#272424] mb-1">
                            Chưa có sản phẩm nào
                          </p>
                          <p className="font-['Montserrat'] text-[13px] text-[#737373]">
                            Nhấn nút "Thêm sản phẩm" để bắt đầu
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Payment Section */}
          <div className="bg-white border border-[#d1d1d1] box-border flex flex-col items-start px-0 py-0 relative rounded-lg flex-shrink-0 w-full min-w-[600px]">
            {/* Header */}
            <div className="border-b border-[#d1d1d1] box-border flex gap-[20px] items-center p-[14px] relative rounded-tl-lg rounded-tr-lg shrink-0 w-full">
              <p className="font-['Montserrat'] font-semibold leading-[1.4] relative shrink-0 text-[#272424] text-[20px]">
                Thanh toán
              </p>
            </div>

            {/* Summary Row */}
            <div className="bg-[#f6f6f6] border-b border-[#d1d1d1] box-border flex h-[50px] items-start relative shrink-0 w-full">
              <div className="basis-0 border-r border-[#d1d1d1] grow h-full min-h-px min-w-px relative shrink-0">
                <div className="box-border flex items-center overflow-clip pl-[15px] pr-[14px] py-[14px] relative rounded-[inherit] size-full">
                  <p className="font-['Montserrat'] font-normal leading-[1.4] relative shrink-0 text-[#272424] text-[14px]">
                    Tổng tiền
                  </p>
                </div>
              </div>
              <div className="basis-0 grow h-full min-h-px min-w-px relative shrink-0">
                <p className="absolute font-['Montserrat'] font-normal leading-[1.4] left-[50%] text-[#272424] text-[14px] text-center top-[15px] translate-x-[-50%]">
                  {summaryTotalQuantity} sản phẩm
                </p>
              </div>
              <div className="basis-0 border-l border-[#d1d1d1] box-border flex gap-[4px] grow h-full items-center justify-end min-h-px min-w-px pl-[14px] pr-[15px] py-[14px] relative shrink-0">
                <p className="font-['Montserrat'] font-normal leading-[1.4] relative shrink-0 text-[#272424] text-[14px]">
                  {formatCurrency(summaryTotalAmount)}
                </p>
              </div>
            </div>

            {/* Total to Pay Supplier */}
            <div className="border-b border-[#d1d1d1] box-border flex items-start justify-between px-0 py-[6px] relative rounded-bl-lg rounded-br-lg shrink-0 w-full">
              <div className="basis-0 box-border flex flex-col gap-[10px] grow items-start justify-center min-h-px min-w-px p-[12px] relative self-stretch shrink-0">
                <div className="flex gap-[10px] items-start relative shrink-0">
                  <p className="font-['Montserrat'] font-semibold leading-[1.4] relative shrink-0 text-[#272424] text-[16px]">
                    {providerAmountLabel}
                  </p>
                </div>
              </div>
              <div className="basis-0 box-border flex flex-col gap-[8px] grow items-end justify-center min-h-px min-w-px p-[12px] relative self-stretch shrink-0">
                <p className="font-['Montserrat'] font-semibold leading-[1.4] relative shrink-0 text-[#272424] text-[16px]">
                  {formatCurrency(summaryTotalAmount)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-[12px] items-start relative flex-shrink-0 w-full lg:w-[341px] min-w-[320px]">
          {/* Supplier Section */}
          <div className="bg-white border border-[#d1d1d1] relative rounded-lg flex-shrink-0 w-full min-w-[300px]">
            <div className="box-border flex flex-col gap-[8px] items-start justify-center overflow-clip px-[24px] py-[16px] relative rounded-[inherit] w-full">
              <p className="font-['Montserrat'] font-semibold leading-[1.4] relative shrink-0 text-[#272424] text-[16px]">
                Nhà cung cấp
              </p>
              <div className="w-full">
                <div className="relative">
                  <div className={`border-2 bg-white flex items-center gap-2 h-[36px] px-[12px] rounded-[10px] min-w-0 cursor-pointer transition-colors ${selectedSupplier
                    ? 'border-[#d1d1d1]'
                    : 'border-[#e04d30]'
                    }`}
                    onClick={handleOpenSupplierModal}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-4 h-4 text-[#737373]"
                      aria-hidden="true"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.3-4.3" />
                    </svg>
                    <input
                      type="text"
                      value={supplierSearch}
                      readOnly
                      placeholder="Chọn nhà cung cấp"
                      onFocus={handleOpenSupplierModal}
                      className="grow min-w-0 bg-transparent outline-none border-none text-[14px] text-[#272424] placeholder:text-[#737373] cursor-pointer"
                      aria-label="Chọn nhà cung cấp"
                    />
                  </div>
                  {selectedSupplier && (
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] text-[12px] hover:text-[#111]"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSupplier(null);
                        setSupplierSearch("");
                      }}
                    >
                      Xóa
                    </button>
                  )}
                </div>
                {selectedSupplier && (
                  <div className="mt-3 text-[13px] text-[#4b5563]">
                    <p className="font-semibold text-[#111]">{selectedSupplier.name}</p>
                    <p>SĐT: {selectedSupplier.phone || "—"}</p>
                    <p>Email: {selectedSupplier.email || "—"}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Note Section */}
          <div className="bg-white border border-[#d1d1d1] relative rounded-lg flex-shrink-0 w-full min-w-[300px]">
            <div className="box-border flex flex-col gap-[8px] items-start justify-center overflow-clip px-[24px] py-[16px] relative rounded-[inherit] w-full">
              <div className="flex flex-col gap-[6px] items-start relative shrink-0 w-full">
                <div className="flex flex-col gap-[4px] items-start relative shrink-0 w-full">
                  <div className="flex gap-[4px] items-start leading-[1.4] relative shrink-0">
                    <p className="font-['Montserrat'] relative shrink-0 text-[#272424] font-semibold text-[16px]">
                      Ghi chú
                    </p>
                    <p className="font-['Montserrat'] relative shrink-0 text-[#eb2b0b] font-semibold text-[16px]">
                      *
                    </p>
                  </div>
                </div>
                <div className={`border-2 box-border flex gap-[4px] h-[100px] items-start p-[16px] relative rounded-[12px] shrink-0 w-full bg-white transition-colors ${note.trim()
                  ? 'border-[#d1d1d1]'
                  : 'border-[#e04d30]'
                  }`}>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Nhập ghi chú"
                    className="font-['Montserrat'] font-normal grow leading-[1.5] min-h-px min-w-px relative shrink-0 text-[14px] placeholder:text-[#737373] placeholder:text-[14px] text-[#272424] resize-none outline-none w-full h-full bg-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-[10px] items-center justify-end shrink-0 w-full mt-2">
            <Button
              onClick={handleCancel}
              variant="secondary"
              className="flex-shrink-0 h-[36px] text-[14px]"
            >
              Huỷ
            </Button>
            <Button
              onClick={handleConfirm}
              variant="default"
              className="flex-shrink-0 h-[36px] text-[14px]"
              disabled={isCreatingInvoice}
            >
              {isCreatingInvoice ? "Đang tạo..." : "Xác nhận"}
            </Button>
          </div>
        </div>
      </div>

      {/* Product Selection Modal */}
      {isProductFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={handleCloseProductModal}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="relative z-10 w-[700px] max-h-[85vh] bg-white flex flex-col rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white flex flex-col h-full max-h-[85vh]">
              {/* Modal Header */}
              <div className="border-b border-[#e7e7e7] px-6 py-4 bg-gradient-to-r from-[#fafafa] to-white flex-shrink-0">
                <h2 className="font-['Montserrat'] font-bold text-[20px] text-[#272424] mb-4">
                  Chọn sản phẩm
                </h2>
                {/* Search Header */}
                <div className="flex gap-3 items-center">
                  <div className="border-2 border-[#e04d30] border-solid flex gap-3 grow items-center px-4 py-3 rounded-xl bg-white focus-within:ring-2 focus-within:ring-[#e04d30]/20 focus-within:border-[#e04d30] transition-all">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="shrink-0 text-[#737373]"
                    >
                      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <input
                      type="text"
                      value={productFormSearch}
                      onChange={(e) => setProductFormSearch(e.target.value)}
                      placeholder="Tìm kiếm sản phẩm theo tên, mã..."
                      className="font-['Montserrat'] font-normal leading-[1.5] text-[14px] text-[#272424] grow outline-none bg-transparent placeholder:text-[#949494]"
                      autoFocus
                    />
                    {productFormSearch && (
                      <button
                        onClick={() => {
                          setProductFormSearch("");
                          setDebouncedProductSearch("");
                        }}
                        className="shrink-0 text-[#737373] hover:text-[#272424] transition-colors"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => navigate("/admin/products/new")}
                    className="bg-[#e04d30] hover:bg-[#c93d20] flex items-center justify-center h-[48px] w-[48px] rounded-xl shrink-0 transition-colors shadow-md hover:shadow-lg"
                    title="Thêm sản phẩm mới"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Table Header */}
              <div className="bg-[#f6f6f6] border-b border-[#e7e7e7] flex items-center px-6 py-4 flex-shrink-0">
                <div className="flex gap-3 items-center w-[60%]">
                  <Checkbox
                    checked={selectAllState}
                    onCheckedChange={(checked) =>
                      handleToggleSelectAllCurrentPage(checked === true)
                    }
                    aria-label="Chọn tất cả sản phẩm trên trang"
                  />
                  <p className="font-['Montserrat'] font-semibold leading-[1.5] text-[14px] text-[#272424]">
                    Sản phẩm
                  </p>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <p className="font-['Montserrat'] font-semibold leading-[1.5] text-[14px] text-[#272424] text-center">
                    Tồn kho
                  </p>
                </div>
              </div>

              {/* Product List */}
              <div className="flex flex-col flex-1 overflow-y-auto bg-white min-h-0">
                {isModalLoading && (
                  <div className="w-full py-16 text-center">
                    <div className="inline-flex items-center gap-2 text-[14px] text-[#737373]">
                      <svg className="animate-spin h-5 w-5 text-[#e04d30]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Đang tải danh sách sản phẩm...</span>
                    </div>
                  </div>
                )}

                {hasModalError && !isModalLoading && (
                  <div className="w-full py-16 text-center">
                    <div className="inline-flex items-center gap-2 text-[14px] text-[#d92d20]">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      <span>Không thể tải dữ liệu. Vui lòng thử lại.</span>
                    </div>
                  </div>
                )}

                {isModalEmpty && (
                  <div className="w-full py-16 text-center">
                    <div className="inline-flex flex-col items-center gap-2 text-[14px] text-[#737373]">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-50">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="M21 21l-4.35-4.35"></path>
                      </svg>
                      <span>Không tìm thấy sản phẩm phù hợp.</span>
                    </div>
                  </div>
                )}

                {!isModalLoading &&
                  !hasModalError &&
                  productModalList.map((product: ProductInvoiceResponse) => {
                    const attributeText = buildAttributeText(product.attribute);
                    const isChecked = Boolean(selectedProducts[product.id]);
                    const availableStock = product.totalQuantity ?? 0;

                    return (
                      <div
                        key={product.id}
                        className={`border-b border-[#e7e7e7] flex items-center w-full px-6 py-4 hover:bg-[#fafafa] transition-colors ${isChecked ? 'bg-[#fef3f2]' : 'bg-white'}`}
                      >
                        <div className="flex gap-4 items-start w-[60%]">
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() =>
                              toggleProductSelection(product)
                            }
                            aria-label={`Chọn ${product.productName}`}
                            className="mt-1"
                          />
                          <div className="h-[56px] w-[56px] bg-gray-100 rounded-lg flex items-center justify-center shrink-0 border border-gray-200 overflow-hidden shadow-sm relative">
                            {product.imageUrl ? (
                              <img
                                src={getImageUrl(product.imageUrl) || product.imageUrl}
                                alt={product.productName}
                                className="h-full w-full object-cover"
                                loading="lazy"
                                onError={(e) => {
                                  const target = e.currentTarget as HTMLImageElement;
                                  if (target.dataset.fallbackApplied === "true") {
                                    return;
                                  }
                                  target.dataset.fallbackApplied = "true";
                                  target.style.display = "none";
                                  const fallback = target.parentElement?.querySelector('.fallback-placeholder') as HTMLElement;
                                  if (fallback) {
                                    fallback.style.display = "flex";
                                  }
                                }}
                              />
                            ) : null}
                            <div 
                              className="fallback-placeholder w-full h-full flex items-center justify-center"
                              style={{ display: product.imageUrl ? 'none' : 'flex' }}
                            >
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                          </div>
                          <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                            <p
                              className="font-['Montserrat'] font-semibold leading-[1.4] text-[15px] text-[#272424] line-clamp-1"
                              title={product.productName}
                            >
                              {product.productName}
                            </p>
                            {attributeText && (
                              <p className="font-['Montserrat'] text-[13px] text-[#737373] line-clamp-1">
                                {attributeText}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[12px] text-[#6b7280]">
                              <span className="font-medium">Mã: <span className="font-normal">#{product.id}</span></span>
                              <span className="font-medium">Giá nhập: <span className="font-normal">{formatPriceDisplay(product.importPrice)}</span></span>
                              <span className="font-medium">Giá bán: <span className="font-normal">{formatPriceDisplay(product.sellingPrice)}</span></span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                          <div className={`px-4 py-2 rounded-lg ${availableStock > 0 ? 'bg-[#f0fdf4] text-[#166534]' : 'bg-[#fef2f2] text-[#991b1b]'}`}>
                            <p className="font-['Montserrat'] font-semibold leading-[1.5] text-[14px] text-center">
                              {availableStock.toLocaleString("vi-VN")}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Pagination */}
              {!isModalLoading && !hasModalError && productModalList.length > 0 && modalTotalPages > 0 && (
                <div className="border-t border-[#e7e7e7] bg-white px-6 py-4 flex-shrink-0">
                  <Pagination
                    current={modalCurrentPage}
                    total={modalTotalPages}
                    onChange={(page) => setProductSearchPage(page)}
                    pageSize={PRODUCT_PAGE_SIZE}
                    totalElements={modalTotalElements}
                    className="bg-transparent border-none shadow-none"
                  />
                </div>
              )}

              {/* Footer */}
              <div className="border-t border-[#e7e7e7] bg-[#fafafa] flex items-center justify-between px-6 py-4 shrink-0">
                <div className="text-[14px] text-[#737373]">
                  {selectedOnPageCount > 0 && (
                    <span className="font-medium text-[#272424]">
                      Đã chọn {Object.keys(selectedProducts).length} sản phẩm
                    </span>
                  )}
                </div>
                <div className="flex gap-3 items-center">
                  <Button
                    variant="secondary"
                    onClick={handleCloseProductModal}
                    className="h-[40px] px-6 text-[14px] font-semibold"
                  >
                    Huỷ
                  </Button>
                  <Button
                    variant="default"
                    onClick={handleAddProducts}
                    disabled={Object.keys(selectedProducts).length === 0}
                    className="h-[40px] px-6 text-[14px] font-semibold bg-[#e04d30] hover:bg-[#c93d20]"
                  >
                    Xác nhận ({Object.keys(selectedProducts).length})
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isSupplierModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={handleCloseSupplierModal}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative z-10 w-[600px] max-h-[85vh] bg-white flex flex-col rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-[#e7e7e7] px-[20px] py-[18px]">
              <p className="font-['Montserrat'] font-semibold text-[18px] text-[#111]">
                Chọn nhà cung cấp
              </p>
            </div>
            <div className="px-[20px] py-[16px] border-b border-[#f0f0f0]">
              <div className="border-[1.6px] border-[#e04d30] rounded-[12px] flex items-center px-[16px] py-[8px]">
                <input
                  type="text"
                  value={supplierSearchInput}
                  onChange={(e) => setSupplierSearchInput(e.target.value)}
                  placeholder="Tìm theo tên, SĐT, email..."
                  className="flex-1 bg-transparent outline-none text-[14px] text-[#272424]"
                />
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z"
                    stroke="#454545"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17.5 17.5L13.875 13.875"
                    stroke="#454545"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {supplierLoading && (
                <p className="py-6 text-center text-[14px] text-[#737373]">
                  Đang tải danh sách nhà cung cấp...
                </p>
              )}
              {supplierHasError && !supplierLoading && (
                <p className="py-6 text-center text-[14px] text-[#d92d20]">
                  Không thể tải dữ liệu. Vui lòng thử lại.
                </p>
              )}
              {supplierEmpty && (
                <p className="py-6 text-center text-[14px] text-[#737373]">
                  Không tìm thấy nhà cung cấp phù hợp.
                </p>
              )}
              {!supplierLoading &&
                !supplierHasError &&
                supplierList.map((supplier: ProviderResponse) => {
                  const isActive = highlightedSupplierId === supplier.id;
                  return (
                    <button
                      type="button"
                      key={supplier.id}
                      onClick={() => setHighlightedSupplierId(supplier.id)}
                      className={`w-full text-left px-[20px] py-[14px] border-b border-[#f2f2f2] hover:bg-[#fdf4f2] ${isActive ? "bg-[#fff0ec]" : "bg-white"
                        }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-[15px] text-[#111]">{supplier.name}</p>
                          <p className="text-[13px] text-[#4b5563]">
                            SĐT: {supplier.phone || "—"} • Email: {supplier.email || "—"}
                          </p>
                        </div>
                        <div
                          className={`size-4 border rounded-full flex items-center justify-center ${isActive ? "border-[#e04d30] bg-[#e04d30]" : "border-[#d1d1d1]"
                            }`}
                        >
                          {isActive && <div className="size-2 bg-white rounded-full" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>
            {supplierTotalPages > 1 && (
              <Pagination
                current={supplierPage}
                total={supplierTotalPages}
                onChange={(page) => setSupplierPage(page)}
                className="border-none shadow-none rounded-none px-[16px] py-[12px]"
              />
            )}
            <div className="flex items-center justify-end gap-3 px-[20px] py-[14px] border-t border-[#f0f0f0]">
              <Button
                variant="secondary"
                onClick={handleCloseSupplierModal}
                className="h-[36px] text-[14px]"
              >
                Huỷ
              </Button>
              <Button
                variant="default"
                onClick={handleConfirmSupplierSelection}
                className="h-[36px] text-[14px]"
              >
                Xác nhận
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWarehouseCreateImport;
