import React from "react";
import subBanner from "../../../assets/images/banner/sub-banner.png";

const SubBannerSection: React.FC = () => {
  return (
    <section className="w-full bg-white py-6">
      <div className="max-w-[1200px] mx-auto px-4">
        <img
          src={subBanner}
          alt="Wanderoo Sub Banner"
          className="w-full h-auto object-cover rounded-lg"
        />
      </div>
    </section>
  );
};

export default SubBannerSection;

