import React from "react";
import mainBanner from "../../../assets/images/banner/main-page-banner.png";

const BannerSection: React.FC = () => {
  return (
    <section className="w-full relative">
      <img
        src={mainBanner}
        alt="Wanderoo Banner"
        className="w-full h-auto object-cover"
      />
    </section>
  );
};

export default BannerSection;
