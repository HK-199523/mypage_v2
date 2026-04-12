"use client";

import { useEffect, useRef } from "react";

const PUBLISHER_ID = "ca-pub-8562356956590385";
const AD_SLOT_ID = "7746306885";

// モジュールレベルのWeakSetでpush済み要素を同期的に追跡
// （data-adsbygoogle-statusは非同期設定のため使用不可）
const pushedElements = new WeakSet<Element>();

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function GoogleAd() {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (!adRef.current) return;
    // 同じDOM要素へのpush()をスキップ（StrictMode二重実行・再マウント対策）
    if (pushedElements.has(adRef.current)) return;
    pushedElements.add(adRef.current);
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
