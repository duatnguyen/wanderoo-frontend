import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import { Checkbox } from "@/components/ui/checkbox";
import Icon from "@/components/icons/Icon";
import { ContentCard, PageContainer } from "@/components/common";
import { getInvoiceDetail, createExportInvoice, getProviderList } from "@/api/endpoints/warehouseApi";
import type { InvoiceDetailResponse } from "@/types/warehouse";
import { toast } from "sonner";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface Product {
  id: string;
  name: string;
  quantity: number; // Số lượng trả (returnQuantity)
  price: number;
  image?: string;
  maxQuantity: number; // Tồn kho (quantity từ đơn nhập)
  productDetailId?: number; // Cần để tạo đơn trả hàng
}

interface MockProduct {
  id: string;
  name: string;
  image: string;
  availableStock: number;
}

// Mock products data
const mockProducts: MockProduct[] = [
  {
    id: "1",
    name: "Áo Thun Nam Basic",
    image: "/placeholder-product.jpg",
    availableStock: 500,
  },
  {
    id: "2",
    name: "Quần Jean Nữ Skinny",
    image: "/placeholder-product.jpg",
    availableStock: 350,
  },
  {
    id: "3",
    name: "Giày Thể Thao Nam",
    image: "/placeholder-product.jpg",
    availableStock: 200,
  },
  {
    id: "4",
    name: "Túi Xách Nữ Mini",
    image: "/placeholder-product.jpg",
    availableStock: 150,
  },
];

// Mock import data - would normally fetch from API
const mockImportData: {
  [key: string]: { supplier: string; items: Product[] };
} = {
  "1": {
    supplier: "Công ty TNHH ABC",
    items: [
      {
        id: "p1",
        name: "Áo thun thoáng khí Rockbros LKW008",
        quantity: 100,
        price: 120000,
        image: "/placeholder-product.jpg",
      },
      {
        id: "p2",
        name: "Áo thun dài tay Northshengwolf",
        quantity: 50,
        price: 150000,
        image: "/placeholder-product.jpg",
      },
    ],
  },
  "2": {
    supplier: "Công ty XYZ",
    items: [
      {
        id: "p3",
        name: "Giày Thể Thao Nam",
        quantity: 30,
        price: 500000,
        image: "/placeholder-product.jpg",
      },
    ],
  },
};

const NOTE_MAX_LENGTH = 200;

