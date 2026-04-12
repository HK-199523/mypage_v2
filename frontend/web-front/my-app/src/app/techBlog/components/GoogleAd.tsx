"use client";

import { useEffect } from "react";

const PUBLISHER_ID = "ca-pub-8562356956590385";
const AD_SLOT_ID = "7746306885";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function GoogleAd() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSenseスクリプト未読み込み時は無視
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client={PUBLISHER_ID}
      data-ad-slot={AD_SLOT_ID}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
