"use client";

import React, { useState } from "react";
import { BurgerIcon, BurgerMenu, MenuType, MenuItemType } from "@/app/techBlog/components/hamBurgerMenu";

const menu: MenuType = [
  { id: 0, title: "TOP", href: "#" },
  { id: 1, title: "NEWS", href: "#" },
  { id: 2, title: "ARTICLE", href: "#" },
  {
    id: 3,
    title: "BLOG",
    isParent: true,
    children: [
      { id: 4, title: "TECH", href: "#" },
      { id: 5, title: "HOBBY", href: "#" },
      { id: 6, title: "OTHER", href: "#" },
    ],
  },
  {
    id: 7,
    title: "CONTACT",
    isParent: true,
    children: [
      { id: 8, title: "MAIL", href: "#" },
      { id: 9, title: "LINE", href: "https://lin.ee/WQmbO4L" },
    ],
  },
];

function handleMenuItem(item: MenuItemType) {
  if (!item.isParent) {
    return item.href;
  }
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [openParentIndex, setOpenParentIndex] = useState<number | null>(null);

  const toggleSubMenu = (index: number) => {
    setOpenParentIndex(openParentIndex === index ? null : index);
  };

  return (
    <div className="flex min-w-[100vw] flex-col z-10">
      <header className="relative flex w-[100vw] justify-center border-b-[1px] p-3">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-left flex-1">
          Chacon Tech
        </h1>
        <div className="flex gap-5 pr-3"></div>

        {/* デスクトップメニュー */}
        <nav className="hidden md:flex md:ml-auto flex flex-wrap items-center text-base justify-center">
          <ul className="flex space-x-6 items-center">
            {menu.map((item, index) =>
              item.isParent ? (
                <li
                  key={`${item.id}-${index}`}
                  className="relative w-24"
                  onClick={() => toggleSubMenu(index)}
                >
                  <span className="cursor-pointer text-lg font-medium hover:text-gray-900">
                    {item.title}
                  </span>
                  {openParentIndex === index && (
                    <ul className="absolute left-0 bg-[#ffffff] mt-2 shadow-md rounded p-2 z-100">
                      {item.children.map((child, childIndex) => (
                        <li 
                          key={`${child.id}-${childIndex}`}
                          className="w-24"
                        >
                          <a
                            href={handleMenuItem(child)}
                            className="block w-full px-4 py-2 text-sm !bg-white"
                          >
                            {child.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ) : (
                <li 
                  key={`${item.id}-${index}`}
                  className="w-24"
                >
                  <a
                    href={item.href}
                    className="text-lg font-medium hover:text-gray-900"
                  >
                    {item.title}
                  </a>
                </li>
              )
            )}
          </ul>
        </nav>
      </header>

      {/* モバイル用メニュー */}
      <BurgerMenu open={open} setOpen={setOpen} menu={menu} />

      {/* ハンバーガーアイコン */}
      <BurgerIcon
        key="Icon"
        open={open}
        setOpen={setOpen}
        size={40}
        borderWidth={2}
        className="fixed right-3 top-3 z-[10000]"
      />
    </div>
  );
}
