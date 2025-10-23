import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import EditSupplierModal from "@/components/admin/EditSupplierModal";

// Mock data for the supplier detail page
const mockSupplierData = {
  id: "NCC001",
  name: "Kho Nhật Quang",
  phone: "+84234245969",
  email: "khonhatquang12348@gmail.com",
  address: "Phường Phố Huế, Quận Hai Bà Trưng, Hà Nội",
  note: "Viết ghi chú vào đây"
};

const mockOrderHistory = [
  {
    id: "SRT0002",
    type: "Đơn trả",
    date: "27/8/2025  12:30",
    status1: "Đã hoàn trả",
    status2: "Đã nhận hoàn tiền",
    status1Color: "bg-[#b2ffb4] text-[#04910c]",
    status2Color: "bg-[#b2ffb4] text-[#04910c]"
  },
  {
    id: "SRT0001", 
    type: "Đơn trả",
    date: "27/8/2025  12:30",
    status1: "Chưa nhập",
    status2: "Đã thanh toán",
    status1Color: "bg-[#fec6aa] text-[#eb2b0b]",
    status2Color: "bg-[#b2ffb4] text-[#04910c]"
  }
];

const AdminSupplierDetail = () => {
  document.title = "Chi tiết nhà cung cấp | Wanderoo";
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState(mockSupplierData);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
    setFormData(prev => ({
      ...prev,
      name: updatedData.supplierName,
      phone: updatedData.phone,
      email: updatedData.email,
      address: `${updatedData.street}, ${updatedData.ward}, ${updatedData.district}, ${updatedData.city}`
    }));
  };

  return (
    <div className="flex flex-col gap-[8px] items-center justify-center px-[20px] py-[20px] w-full max-w-[1200px] mx-auto">
      {/* Header with Back Button */}
      <div className="flex items-center gap-[12px] w-full mb-[16px]">
        <button
          onClick={handleBack}
          className="flex items-center justify-center w-[40px] h-[40px] rounded-[8px] hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-[20px] h-[20px] text-[#272424]" />
        </button>
        <h2 className="font-bold text-[#272424] text-[24px] leading-normal">
          Chi tiết nhà cung cấp
        </h2>
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
            <div className="flex gap-[16px] items-center w-[395px]">
              {/* Date Range Input 1 */}
              <div className="flex-1 bg-white border-[1.6px] border-[#e04d30] rounded-[12px] px-[16px] py-[8px] flex items-center gap-[4px]">
                <div className="flex-1 flex items-center gap-[8px]">
                  <p className="font-medium text-[10px] text-[#737373] leading-[1.4]">
                    /           /
                  </p>
                </div>
                <div className="w-[24px] h-[24px] flex items-center justify-center">
                  <Calendar className="w-[16px] h-[16px] text-[#737373]" />
                </div>
              </div>
              
              {/* Arrow */}
              <div className="flex items-center justify-center">
                <ChevronLeft className="w-[24px] h-[24px] text-[#737373]" />
              </div>
              
              {/* Date Range Input 2 */}
              <div className="flex-1 bg-white border-[1.6px] border-[#e04d30] rounded-[12px] px-[16px] py-[10px] flex items-center gap-[4px]">
                <div className="flex-1 flex items-center gap-[8px]">
                  <p className="font-medium text-[10px] text-[#737373] leading-[1.4]">
                    /           /
                  </p>
                </div>
                <div className="w-[24px] h-[24px] flex items-center justify-center">
                  <Calendar className="w-[16px] h-[16px] text-[#737373]" />
                </div>
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
            <div className="flex items-center">
              <p className="font-semibold text-[#322f30] text-[14px] leading-[1.4]">
                Liên hệ
              </p>
            </div>
            <button 
              onClick={handleEdit}
              className="flex items-center gap-[6px] px-[6px] py-0 rounded-[12px] hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <Edit className="w-[16px] h-[16px] text-[#1a71f6]" />
              <p className="font-semibold text-[#1a71f6] text-[12px] leading-[1.4]">
                Chỉnh sửa
              </p>
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
              <div key={order.id} className={`border-b border-[#d1d1d1] px-[16px] py-[8px] ${index === mockOrderHistory.length - 1 ? 'border-b-0' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1 flex flex-col gap-[4px]">
                    <div className="flex items-center">
                      <p className="text-[12px] text-[#737373] leading-[1.5]">
                        <span>{order.type} </span>
                        <span className="font-semibold text-[#1a71f6]">{order.id}</span>
                      </p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-[12px] text-[#737373] leading-[1.5]">
                        {order.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-[15px] items-center justify-end w-[323px]">
                    <div className="flex-1 flex items-center justify-end">
                      <div className={`rounded-[10px] px-[8px] py-[6px] ${order.status1Color}`}>
                        <p className="font-semibold text-[14px] leading-[1.4]">
                          {order.status1}
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center justify-end">
                      <div className={`rounded-[10px] px-[8px] py-[6px] ${order.status2Color}`}>
                        <p className="font-semibold text-[14px] leading-[1.4]">
                          {order.status2}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          <div className="flex gap-[10px] items-start px-[16px] py-[8px]">
            <div className="flex-1 bg-white h-[48px] flex items-center justify-between px-[30px] py-[10px] rounded-[12px]">
              <div className="flex gap-[3px] items-start">
                <div className="flex flex-col justify-center">
                  <p className="font-normal text-[12px] text-[#737373] leading-[1.5]">
                    Đang hiển thị 1 - 10 trong tổng 1 trang
                  </p>
                </div>
              </div>
              <div className="flex gap-[16px] items-start">
                <div className="flex gap-[13px] items-center">
                  <div className="flex flex-col justify-center">
                    <p className="font-normal text-[12px] text-[#454545] leading-[1.5]">
                      Trang số
                    </p>
                  </div>
                  <div className="flex gap-[2px] items-center pl-[8px] pr-[6px] py-[4px] rounded-[8px]">
                    <div className="flex flex-col justify-center">
                      <p className="font-normal text-[12px] text-[#454545] leading-[1.5]">
                        1
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-[6px] items-start">
                  <div className="border border-[#b0b0b0] flex items-start px-[6px] py-[4px] rounded-[8px]">
                    <div className="w-[20px] h-[20px] flex items-center justify-center">
                      <ChevronLeft className="w-[8px] h-[8px] text-[#d1d1d1]" />
                    </div>
                  </div>
                  <div className="border border-[#b0b0b0] flex items-start px-[6px] py-[4px] rounded-[8px]">
                    <div className="w-[20px] h-[20px] flex items-center justify-center">
                      <ChevronRight className="w-[8px] h-[8px] text-[#d1d1d1]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="flex-1 bg-white border border-[#d1d1d1] rounded-[24px] p-[16px] flex flex-col gap-[6px]">
          <div className="flex flex-col gap-[4px] items-start">
            <p className="font-semibold text-[#323130] text-[14px] leading-[1.4]">
              Ghi chú
            </p>
          </div>
          <div className="flex-1 border border-[#d1d1d1] rounded-[12px] p-[16px]">
            <div className="flex items-center w-[17px]">
              <p className="font-normal text-[12px] text-[#737373] leading-[1.5]">
                {formData.note}
              </p>
            </div>
          </div>
        </div>
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