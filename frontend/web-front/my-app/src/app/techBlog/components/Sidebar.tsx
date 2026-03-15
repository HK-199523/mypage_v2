import GoogleAd from "./GoogleAd";
import AffiliateSection from "./AffiliateSection";

export default function Sidebar() {
  return (
    <aside className="md:col-span-3 px-4">
      {/* Google AdSense */}
      <div className="mb-4">
        <GoogleAd />
      </div>

      {/* 楽天アフィリエイト */}
      <AffiliateSection />
    </aside>
  );
}
