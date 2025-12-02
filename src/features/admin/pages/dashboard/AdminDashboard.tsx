import React from "react";

const AdminDashboard: React.FC = () => {
  return (
    <div className="w-full">
      {/* Hero Section với background cảnh núi rừng */}
      <div 
        className="relative w-full h-screen rounded-[24px] overflow-hidden"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay để text dễ đọc hơn */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40"></div>
        
        {/* Text Overlay */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-white text-2xl md:text-3xl font-semibold mb-4 drop-shadow-lg">
            CHINH PHỤC TỪNG ĐỈNH CAO
          </h2>
          <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-bold drop-shadow-lg">
            TỪNG ĐƠN HÀNG
          </h1>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
