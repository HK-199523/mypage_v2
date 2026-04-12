"use client";

import { useEffect } from "react";
import Script from 'next/script'

// ★ AdSense審査通過後に以下2つを差し替えてください
const PUBLISHER_ID = "ca-pub-8562356956590385";
const AD_SLOT_ID = "7746306885";



declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

<Script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
  strategy="afterInteractive"
  data-ad-client="ca-pub-8562356956590385"
/>

export default function GoogleAd() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSenseスクリプト未読み込み時は無視
    }
  }, []);

  // Publisher IDが未設定の場合はプレースホルダーを表示
  if (PUBLISHER_ID === "ca-pub-8562356956590385") {
    return (
      <div className="w-full bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-xs text-center p-4 min-h-[250px]">
        <div>
          <p className="font-semibold mb-1">Google AdSense</p>
          <p>審査通過後にIDを設定すると</p>
          <p>ここに広告が表示されます</p>
        </div>
      </div>
    );
  }

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
