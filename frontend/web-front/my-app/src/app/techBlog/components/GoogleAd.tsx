"use client";

import { useEffect, useRef } from "react";

const PUBLISHER_ID = "ca-pub-8562356956590385";
const AD_SLOT_ID = "7746306885";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function GoogleAd() {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    // すでに広告が初期化済みの場合はスキップ（StrictModeや再マウント対策）
    if (adRef.current?.getAttribute("data-adsbygoogle-status")) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSenseスクリプト未読み込み時は無視
    }
  }, []);

  return (
    <ins
      ref={adRef}
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client={PUBLISHER_ID}
      data-ad-slot={AD_SLOT_ID}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