const AdminWarehouseCreateReturnImport = () => {
  const [searchParams] = useSearchParams();
  const importId = searchParams.get("importId");
  const [importCode, setImportCode] = useState<string | null>(null);
  
  // Update document title when importCode is available
  useEffect(() => {
    if (importCode) {
      document.title = `Tạo đơn xuất hàng ${importCode} | Wanderoo`;
    } else {
      document.title = "Tạo đơn xuất hàng | Wanderoo";
    }
  }, [importCode]);

  const navigate = useNavigate();
  const [supplierSearch, setSupplierSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [productFormSearch, setProductFormSearch] = useState("");
  const [note, setNote] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [providerId, setProviderId] = useState<number | null>(null);

  // Load import data from API when importId is provided
  const fetchImportInvoice = useCallback(async () => {
    if (!importId) return;

    setLoading(true);
    setError(null);
    try {
      const invoiceId = parseInt(importId, 10);
      if (isNaN(invoiceId)) {
        setError("ID đơn nhập hàng không hợp lệ");
        return;
      }

      const invoice = await getInvoiceDetail(invoiceId);
      console.log("Invoice detail:", invoice);
      console.log("Cart items:", invoice?.cartItem);
      
      if (!invoice) {
        console.error("Invoice data is null or undefined");
        setError("Không thể lấy thông tin đơn nhập hàng");
        toast.error("Không thể lấy thông tin đơn nhập hàng");
        return;
      }
      
      setSupplierSearch(invoice.providerName || "");
      setImportCode(invoice.code || null);
      
      // Map cart items to products
      // quantity từ BE = tồn kho (maxQuantity)
      // Số lượng trả ban đầu = tồn kho
      if (invoice.cartItem && Array.isArray(invoice.cartItem) && invoice.cartItem.length > 0) {
        const mappedProducts: Product[] = invoice.cartItem.map((item, index) => ({
          id: `item-${index}`,
          name: item.productName || "",
          quantity: item.quantity || 0, // Số lượng trả, ban đầu = tồn kho
          price: item.productPrice || 0,
          image: undefined,
          maxQuantity: item.quantity || 0, // Tồn kho = quantity từ đơn nhập
          productDetailId: undefined, // BE không trả về, cần tìm cách khác
        }));
        
        console.log("Mapped products:", mappedProducts);
        setProducts(mappedProducts);
      } else {
        console.warn("No cart items in invoice response", {
          cartItem: invoice.cartItem,
          cartItemType: typeof invoice.cartItem,
          isArray: Array.isArray(invoice.cartItem),
          invoiceId: invoice.id,
          invoiceCode: invoice.code,
          fullInvoice: invoice
        });
        setProducts([]);
        toast.warning("Đơn nhập hàng không có sản phẩm nào hoặc dữ liệu không hợp lệ");
      }
      
      // Get providerId from providerName
      if (invoice.providerName) {
        try {
          const providerList = await getProviderList(invoice.providerName, undefined, 0, 100);
          const provider = providerList.providers?.find(p => p.name === invoice.providerName);
          if (provider) {
            setProviderId(provider.id);
          } else {
            console.warn("Provider not found by name:", invoice.providerName);
          }
        } catch (err) {
          console.error("Error fetching provider:", err);
        }
      }
    } catch (err) {
      console.error("Error fetching import invoice:", err);
      setError("Không thể tải thông tin đơn nhập hàng. Vui lòng thử lại.");
      toast.error("Không thể tải thông tin đơn nhập hàng");
    } finally {
      setLoading(false);
    }
  }, [importId]);

  useEffect(() => {
    fetchImportInvoice();
  }, [fetchImportInvoice]);

  const totalProducts = products.length;
  const totalAmount = products.reduce(
    (sum, product) => sum + product.quantity * product.price,
    0
  );

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes((productSearch || "").toLowerCase())
  );
  const hasProductSearch = (productSearch || "").trim().length > 0;

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [productSearch]);
  const isFormValid = Boolean(
    (supplierSearch || "").trim() && (note || "").trim() && products.length > 0
  );
  const isNoteMissing = (note || "").trim().length === 0;

  const pageTitle = importCode
    ? `Tạo đơn xuất hàng ${importCode}`
    : importId
    ? `Tạo đơn xuất hàng ${importId}`
    : "Tạo đơn xuất hàng";

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + "đ";
  };

  const handleCancel = () => {
    navigate("/admin/warehouse/returnsimport");
  };

  const handleConfirm = async () => {
    if (!isFormValid) {
      return;
    }

    // Validate that we have providerId
    if (!providerId) {
      toast.error("Không tìm thấy thông tin nhà cung cấp. Vui lòng thử lại.");
      return;
    }

    // Validate that all products have productDetailId
    // Note: BE doesn't return productDetailId in InvoiceDetailResponse.CartItemResponse
    // We need to find another way to get it. For now, we'll show an error.
    const productsWithoutDetailId = products.filter(p => !p.productDetailId);
    if (productsWithoutDetailId.length > 0) {
      toast.error("Không thể tạo đơn trả hàng: thiếu thông tin sản phẩm. Vui lòng liên hệ admin.");
      console.error("Products without productDetailId:", productsWithoutDetailId);
      return;
    }

    setLoading(true);
    try {
      // Map products to cart items
      const cartItems = products
        .filter((product) => product.productDetailId && product.productDetailId > 0 && product.quantity > 0)
        .map((product) => ({
          productDetailId: product.productDetailId!,
          quantity: product.quantity,
        }));

      if (cartItems.length === 0) {
        toast.error("Vui lòng thêm ít nhất một sản phẩm hợp lệ.");
        setLoading(false);
        return;
      }

      const returnInvoiceId = await createExportInvoice({
        cartItems,
        providerId,
        note: (note || "").trim() || undefined,
      });

      toast.success("Tạo đơn xuất hàng thành công");
      navigate(`/admin/warehouse/returns/${returnInvoiceId}`);
    } catch (err) {
      console.error("Error creating return invoice:", err);
      toast.error("Không thể tạo đơn xuất hàng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddProducts = () => {
    const newProducts = mockProducts
      .filter((product) => selectedProductIds.includes(product.id))
      .map((product) => ({
        id: product.id,
        name: product.name,
        quantity: 1,
        price: 0,
        image: product.image,
        availableStock: product.availableStock,
      }))
      .filter((product) => !products.some((p) => p.id === product.id));

    setProducts((prev) => [...prev, ...newProducts]);
    setIsProductFormOpen(false);
    setSelectedProductIds([]);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setProducts((prev) =>
      prev.map((product) => {
        if (product.id === productId) {
          // Giới hạn số lượng trả <= tồn kho (maxQuantity)
          const maxQty = product.maxQuantity || 0;
          const newQuantity = Math.max(0, Math.min(quantity, maxQty));
          return { ...product, quantity: newQuantity };
        }
        return product;
      })
    );
  };

  const handleUpdatePrice = (productId: string, price: number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? { ...product, price: Math.max(0, price) }
          : product
      )
    );
  };

  const handleRemoveProduct = (productId: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== productId));
  };

  const filteredMockProducts = mockProducts.filter((product) =>
    product.name.toLowerCase().includes(productFormSearch.toLowerCase())
  );

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isProductFormOpen) {
        setIsProductFormOpen(false);
        setSelectedProductIds([]);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isProductFormOpen]);

  // Show loading only when fetching and no products yet
  if (loading && importId && products.length === 0 && !error) {
    return (
      <PageContainer>
        <ContentCard>
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        </ContentCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex flex-col gap-[10px] w-full mb-2">
        <div className="flex flex-wrap items-center justify-between gap-[12px] w-full">
          <div className="flex items-center gap-[8px]">
            <button
              onClick={() => navigate("/admin/warehouse/returnsimport")}
              className="relative shrink-0 size-[24px] flex items-center justify-center cursor-pointer"
              aria-label="Quay lại danh sách xuất hàng"
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
          <div className="flex flex-col items-end gap-[6px]">
            <div className="flex items-center gap-[10px]">
              <Button
                onClick={handleCancel}
                variant="secondary"
                className="bg-white text-[#e04d30] border-2 border-[#e04d30] hover:bg-white hover:text-[#c74429] rounded-[12px] px-[24px] py-[12px] text-[12px] font-['Inter'] font-bold"
              >
                Huỷ
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={!isFormValid || loading}
                className="bg-[#e04d30] hover:bg-[#c74429] disabled:bg-[#f0a090] disabled:text-white disabled:cursor-not-allowed rounded-[12px] px-[24px] py-[12px] text-[12px] font-['Inter'] font-bold"
              >
                {loading ? "Đang tạo..." : "Tạo đơn xuất hàng"}
              </Button>
            </div>
            {!isFormValid && (
              <p className="text-[12px] text-[#c74429] font-['Montserrat'] text-right">
                Vui lòng hoàn tất thông tin trước khi tạo đơn.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <ContentCard>
        <div className="flex flex-col gap-[12px] w-full">


          <div className="flex flex-col lg:flex-row gap-[12px] items-start w-full">
            {/* Left Column */}
            <div className="flex flex-col gap-[12px] flex-1 w-full">

              {/* Products Section */}
              <div className="bg-white border border-[#e5e7eb] rounded-[16px] flex flex-col w-full shadow-sm">
                {/* Fixed Header */}
                <div className="flex-shrink-0 border-b border-[#f3f4f6] px-[24px] py-[20px]">
                  <div className="flex items-center justify-between gap-[16px] mb-[16px]">
                    <div className="flex items-center gap-[12px]">
                      <h2 className="font-['Montserrat'] font-bold text-[20px] text-[#1f2937]">
                        Sản phẩm hoàn trả
                      </h2>
                      {products.length > 0 && (
                        <span className="bg-[#f3f4f6] text-[#6b7280] px-[8px] py-[4px] rounded-[6px] text-[12px] font-semibold">
                          {filteredProducts.length} sản phẩm
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-[12px] items-start sm:items-center">
                    <SearchBar
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Tìm kiếm sản phẩm..."
                      className="flex-1 h-[40px] [&_input]:h-[40px] [&_input]:rounded-[10px] [&_input]:text-[14px] [&_input]:border-[#e5e7eb] [&_input]:focus:border-[#e04d30]"
                    />
                    {!importId && (
                      <Button
                        variant="secondary"
                        onClick={() => setIsProductFormOpen(true)}
                        className="bg-[#e04d30] text-white border-0 hover:bg-[#c74429] rounded-[10px] px-[16px] py-[10px] flex items-center gap-2 font-semibold text-[14px]"
                      >
                        <Icon name="plus" size={16} color="#ffffff" strokeWidth={2.5} />
                        Thêm sản phẩm
                      </Button>
                    )}
                  </div>
                </div>

                {/* Table Structure */}
                {products.length > 0 ? (
                  filteredProducts.length > 0 ? (
                    <div className="flex flex-col flex-1 min-h-0">
                      {/* Table Header - Fixed */}
                      <div className="flex-shrink-0 bg-[#f8fafc] border-b border-[#e5e7eb] overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                          <thead>
                            <tr className="text-[#374151] text-[13px] font-['Montserrat'] font-semibold">
                              <th className="w-[300px] px-[20px] py-[14px] text-left">Sản phẩm</th>
                              <th className="px-[14px] py-[14px] text-center w-[100px]">Tồn kho</th>
                              <th className="px-[14px] py-[14px] text-center w-[100px]">Số lượng</th>
                              <th className="px-[14px] py-[14px] text-center w-[120px]">Đơn giá trả</th>
                              <th className="px-[14px] py-[14px] text-right w-[100px]">Thành tiền</th>
                              <th className="w-[50px] px-[14px] py-[14px] text-center">Xoá</th>
                            </tr>
                          </thead>
                        </table>
                      </div>

                      {/* Scrollable Content */}
                      <div className="flex-1 overflow-y-auto overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                          <tbody>
                            {paginatedProducts.map((product) => (
                              <tr
                                key={product.id}
                                className="border-b border-[#f3f4f6] text-[#1f2937] hover:bg-[#fafbfc] transition-colors"
                              >
                                <td className="w-[300px] px-[20px] py-[16px] align-top">
                                  <div className="flex items-center gap-[12px]">
                                    <div className="size-[48px] rounded-[10px] bg-[#f9fafb] border border-[#e5e7eb] flex items-center justify-center overflow-hidden flex-shrink-0">
                                      {product.image ? (
                                        <img
                                          src={product.image}
                                          alt={product.name}
                                          className="size-full object-cover rounded-[8px]"
                                        />
                                      ) : (
                                        <span className="text-[10px] text-[#9ca3af]">48×48</span>
                                      )}
                                    </div>
                                    <div className="flex flex-col gap-[4px] min-w-0">
                                      <p className="font-['Montserrat'] text-[13px] font-semibold leading-[1.4] text-[#1f2937] line-clamp-2">
                                        {product.name}
                                      </p>
                                      <span className="text-[11px] text-[#6b7280] font-['Montserrat']">
                                        SKU: {product.id.toUpperCase()}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-[14px] py-[16px] text-center align-middle w-[100px]">
                                  <span className="text-[13px] font-['Montserrat'] font-medium text-[#6b7280]">
                                    {product.maxQuantity ?? '—'}
                                  </span>
                                </td>
                                <td className="px-[14px] py-[16px] text-center align-middle w-[100px]">
                                  <input
                                    type="number"
                                    value={product.quantity}
                                    onChange={(e) =>
                                      handleUpdateQuantity(
                                        product.id,
                                        parseInt(e.target.value) || 0
                                      )
                                    }
                                    className="w-[70px] text-center border border-[#d1d5db] rounded-[8px] px-[8px] py-[6px] text-[13px] font-['Montserrat'] font-semibold text-[#1f2937] focus:border-[#e04d30] focus:outline-none focus:ring-1 focus:ring-[#e04d30] transition-all"
                                    min="0"
                                    max={product.maxQuantity}
                                    aria-label={`Số lượng trả cho ${product.name}`}
                                  />
                                </td>
                                <td className="px-[14px] py-[16px] text-center align-middle w-[120px]">
                                  <input
                                    type="number"
                                    value={product.price}
                                    onChange={(e) =>
                                      handleUpdatePrice(
                                        product.id,
                                        parseFloat(e.target.value) || 0
                                      )
                                    }
                                    className="w-[100px] text-center border border-[#d1d5db] rounded-[8px] px-[8px] py-[6px] text-[13px] font-['Montserrat'] font-semibold text-[#1f2937] focus:border-[#e04d30] focus:outline-none focus:ring-1 focus:ring-[#e04d30] transition-all [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                                    min="0"
                                    step="1000"
                                    placeholder="0"
                                    aria-label={`Đơn giá trả cho ${product.name}`}
                                  />
                                </td>
                                <td className="px-[14px] py-[16px] text-right align-middle w-[100px]">
                                  <span className="text-[13px] font-['Montserrat'] font-bold text-[#1f2937]">
                                    {formatCurrency(product.quantity * product.price)}
                                  </span>
                                </td>
                                <td className="px-[14px] py-[16px] text-center align-middle w-[50px]">
                                  <button
                                    onClick={() => handleRemoveProduct(product.id)}
                                    className="w-[32px] h-[32px] rounded-[8px] bg-[#fef2f2] hover:bg-[#fecaca] border border-[#fecaca] hover:border-[#f87171] text-[#dc2626] hover:text-[#b91c1c] transition-all duration-200 flex items-center justify-center"
                                    aria-label={`Xoá ${product.name} khỏi danh sách`}
                                  >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                    </svg>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Fixed Footer with Pagination */}
                      <div className="flex-shrink-0 border-t border-[#e5e7eb] bg-[#f8fafc] mt-auto rounded-b-[16px]">
                        {/* Summary Row */}
                        <div className="px-[20px] py-[12px]">
                          <div className="flex justify-between items-center">
                            <span className="text-[14px] font-['Montserrat'] font-semibold text-[#374151]">
                              Tổng cộng: {filteredProducts.length} sản phẩm
                            </span>
                            <span className="text-[16px] font-['Montserrat'] font-bold text-[#e04d30]">
                              {formatCurrency(
                                filteredProducts.reduce(
                                  (sum, product) => sum + product.quantity * product.price,
                                  0
                                )
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                          <div className="border-t border-[#e5e7eb] px-[20px] py-[12px] rounded-b-[16px]">
                            <div className="flex items-center justify-between">
                              <span className="text-[13px] text-[#6b7280] font-['Montserrat']">
                                Hiện thị {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredProducts.length)} của {filteredProducts.length}
                              </span>
                              <div className="flex items-center gap-[8px]">
                                <button
                                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                  disabled={currentPage === 1}
                                  className="px-[12px] py-[6px] text-[13px] font-semibold rounded-[6px] border border-[#d1d5db] bg-white text-[#374151] hover:bg-[#f9fafb] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  Trước
                                </button>

                                <div className="flex items-center gap-[4px]">
                                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                      key={page}
                                      onClick={() => setCurrentPage(page)}
                                      className={`w-[32px] h-[32px] text-[13px] font-semibold rounded-[6px] transition-colors ${currentPage === page
                                        ? 'bg-[#e04d30] text-white'
                                        : 'bg-white border border-[#d1d5db] text-[#374151] hover:bg-[#f9fafb]'
                                        }`}
                                    >
                                      {page}
                                    </button>
                                  ))}
                                </div>

                                <button
                                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                  disabled={currentPage === totalPages}
                                  className="px-[12px] py-[6px] text-[13px] font-semibold rounded-[6px] border border-[#d1d5db] bg-white text-[#374151] hover:bg-[#f9fafb] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  Tiếp
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-[#f3f4f6] rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-[#9ca3af]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <p className="text-[16px] font-['Montserrat'] font-semibold text-[#374151] mb-2">
                          {hasProductSearch
                            ? "Không tìm thấy sản phẩm"
                            : "Danh sách trống"}
                        </p>
                        <p className="text-[14px] text-[#6b7280] mb-4">
                          {hasProductSearch
                            ? `Không có sản phẩm nào khớp với "${productSearch}"`
                            : "Chưa có sản phẩm nào được thêm"}
                        </p>
                        <Button
                          variant="secondary"
                          onClick={() => setProductSearch("")}
                          className="px-[16px] py-[8px] rounded-[8px] text-[13px] bg-[#f3f4f6] text-[#374151] border-0 hover:bg-[#e5e7eb]"
                        >
                          Xóa bộ lọc
                        </Button>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-[#f3f4f6] rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-[#9ca3af]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <p className="text-[18px] font-['Montserrat'] font-bold text-[#374151] mb-2">
                        Chưa có sản phẩm
                      </p>
                      <p className="text-[14px] text-[#6b7280] mb-6 max-w-sm mx-auto">
                        Bắt đầu tạo đơn trả hàng bằng cách thêm sản phẩm cần hoàn trả.
                      </p>
                      {!importId && (
                        <Button
                          variant="secondary"
                          onClick={() => setIsProductFormOpen(true)}
                          className="bg-[#e04d30] text-white border-0 hover:bg-[#c74429] px-[20px] py-[12px] rounded-[10px] text-[14px] font-semibold flex items-center gap-2 mx-auto"
                        >
                          <Icon name="plus" size={16} color="#ffffff" strokeWidth={2.5} />
                          Thêm sản phẩm đầu tiên
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="w-full lg:w-[341px] flex-shrink-0 flex flex-col gap-[12px]">
              {/* Import Information Section */}
              <div className="bg-[#fff6f4] border border-[#ffd0c3] rounded-[20px] w-full">
                <div className="flex flex-col gap-[12px] px-[24px] py-[20px]">
                  <p className="font-['Montserrat'] font-semibold text-[18px] text-[#c74429]">
                    Thông tin đơn nhập
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[14px] font-['Montserrat']">
                      <span className="text-[#737373]">Mã đơn:</span>
                      <span className="font-semibold text-[#272424]">
                        {importCode || (importId ? importId : "Tạo mới")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[14px] font-['Montserrat']">
                      <span className="text-[#737373]">Số sản phẩm:</span>
                      <span className="font-semibold text-[#272424]">{totalProducts}</span>
                    </div>
                    <div className="flex justify-between items-center text-[14px] font-['Montserrat']">
                      <span className="text-[#737373]">Nhà cung cấp:</span>
                      <span className="font-semibold text-[#272424] text-right line-clamp-1">
                        {supplierSearch || "Chưa xác định"}
                      </span>
                    </div>
                    <div className="border-t border-[#ffd0c3] pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[16px] font-['Montserrat'] font-semibold text-[#c74429]">Giá trị đơn:</span>
                        <span className="text-[18px] font-['Montserrat'] font-bold text-[#c74429]">
                          {formatCurrency(totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Summary Section */}
              <div className="bg-white border border-[#d1d1d1] rounded-[20px] w-full">
                <div className="flex flex-col gap-[12px] px-[24px] py-[20px]">
                  <p className="font-['Montserrat'] font-semibold text-[18px] text-[#272424]">Tóm tắt thanh toán</p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[14px] font-['Montserrat']">
                      <span className="text-[#737373]">Số sản phẩm:</span>
                      <span className="font-semibold text-[#272424]">{totalProducts}</span>
                    </div>
                    <div className="flex justify-between items-center text-[14px] font-['Montserrat']">
                      <span className="text-[#737373]">Tổng số lượng:</span>
                      <span className="font-semibold text-[#272424]">
                        {products.reduce((sum, p) => sum + p.quantity, 0)}
                      </span>
                    </div>
                    <div className="border-t border-[#e7e7e7] pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[16px] font-['Montserrat'] font-semibold text-[#272424]">Tổng tiền hoàn trả:</span>
                        <span className="text-[18px] font-['Montserrat'] font-bold text-[#c74429]">
                          {formatCurrency(totalAmount)}
                        </span>
                      </div>
                    </div>
                    {totalAmount > 0 && (
                      <div className="bg-[#fff6f4] border border-[#ffd0c3] rounded-[12px] p-3 mt-3">
                        <p className="text-[12px] text-[#c74429] font-['Montserrat'] leading-relaxed">
                          💡 Số tiền này sẽ được hoàn trả cho nhà cung cấp sau khi đơn được xử lý.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Note Section */}
              <div className="bg-white border border-[#d1d1d1] rounded-[20px] w-full">
                <div className="flex flex-col gap-[10px] px-[24px] py-[20px]">
                  <div className="flex items-center gap-[4px]">
                    <p className="font-['Montserrat'] font-semibold text-[18px] text-[#272424]">
                      Ghi chú lý do trả hàng
                    </p>
                    <span className="text-[#eb2b0b]">*</span>
                  </div>
                  <div className={`border-2 rounded-[12px] h-[120px] p-[12px] transition-colors ${isNoteMissing ? "border-[#c74429] bg-[#fff8f6]" : "border-[#e04d30]"
                    }`}>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Mô tả chi tiết lý do trả hàng (ví dụ: sản phẩm lỗi, không đúng yêu cầu, hết hạn sử dụng...)"
                      maxLength={NOTE_MAX_LENGTH}
                      className="w-full h-full resize-none outline-none font-['Montserrat'] text-[14px] text-[#272424] placeholder:text-[#737373] bg-transparent"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[12px] font-['Montserrat']">
                    <div className="flex flex-col gap-1">
                      <span className={isNoteMissing ? "text-[#c74429]" : "text-[#737373]"}>
                        {isNoteMissing
                          ? "⚠️ Ghi chú là bắt buộc."
                          : "💡 Mô tả lý do trả hàng để dễ theo dõi."}
                      </span>
                    </div>
                    <span className={`${note.length >= NOTE_MAX_LENGTH - 20 ? "text-[#e04d30]" : "text-[#272424]"} font-medium`}>
                      {note.length}/{NOTE_MAX_LENGTH}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Selection Modal */}
        {isProductFormOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={() => setIsProductFormOpen(false)}
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
                      checked={
                        selectedProductIds.length ===
                        filteredMockProducts.length &&
                        filteredMockProducts.length > 0
                      }
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedProductIds(
                            filteredMockProducts.map((p) => p.id)
                          );
                        } else {
                          setSelectedProductIds([]);
                        }
                      }}
                    />
                    <p className="font-['Montserrat'] font-semibold leading-[1.5] text-[14px] text-[#454545]">
                      Sản phẩm
                    </p>
                  </div>
                  <div className="bg-white box-border flex gap-[4px] grow h-[50px] items-center justify-center p-[14px]">
                    <p className="font-['Montserrat'] font-semibold grow leading-[1.5] text-[14px] text-[#454545] text-center">
                      Có thể bán
                    </p>
                  </div>
                </div>

                {/* Product List */}
                <div className="box-border flex flex-col max-h-[400px] items-start px-[15px] py-0 overflow-y-auto bg-white">
                  {filteredMockProducts.map((product) => (
                    <div
                      key={product.id}
                      className="border-b border-[#e7e7e7] box-border flex items-center w-full bg-white"
                    >
                      <div className="bg-white box-border flex gap-[8px] h-full items-start overflow-clip px-[5px] py-[14px] w-[450px]">
                        <Checkbox
                          checked={selectedProductIds.includes(product.id)}
                          onCheckedChange={() =>
                            toggleProductSelection(product.id)
                          }
                        />
                        <div className="h-[38px] w-[38px] bg-gray-200 rounded flex items-center justify-center shrink-0 border border-gray-300"></div>
                        <p className="font-['Montserrat'] font-semibold leading-[1.5] text-[14px] text-black">
                          {product.name}
                        </p>
                      </div>
                      <div className="bg-white box-border flex gap-[4px] grow h-full items-center justify-center p-[14px]">
                        <p className="font-['Montserrat'] font-semibold grow leading-[1.5] text-[14px] text-[#454545] text-center">
                          {product.availableStock}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Buttons */}
                <div className="box-border flex gap-[10px] items-center justify-end px-[16px] py-[12px] shrink-0 bg-white rounded-b-lg">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setIsProductFormOpen(false);
                      setSelectedProductIds([]);
                    }}
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
      </ContentCard>
    </PageContainer>
  );
};

export default AdminWarehouseCreateReturnImport;
