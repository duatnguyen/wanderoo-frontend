import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import { Checkbox } from "@/components/ui/checkbox";
import Icon from "@/components/icons/Icon";
import { Pagination } from "@/components/ui/pagination";
import { searchInvoiceProducts } from "@/api/endpoints/warehouseApi";
import type { ProductInvoiceResponse } from "@/types/warehouse";

interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image?: string | null;
  availableStock?: number | null;
}

const AdminWarehouseCreateImport = () => {
  document.title = "Tạo đơn nhập hàng | Wanderoo";
  const PRODUCT_PAGE_SIZE = 8;

  const navigate = useNavigate();
  const [supplierSearch, setSupplierSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [productFormSearch, setProductFormSearch] = useState("");
  const [debouncedProductSearch, setDebouncedProductSearch] = useState("");
  const [productSearchPage, setProductSearchPage] = useState(1);
  const [note, setNote] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<
    Record<number, ProductInvoiceResponse>
  >({});

  const totalProducts = products.length;
  const totalAmount = products.reduce(
    (sum, product) => sum + product.quantity * product.price,
    0
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedProductSearch(productFormSearch.trim());
      setProductSearchPage(1);
    }, 400);

    return () => clearTimeout(handler);
  }, [productFormSearch]);

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

  const productQuery = useQuery({
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
    keepPreviousData: true,
    staleTime: 0,
    retry: 1,
    onError: (error) => {
      const message = isAxiosError(error)
        ? error.response?.data?.message || "Không thể tải danh sách sản phẩm"
        : "Không thể tải danh sách sản phẩm";
      toast.error(message);
    },
  });

  const productModalList = productQuery.data?.productInvoices ?? [];
  const modalTotalPages = productQuery.data?.totalPages ?? 0;
  const modalCurrentPage = productSearchPage;
  const isModalLoading = productQuery.isLoading || productQuery.isFetching;
  const hasModalError = productQuery.isError;
  const isModalEmpty =
    !isModalLoading && !hasModalError && productModalList.length === 0;

  const selectedOnPageCount = useMemo(
    () =>
      productModalList.reduce(
        (count, product) => count + (selectedProducts[product.id] ? 1 : 0),
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
        productModalList.forEach((product) => {
          updated[product.id] = product;
        });
      } else {
        productModalList.forEach((product) => {
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

  const handleCancel = () => {
    navigate("/admin/warehouse/imports");
  };

  const handleConfirm = () => {
    // Handle confirm logic here
    console.log("Confirm import order");
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
      .filter((product) => !products.some((p) => p.id === product.id))
      .map((product) => ({
        id: product.id,
        name: product.productName,
        quantity: 1,
        price: product.importPrice ?? 0,
        image: product.imageUrl ?? null,
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
      prev.map((product) =>
        product.id === productId
          ? { ...product, quantity: Math.max(1, quantity) }
          : product
      )
    );
  };

  const handleUpdatePrice = (productId: number, price: number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? { ...product, price: Math.max(0, price) }
          : product
      )
    );
  };

  const handleRemoveProduct = (productId: number) => {
    setProducts((prev) => prev.filter((product) => product.id !== productId));
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isProductFormOpen) {
        handleCloseProductModal();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [handleCloseProductModal, isProductFormOpen]);

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
            Tạo đơn nhập hàng
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-[12px] h-[700px] items-start relative rounded-lg flex-shrink-0 w-full -mt-[10px] min-w-[1000px]">
        {/* Left Column */}
        <div className="flex flex-col gap-[12px] h-full items-start relative flex-shrink-0 w-full lg:w-[695px] min-w-[650px]">
          {/* Products Section */}
          <div className="basis-0 bg-white border border-[#d1d1d1] box-border flex flex-col gap-[8px] grow items-start min-h-px min-w-px px-[24px] py-[16px] relative rounded-lg flex-shrink-0 w-full min-w-[600px]">
            <div className="flex gap-[10px] items-start relative shrink-0 w-full">
              <p className="font-['Montserrat'] font-semibold leading-[1.4] relative shrink-0 text-[#272424] text-[16px]">
                Sản phẩm
              </p>
            </div>
            <div className="flex items-center gap-2 relative shrink-0 w-full">
              <SearchBar
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Tìm kiếm"
                className="flex-1 h-[36px] [&_input]:text-[14px]"
              />
              <Button
                variant="secondary"
                onClick={() => setIsProductFormOpen(true)}
                className="bg-white text-[#e04d30] border border-[#e04d30] hover:bg-white hover:text-[#e04d30] h-[36px] w-[36px] p-0 flex items-center justify-center flex-shrink-0"
              >
                <Icon name="plus" size={16} color="#e04d30" strokeWidth={3} />
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
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="border-b border-[#e7e7e7] flex items-center py-[14px] pl-[24px] pr-0 hover:bg-gray-50"
                    >
                      {/* Product Info */}
                      <div className="flex-[2] min-w-0 flex items-start gap-3">
                        <div className="h-[38px] w-[38px] bg-gray-200 rounded flex items-center justify-center shrink-0 border border-gray-300"></div>
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
                        <input
                          type="number"
                          value={product.price}
                          onChange={(e) =>
                            handleUpdatePrice(
                              product.id,
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-20 text-center border border-[#d1d1d1] rounded px-2 py-1 text-[12px] font-['Montserrat'] focus:border-[#e04d30] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                          min="0"
                          step="1000"
                        />
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
                  ))}
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
                  {totalProducts} sản phẩm
                </p>
              </div>
              <div className="basis-0 border-l border-[#d1d1d1] box-border flex gap-[4px] grow h-full items-center justify-end min-h-px min-w-px pl-[14px] pr-[15px] py-[14px] relative shrink-0">
                <p className="font-['Montserrat'] font-normal leading-[1.4] relative shrink-0 text-[#272424] text-[14px]">
                  {formatCurrency(totalAmount)}
                </p>
              </div>
            </div>

            {/* Total to Pay Supplier */}
            <div className="border-b border-[#d1d1d1] box-border flex items-start justify-between px-0 py-[6px] relative rounded-bl-lg rounded-br-lg shrink-0 w-full">
              <div className="basis-0 box-border flex flex-col gap-[10px] grow items-start justify-center min-h-px min-w-px p-[12px] relative self-stretch shrink-0">
                <div className="flex gap-[10px] items-start relative shrink-0">
                  <p className="font-['Montserrat'] font-semibold leading-[1.4] relative shrink-0 text-[#272424] text-[16px]">
                    Tiền cần trả nhà cung cấp
                  </p>
                </div>
              </div>
              <div className="basis-0 box-border flex flex-col gap-[8px] grow items-end justify-center min-h-px min-w-px p-[12px] relative self-stretch shrink-0">
                <p className="font-['Montserrat'] font-semibold leading-[1.4] relative shrink-0 text-[#272424] text-[16px]">
                  {formatCurrency(totalAmount)}
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
              <SearchBar
                value={supplierSearch}
                onChange={(e) => setSupplierSearch(e.target.value)}
                placeholder="Tìm kiếm"
                className="w-full h-[36px] [&_input]:text-[14px]"
              />
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
                <div className="border-2 border-[#e04d30] box-border flex gap-[4px] h-[100px] items-start p-[16px] relative rounded-[12px] shrink-0 w-full bg-white">
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
            >
              Xác nhận
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
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative z-10 w-[700px] max-h-[90vh] bg-white flex flex-col rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white flex flex-col rounded-lg overflow-hidden">
              {/* Search Header */}
              <div className="border-b border-[#e7e7e7] flex gap-2 items-center px-[16px] py-[30px] shrink-0 bg-white">
                <div className="border-[1.6px] border-[#e04d30] border-solid box-border flex gap-[4px] grow items-center px-[16px] py-[8px] rounded-[12px] bg-white">
                  <input
                    type="text"
                    value={productFormSearch}
                    onChange={(e) => setProductFormSearch(e.target.value)}
                    placeholder="Tìm kiếm"
                    className="font-['Montserrat'] font-normal leading-[1.5] text-[12px] text-[#949494] grow outline-none bg-transparent"
                  />
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="shrink-0"
                  >
                    <path
                      d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                      stroke="#454545"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21 21L16.65 16.65"
                      stroke="#454545"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <button
                  onClick={() => navigate("/admin/products/new")}
                  className="bg-[#e04d30] flex items-center justify-center h-[40px] w-[40px] rounded-[12px] shrink-0"
                >
                  <span className="font-['Montserrat'] font-light text-[32px] text-white leading-[1.5]">
                    +
                  </span>
                </button>
              </div>

              {/* Table Header */}
              <div className="box-border flex items-center px-[15px] py-0 shrink-0 bg-white">
                <div className="bg-white box-border flex gap-[8px] h-[50px] items-center overflow-clip px-[5px] py-[14px] w-[450px]">
                  <Checkbox
                    checked={selectAllState}
                    onCheckedChange={(checked) =>
                      handleToggleSelectAllCurrentPage(checked === true)
                    }
                    aria-label="Chọn tất cả sản phẩm trên trang"
                  />
                  <p className="font-['Montserrat'] font-semibold leading-[1.5] text-[14px] text-[#454545]">
                    Sản phẩm
                  </p>
                </div>
                <div className="bg-white box-border flex gap-[4px] grow h-[50px] items-center justify-center p-[14px]">
                  <p className="font-['Montserrat'] font-semibold grow leading-[1.5] text-[14px] text-[#454545] text-center">
                    Số lượng tồn kho
                  </p>
                </div>
              </div>

              {/* Product List */}
              <div className="box-border flex flex-col max-h-[400px] items-start px-[15px] py-0 overflow-y-auto bg-white">
                {isModalLoading && (
                  <div className="w-full py-10 text-center text-[14px] text-[#737373]">
                    Đang tải danh sách sản phẩm...
                  </div>
                )}

                {hasModalError && !isModalLoading && (
                  <div className="w-full py-10 text-center text-[14px] text-[#d92d20]">
                    Không thể tải dữ liệu. Vui lòng thử lại.
                  </div>
                )}

                {isModalEmpty && (
                  <div className="w-full py-10 text-center text-[14px] text-[#737373]">
                    Không tìm thấy sản phẩm phù hợp.
                  </div>
                )}

                {!isModalLoading &&
                  !hasModalError &&
                  productModalList.map((product) => {
                    const attributeText = buildAttributeText(product.attribute);
                    const isChecked = Boolean(selectedProducts[product.id]);
                    const availableStock = product.totalQuantity ?? 0;

                    return (
                      <div
                        key={product.id}
                        className="border-b border-[#e7e7e7] box-border flex items-center w-full bg-white"
                      >
                        <div className="bg-white box-border flex gap-[8px] h-full items-start overflow-clip px-[5px] py-[14px] w-[450px]">
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() =>
                              toggleProductSelection(product)
                            }
                            aria-label={`Chọn ${product.productName}`}
                          />
                          <div className="h-[38px] w-[38px] bg-gray-100 rounded flex items-center justify-center shrink-0 border border-gray-200 overflow-hidden">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.productName}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-[12px] text-[#737373]">
                                N/A
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col gap-[4px] min-w-0 pr-2">
                            <p
                              className="font-['Montserrat'] font-semibold leading-[1.4] text-[14px] text-black line-clamp-1"
                              title={product.productName}
                            >
                              {product.productName}
                            </p>
                            {attributeText && (
                              <p className="font-['Montserrat'] text-[12px] text-[#737373] line-clamp-1">
                                {attributeText}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[#6b7280]">
                              <span>Mã: #{product.id}</span>
                              <span>Giá nhập: {formatPriceDisplay(product.importPrice)}</span>
                              <span>Giá bán: {formatPriceDisplay(product.sellingPrice)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white box-border flex gap-[4px] grow h-full items-center justify-center p-[14px]">
                          <p className="font-['Montserrat'] font-semibold grow leading-[1.5] text-[14px] text-[#454545] text-center">
                            {availableStock.toLocaleString("vi-VN")}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {modalTotalPages > 1 && (
                <Pagination
                  current={modalCurrentPage}
                  total={modalTotalPages}
                  onChange={(page) => setProductSearchPage(page)}
                  className="border-none shadow-none rounded-none px-[16px] py-[12px]"
                />
              )}

              {/* Footer Buttons */}
              <div className="box-border flex gap-[10px] items-center justify-end px-[16px] py-[12px] shrink-0 bg-white rounded-b-lg">
                <Button
                  variant="secondary"
                  onClick={handleCloseProductModal}
                  className="h-[36px] text-[14px]"
                >
                  Huỷ
                </Button>
                <Button
                  variant="default"
                  onClick={handleAddProducts}
                  className="h-[36px] text-[14px]"
                >
                  Xác nhận
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWarehouseCreateImport;
