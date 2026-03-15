"use client";

import { useState } from "react";
import Image from "next/image";

// =====================================================================
// ★ 楽天アフィリエイト設定
//   https://affiliate.rakuten.co.jp/ で商品リンクを作成し、
//   affiliateUrl と imageUrl を差し替えてください。
// =====================================================================
const RAKUTEN_PRODUCTS = [
  {
    title: "プロを目指す人のためのTypeScript入門",
    // ★ 楽天アフィリエイトの商品画像URLに差し替え
    imageUrl: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/1111/9784297131111.jpg",
    // ★ 楽天アフィリエイトのリンクURLに差し替え
    affiliateUrl: "https://hb.afl.rakuten.co.jp/ichiba/YOUR_AFFILIATE_ID/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fbook%2F17212915%2F",
    price: "¥3,300",
  },
  {
    title: "Linuxのしくみ 増補改訂版",
    imageUrl: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/8238/9784297138238.jpg",
    affiliateUrl: "https://hb.afl.rakuten.co.jp/ichiba/YOUR_AFFILIATE_ID/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fbook%2F17538945%2F",
    price: "¥2,860",
  },
  {
    title: "ロジクール MX Keys Mini キーボード",
    imageUrl: "https://thumbnail.image.rakuten.co.jp/@0_mall/jism/cabinet/0734/4943765051731.jpg",
    affiliateUrl: "https://hb.afl.rakuten.co.jp/ichiba/YOUR_AFFILIATE_ID/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fjism%2F4943765051731%2F",
    price: "¥14,850",
  },
];

// =====================================================================
// ★ Amazonアソシエイト設定
//   https://affiliate.amazon.co.jp/ で商品リンクを作成し、
//   affiliateUrl と imageUrl を差し替えてください。
//   imageUrl は Amazon商品ページの og:image または
//   アソシエイトツールバーの「画像リンク」から取得できます。
// =====================================================================
const AMAZON_PRODUCTS = [
  {
    title: "プロを目指す人のためのTypeScript入門",
    // ★ Amazon商品画像URLに差し替え（例: https://m.media-amazon.com/images/I/XXXX.jpg）
    imageUrl: "https://m.media-amazon.com/images/I/51yBNNiNAuL._SX350_BO1,204,203,200_.jpg",
    // ★ AmazonアソシエイトのリンクURLに差し替え
    affiliateUrl: "https://www.amazon.co.jp/dp/4297131110?tag=YOUR_ASSOCIATE_TAG",
    price: "¥3,300",
  },
  {
    title: "Linuxのしくみ 増補改訂版",
    imageUrl: "https://m.media-amazon.com/images/I/51vHx+X0nkL._SX350_BO1,204,203,200_.jpg",
    affiliateUrl: "https://www.amazon.co.jp/dp/429713820X?tag=YOUR_ASSOCIATE_TAG",
    price: "¥2,860",
  },
  {
    title: "ロジクール MX Keys Mini",
    imageUrl: "https://m.media-amazon.com/images/I/61mzfTvzH2L._AC_UY218_.jpg",
    affiliateUrl: "https://www.amazon.co.jp/dp/B09BRDXJ51?tag=YOUR_ASSOCIATE_TAG",
    price: "¥14,980",
  },
];

type Tab = "rakuten" | "amazon";

function ProductCard({
  product,
  store,
}: {
  product: (typeof RAKUTEN_PRODUCTS)[number];
  store: Tab;
}) {
  const isRakuten = store === "rakuten";

  return (
    <a
      href={product.affiliateUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="block border rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white"
    >
      <div className="flex gap-2 p-2">
        <div className="w-16 h-16 flex-shrink-0 relative bg-gray-100 rounded overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            sizes="64px"
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-tight">
            {product.title}
          </p>
          <p className="text-sm font-bold text-red-600 mt-1">{product.price}</p>
        </div>
      </div>
      <div
        className={`text-white text-xs text-center py-1 font-medium ${
          isRakuten ? "bg-red-500" : "bg-orange-500"
        }`}
      >
        {isRakuten ? "楽天市場で見る" : "Amazonで見る"}
      </div>
    </a>
  );
}

export default function AffiliateSection() {
  const [activeTab, setActiveTab] = useState<Tab>("rakuten");

  return (
    <div className="mt-6">
      <h3 className="text-sm font-bold text-gray-700 mb-3 border-b pb-1">
        おすすめ商品
      </h3>

      {/* タブ */}
      <div className="flex mb-3 rounded-lg overflow-hidden border text-xs font-medium">
        <button
          onClick={() => setActiveTab("rakuten")}
          className={`flex-1 py-1.5 transition-colors ${
            activeTab === "rakuten"
              ? "bg-red-500 text-white"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          楽天
        </button>
        <button
          onClick={() => setActiveTab("amazon")}
          className={`flex-1 py-1.5 transition-colors ${
            activeTab === "amazon"
              ? "bg-orange-500 text-white"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          Amazon
        </button>
      </div>

      {/* 商品カード */}
      <div className="flex flex-col gap-3">
        {(activeTab === "rakuten" ? RAKUTEN_PRODUCTS : AMAZON_PRODUCTS).map(
          (product, index) => (
            <ProductCard key={index} product={product} store={activeTab} />
          )
        )}
      </div>

      <p className="text-xs text-gray-400 mt-2 text-center">
        ※ 広告・アフィリエイトリンクを含みます
      </p>
    </div>
  );
}
