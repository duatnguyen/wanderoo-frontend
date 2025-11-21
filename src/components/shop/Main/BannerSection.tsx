import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getHomepageBanners,
  type HomepageBannerResponse,
} from "../../../api/endpoints/homepageApi";
import mainBanner from "../../../assets/images/banner/main-page-banner.png";

const BannerSection: React.FC = () => {
  const { data: banners, isLoading } = useQuery({
    queryKey: ["homepageBanners"],
    queryFn: getHomepageBanners,
  });

  const { heroBanners, subBanners } = useMemo(() => {
    const hero = (banners || []).filter((banner) => {
      const position = (banner.position ?? "").toString().toLowerCase();
      return ["top", "hero"].includes(position);
    });
    const heroList = hero.length > 0 ? hero : (banners || []).slice(0, 1);

    const heroIds = new Set(heroList.map((b) => b.id));
    const subList = (banners || []).filter((banner) => !heroIds.has(banner.id));

    return { heroBanners: heroList, subBanners: subList };
  }, [banners]);

  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    if (heroBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroBanners.length);
    }, 10000); // 10s
    return () => clearInterval(interval);
  }, [heroBanners]);

  // Fallback to static banner if no API data
  if (isLoading || !banners || banners.length === 0) {
    return (
      <section className="w-full relative">
        <img src={mainBanner} alt="Wanderoo Banner" className="w-full h-auto object-cover" />
      </section>
    );
  }

  const currentHero =
    heroBanners.length > 0 ? heroBanners[currentHeroIndex % heroBanners.length] : null;

  const renderBannerImage = (banner: HomepageBannerResponse, className = "") => (
    <a
      key={banner.id}
      href={banner.linkUrl || "#"}
      className={`block w-full h-full ${className}`}
      onClick={(e) => {
        if (!banner.linkUrl) {
          e.preventDefault();
        }
      }}
    >
      <img
        src={banner.imageUrl || mainBanner}
        alt={banner.title}
        className="w-full h-full object-cover rounded-none"
        onError={(e) => {
          (e.target as HTMLImageElement).src = mainBanner;
        }}
      />
    </a>
  );

  return (
    <section className="w-full bg-white pt-0 pb-6">
      <div className="w-full">
        <div className="relative overflow-hidden rounded-none min-h-[320px] w-full">
          {currentHero && renderBannerImage(currentHero, "h-full")}
          {heroBanners.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {heroBanners.map((banner, index) => (
                <button
                  key={banner.id}
                  onClick={() => setCurrentHeroIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentHeroIndex ? "bg-white" : "bg-white/50"
                  }`}
                  aria-label={`Banner ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {subBanners.length > 0 && (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subBanners.slice(0, 3).map((banner) => (
              <div key={banner.id} className="h-[150px]">
                {renderBannerImage(banner, "h-full")}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BannerSection;

