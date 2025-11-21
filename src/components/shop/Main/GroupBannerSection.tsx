import React from "react";
import groupBanner1 from "../../../assets/images/banner/group-banner-1.png";
import groupBanner2 from "../../../assets/images/banner/group-banner-2.png";
import groupBanner3 from "../../../assets/images/banner/group-banner-3.png";

const GroupBannerSection: React.FC = () => {
  return (
    <section className="w-full bg-white py-6">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="cursor-pointer hover:opacity-90 transition-opacity">
            <img
              src={groupBanner1}
              alt="Group Banner 1"
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>
          <div className="cursor-pointer hover:opacity-90 transition-opacity">
            <img
              src={groupBanner2}
              alt="Group Banner 2"
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>
          <div className="cursor-pointer hover:opacity-90 transition-opacity">
            <img
              src={groupBanner3}
              alt="Group Banner 3"
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default GroupBannerSection;
