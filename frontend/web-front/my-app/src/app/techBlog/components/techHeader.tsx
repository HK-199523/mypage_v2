"use client";

import React from "react"
import ReactDOM from "react-dom"
import { BurgerIcon, BurgerMenu, MenuType, MenuItemType } from "@/app/techBlog/components/hamBurgerMenu"

const menu: MenuType = [
    { id:0, title: "TOP", href: "#" },
    { id:1, title: "NEWS", href: "#" },
    { id:2, title: "ARTICLE", href: "#" },
    {
      id:3, 
      title: "BLOG",
      isParent: true,
      children: [
        { id:4, title: "TECH", href: "#" },
        { id:5, title: "HOBBY", href: "#" },
        { id:6, title: "OTHER", href: "#" },
      ],
    },
    {
      id:7, 
      title: "CONTACT",
      isParent: true,
      children: [
        { id:8, title: "MAIL", href: "#" },
        { id:9, title: "LINE", href: "#" }
      ],
    },
  ];

function handleMenuItem(item : MenuItemType){
  if(!item.isParent) {
    return item.href
  }
  
}


export default function Header() {
  const [open, setOpen] = React.useState(false);
  
  return (
    <div className="flex min-h-[100vh] min-w-[100vw] flex-col">
      <header className="relative flex w-[100vw] justify-center border-b-[1px] p-3">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-left flex-1">
          INARI TECH
        </h1>
        <div className="flex gap-5 pr-3"></div>
        {/* デスクトップメニュー */}
        <nav className="hidden md:flex md:ml-auto flex flex-wrap items-center text-base justify-center">          
          {menu.map((item, index) => (
            item.isParent ? (
              <div key={`${item.id}-${index}`} className="relative group">
                <span className="mr-5 text-lg font-medium">{item.title}</span>
                <div className="absolute hidden group-hover:block bg-white shadow-md">
                  {item.children.map((child, childIndex) => (
                    <a key={`${child.id}-${childIndex}`} href={handleMenuItem(child)} className="block mr-5 hover:text-gray-900">
                      {child.title}
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <a key={`${item.id}-${index}`} href={item.href} className="mr-5 hover:text-gray-900">
                {item.title}
              </a>
            )
          ))}
        </nav>
      </header>

      {/* モバイル用メニュー（先に描画） */}
      <BurgerMenu open={open} setOpen={setOpen} menu={menu} />

      {/* BurgerIcon を後ろに移動（z-[10000]などで最前面に） */}
      <BurgerIcon
        key="Icon"
        open={open}
        setOpen={setOpen}
        size={40}
        borderWidth={2}
        className="fixed right-3 top-3 z-[10000]" // z-index強化
      />
    </div>
  );
}
  