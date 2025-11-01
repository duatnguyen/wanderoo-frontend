import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChipStatus } from "@/components/ui/chip-status";
import { Pagination } from "@/components/ui/pagination";
import EditSupplierModal from "@/components/admin/EditSupplierModal";

// Mock data for the supplier detail page
const mockSupplierData = {
  id: "NCC001",
  name: "Kho Nhật Quang",
  phone: "+84234245969",
  email: "khonhatquang12348@gmail.com",
  address: "Phường Phố Huế, Quận Hai Bà Trưng, Hà Nội",
  note: "Viết ghi chú vào đây",
};

const mockOrderHistory = [
  {
    id: "SRT0002",
    type: "Đơn trả",
    date: "27/8/2025  12:30",
    status1: "completed" as const,
    status1Label: "Đã hoàn trả",
    status2: "completed" as const,
    status2Label: "Đã nhận hoàn tiền",
  },
  {
    id: "SRT0001",
    type: "Đơn trả",
    date: "27/8/2025  12:30",
    status1: "not_imported" as const,
    status1Label: "Chưa nhập",
    status2: "paid" as const,
    status2Label: "Đã thanh toán",
  },
];

const AdminSupplierDetail = () => {
  document.title = "Chi tiết nhà cung cấp | Wanderoo";
  const navigate = useNavigate();

  const [formData, setFormData] = useState(mockSupplierData);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleBack = () => {
    navigate("/admin/warehouse/supplier");
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveSupplier = (updatedData: {
    supplierName: string;
    phone: string;
    email: string;
    street: string;
    ward: string;
    district: string;
    city: string;
  }) => {
    // TODO: Implement API call to update supplier
    console.log("Updating supplier:", updatedData);
    setFormData((prev) => ({
      ...prev,
      name: updatedData.supplierName,
      phone: updatedData.phone,
      email: updatedData.email,
      address: `${updatedData.street}, ${updatedData.ward}, ${updatedData.district}, ${updatedData.city}`,
    }));
  };

  return (
    <div className="flex flex-col gap-[8px] items-start w-full">
      {/* Header with Back Button */}
      <div className="flex items-center gap-[8px] py-[10px]">
        <button
          onClick={handleBack}
          className="flex items-center justify-center w-[32px] h-[32px] hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-[20px] h-[20px] text-[#272424]" />
        </button>
        <h1 className="font-bold text-[#272424] text-[20px] leading-[1.4]">
          {formData.name}
        </h1>
      </div>

      {/* Top Section with Supplier Code and Date Filters */}
      <div className="flex gap-[5px] items-start w-full">
        {/* Left Card - Supplier Code and Statistics */}
        <div className="bg-white border border-[#d1d1d1] rounded-[24px] w-[800px]">
          {/* Header with Supplier Code and Date Filters */}
          <div className="border-b border-[#d1d1d1] flex items-center justify-between p-[16px]">
            <div className="flex items-center">
              <p className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                Mã NCC: {mockSupplierData.id}
              </p>
            </div>
            <div className="flex gap-[16px] items-center">
              {/* Date Range Input 1 */}
              <div className="bg-white border-2 border-[#e04d30] rounded-[12px] px-[16px] py-[10px] flex items-center w-[160px]">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="flex-1 border-0 outline-none bg-transparent text-[12px] font-semibold text-[#737373] w-full"
                  placeholder="/"
                />
              </div>

              {/* Arrow */}
              <div className="text-[#737373]">−</div>

              {/* Date Range Input 2 */}
              <div className="bg-white border-2 border-[#e04d30] rounded-[12px] px-[16px] py-[10px] flex items-center w-[160px]">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="flex-1 border-0 outline-none bg-transparent text-[12px] font-semibold text-[#737373] w-full"
                  placeholder="/"
                />
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="flex items-center justify-between px-[16px] py-[8px]">
            <div className="flex flex-col gap-[8px] items-center">
              <p className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                Đơn nhập đã tạo
              </p>
              <p className="font-medium text-[#272424] text-[10px] leading-[1.4]">
                1 đơn
              </p>
            </div>
            <div className="flex flex-col gap-[8px] items-center">
              <p className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                Đơn nhập chưa thanh toán
              </p>
              <p className="font-medium text-[#272424] text-[10px] leading-[1.4]">
                1 đơn
              </p>
            </div>
            <div className="flex flex-col gap-[8px] items-center">
              <p className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                Đơn trả đã tạo
              </p>
              <p className="font-medium text-[#272424] text-[10px] leading-[1.4]">
                1 đơn
              </p>
            </div>
            <div className="flex flex-col gap-[8px] items-center">
              <p className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                Đơn trả chưa hoàn tiền
              </p>
              <p className="font-medium text-[#272424] text-[10px] leading-[1.4]">
                1 đơn
              </p>
            </div>
          </div>
        </div>

        {/* Right Card - Contact Information */}
        <div className="flex-1 bg-white border border-[#d1d1d1] rounded-[24px] p-[16px] flex flex-col gap-[15px]">
          {/* Contact Header */}
          <div className="flex items-center justify-between">
            <p className="font-semibold text-[#322f30] text-[14px] leading-[1.4]">
              Liên hệ
            </p>
            <button
              onClick={handleEdit}
              className="flex items-center gap-[6px] px-[6px] hover:opacity-80 transition-opacity"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 14L10 6M10 6H4M10 6V12"
                  stroke="#1a71f6"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-semibold text-[#1a71f6] text-[12px] leading-[1.4]">
                Chỉnh sửa
              </span>
            </button>
          </div>

          {/* Contact Details */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <p className="font-medium text-[#322f30] text-[10px] leading-[1.4]">
                Tên nhà cung cấp
              </p>
            </div>
            <div className="flex items-center">
              <p className="font-semibold text-[#1a1a1b] text-[12px] leading-[1.4]">
                {formData.name}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <p className="font-medium text-[#322f30] text-[10px] leading-[1.4]">
                Số điện thoại
              </p>
            </div>
            <div className="flex items-center">
              <p className="font-semibold text-[#1a1a1b] text-[12px] leading-[1.4]">
                {formData.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <p className="font-medium text-[#322f30] text-[10px] leading-[1.4]">
                Địa chỉ
              </p>
            </div>
            <div className="flex items-center">
              <p className="font-semibold text-[#1a1a1b] text-[12px] leading-[1.4]">
                {formData.address}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section with Order History and Notes */}
      <div className="flex gap-[4px] items-start w-full">
        {/* Order History Table */}
        <div className="bg-white border border-[#d1d1d1] rounded-[24px] w-[800px]">
          {/* Table Header */}
          <div className="border-b border-[#d1d1d1] p-[16px]">
            <p className="font-semibold text-[#323130] text-[14px] leading-[1.4]">
              Lịch sử nhập/Trả hàng
            </p>
          </div>

          {/* Table Body */}
          <div className="px-0 py-[8px]">
            {mockOrderHistory.map((order, index) => (
              <div
                key={order.id}
                className={`border-b border-[#d1d1d1] px-[16px] py-[8px] ${
                  index === mockOrderHistory.length - 1 ? "border-b-0" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 flex flex-col gap-[4px]">
                    <div className="flex items-center">
                      <p className="text-[12px] text-[#737373] leading-[1.5]">
                        <span>{order.type} </span>
                        <span className="font-semibold text-[#1a71f6]">
                          {order.id}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-[12px] text-[#737373] leading-[1.5]">
                        {order.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-[15px] items-center justify-end w-[323px]">
                    <ChipStatus
                      status={order.status1}
                      labelOverride={order.status1Label}
                      className="font-bold text-[12px] leading-normal"
                    />
                    <ChipStatus
                      status={order.status2}
                      labelOverride={order.status2Label}
                      className="font-bold text-[12px] leading-normal"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="px-[16px] py-[8px]">
            <Pagination
              current={currentPage}
              total={1}
              onChange={setCurrentPage}
            />
          </div>
        </div>

        {/* Notes Section */}
        <div className="flex-1 bg-white border border-[#d1d1d1] rounded-[24px] p-[16px] flex flex-col gap-[6px]">
          <div className="flex flex-col gap-[4px] items-start">
            <p className="font-semibold text-[#323130] text-[14px] leading-[1.4]">
              Ghi chú
            </p>
          </div>
          <div className="flex-1 border border-[#d1d1d1] rounded-[12px] p-[16px] min-h-[200px]">
            <p className="font-normal text-[12px] text-[#737373] leading-[1.5]">
              {formData.note}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-[12px] justify-end py-[16px] w-full">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Huỷ
        </Button>
        <Button variant="default" onClick={() => console.log("Save clicked")}>
          Lưu
        </Button>
      </div>

      {/* Edit Supplier Modal */}
      <EditSupplierModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        supplierData={formData}
        onSave={handleSaveSupplier}
      />
    </div>
  );
};

export default AdminSupplierDetail;
