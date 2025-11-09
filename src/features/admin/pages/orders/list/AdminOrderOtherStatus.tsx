
import { useNavigate } from "react-router-dom";
import { PageContainer, ContentCard } from "@/components/common";
import { Package, Truck, Clock, CheckCircle, XCircle } from "lucide-react";

const AdminOrderOtherStatus = () => {
  document.title = "Demo Trạng thái đơn hàng | Wanderoo";
  const navigate = useNavigate();

  const statusDemos = [
    {
      status: "Chờ xác nhận",
      description: "Đơn hàng mới được tạo, chờ xác nhận từ admin",
      icon: Clock,
      color: "bg-gray-100 border-gray-300 text-gray-600",
      hoverColor: "hover:bg-gray-200",
    },
    {
      status: "Đã xác nhận",
      description: "Đơn hàng đã được xác nhận, đang chuẩn bị hàng",
      icon: CheckCircle,
      color: "bg-green-100 border-green-300 text-green-700",
      hoverColor: "hover:bg-green-200",
    },
    {
      status: "Đang giao",
      description: "Đơn hàng đang được vận chuyển đến khách hàng",
      icon: Truck,
      color: "bg-blue-100 border-blue-300 text-blue-700",
      hoverColor: "hover:bg-blue-200",
    },
    {
      status: "Đã hoàn thành",
      description: "Đơn hàng đã được giao thành công",
      icon: Package,
      color: "bg-emerald-100 border-emerald-300 text-emerald-700",
      hoverColor: "hover:bg-emerald-200",
    },
    {
      status: "Đã hủy",
      description: "Đơn hàng đã bị hủy bởi khách hàng hoặc admin",
      icon: XCircle,
      color: "bg-red-100 border-red-300 text-red-700",
      hoverColor: "hover:bg-red-200",
    },
  ];

  const handleStatusClick = (status: string, source: "Website" | "POS" = "Website") => {
    // Navigate to order detail with status in state
    const orderId = source === "Website" ? "WEB001" : "POS001";
    navigate(`/admin/orders/${orderId}`, {
      state: { status, source }
    });
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-[20px] w-full">
        <div className="flex flex-col gap-[8px] items-start justify-center w-full">
          <h1 className="font-montserrat font-bold text-[#272424] text-[24px] leading-[1.5]">
            Demo Trạng thái đơn hàng
          </h1>
          <p className="font-montserrat font-medium text-[#737373] text-[16px] leading-[1.4]">
            Click vào các trạng thái bên dưới để xem giao diện chi tiết đơn hàng
          </p>
        </div>

        <ContentCard>
          <div className="flex flex-col gap-[24px] w-full">
            <h2 className="font-montserrat font-semibold text-[#272424] text-[20px] leading-[1.4]">
              Đơn hàng Website
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
              {statusDemos.map((demo) => {
                const IconComponent = demo.icon;
                return (
                  <div
                    key={`website-${demo.status}`}
                    onClick={() => handleStatusClick(demo.status, "Website")}
                    className={`${demo.color} ${demo.hoverColor} border-2 rounded-[12px] p-[20px] cursor-pointer transition-all duration-200 hover:shadow-md`}
                  >
                    <div className="flex flex-col gap-[12px] items-start">
                      <div className="flex items-center gap-[12px]">
                        <div className="flex items-center justify-center w-[40px] h-[40px] bg-white bg-opacity-70 rounded-full">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col gap-[2px] flex-1 min-w-0">
                          <h3 className="font-montserrat font-bold text-[16px] leading-[1.2] truncate">
                            {demo.status}
                          </h3>
                          <p className="font-montserrat font-medium text-[12px] leading-[1.3] opacity-80">
                            Website Order
                          </p>
                        </div>
                      </div>
                      <p className="font-montserrat font-medium text-[14px] leading-[1.4] opacity-90">
                        {demo.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <h2 className="font-montserrat font-semibold text-[#272424] text-[20px] leading-[1.4] mt-[20px]">
              Đơn hàng POS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
              {statusDemos.map((demo) => {
                const IconComponent = demo.icon;
                return (
                  <div
                    key={`pos-${demo.status}`}
                    onClick={() => handleStatusClick(demo.status, "POS")}
                    className={`${demo.color} ${demo.hoverColor} border-2 rounded-[12px] p-[20px] cursor-pointer transition-all duration-200 hover:shadow-md`}
                  >
                    <div className="flex flex-col gap-[12px] items-start">
                      <div className="flex items-center gap-[12px]">
                        <div className="flex items-center justify-center w-[40px] h-[40px] bg-white bg-opacity-70 rounded-full">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col gap-[2px] flex-1 min-w-0">
                          <h3 className="font-montserrat font-bold text-[16px] leading-[1.2] truncate">
                            {demo.status}
                          </h3>
                          <p className="font-montserrat font-medium text-[12px] leading-[1.3] opacity-80">
                            POS Order
                          </p>
                        </div>
                      </div>
                      <p className="font-montserrat font-medium text-[14px] leading-[1.4] opacity-90">
                        {demo.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ContentCard>
      </div>
    </PageContainer>
  );
};

export default AdminOrderOtherStatus;
