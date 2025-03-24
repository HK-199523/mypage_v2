"use client";

import React, { useEffect, useState } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs: any) => twMerge(clsx(inputs));

export type BurgerMenuType = {
  width?: number;
  menu: MenuType;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  backgroundColor?: string;
  className?: string;
  direction?: "right" | "left";
};

export type BurgerIconType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  size?: number;
  borderWidth?: number;
  borderColor?: string;
  className?: string;
};

export type MenuType = MenuItemType[];

export type MenuItemType = {
  id: number;
  title: string;
} & (
  | {
      isParent: true;
      children: MenuItemType[];
    }
  | {
      isParent?: false;
      href: string;
    }
);

type AccordionType = {
  title: string;
  children: MenuType;
  className?: string;
  open: boolean;
};

type MenuLinkType = {
  title: string;
  href: string;
  num: number;
  open: boolean;
  className?: string;
};

export const MenuLink = ({ title, href, num, open, className = "" }: MenuLinkType) => {
  const delay = Math.min(num * 50 + 150, 1000); // 遅延時間を制限
  return (
    <li
      key={num}
      className={cn(
        "group py-1 transition-all duration-400",
        open ? "ml-0 opacity-100" : "-ml-52 opacity-0",
        className
      )}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      <a href={href} className="inline-flex w-full items-center">
        {title}
        <span className="ml-2 size-1.5 rotate-45 border-r border-t border-slate-500 transition-all group-hover:ml-2.5" />
      </a>
    </li>
  );
};

const AccordionIcon = ({ accordionOpen = false }: { accordionOpen: boolean }) => {
  return (
    <span
      className={cn(
        "relative flex size-[15px] items-center justify-center transition-transform duration-300",
        accordionOpen ? "rotate-45" : "rotate-0"
      )}
    >
      <span className="absolute h-full w-px bg-slate-800 transition-opacity duration-300" />
      <span className="absolute m-auto h-px w-full bg-slate-800" />
    </span>
  );
};

export const Accordion = ({ title, children, className, open }: AccordionType) => {
  const [accordionOpen, setAccordionOpen] = useState(false);
  return (
    <li
      className={cn(
        "transition-all duration-400",
        open ? "ml-0 opacity-100" : "-ml-52 opacity-0",
        className
      )}
    >
      <summary
        className="relative flex w-full cursor-pointer items-center justify-between"
        onClick={() => setAccordionOpen(!accordionOpen)}
      >
        <span>{title}</span>
        <span className="absolute right-4 top-[3px] pb-2 text-3xl opacity-50">
          <AccordionIcon accordionOpen={accordionOpen} />
        </span>
      </summary>
      <ul
        className={cn(
          "ml-1 mt-1 pl-4 border-l transition-all duration-300",
          accordionOpen ? "visible h-auto opacity-100" : "invisible h-0 opacity-0"
        )}
      >
        {children.map((e, cKey) => (
          <MenuLink
            key={e.id}
            title={e.title}
            href={e.isParent ? "" : e.href}
            num={cKey}
            open={open}
            className={accordionOpen ? "ml-0 opacity-100" : "-ml-4 opacity-0"}
          />
        ))}
      </ul>
    </li>
  );
};

export const BurgerIcon = ({
  open,
  setOpen,
  size = 30,
  borderWidth = 2,
  borderColor = "#000",
  className = "md:hidden",
}: BurgerIconType) => {
  const height = size * 0.65;
  const common = "w-full absolute pointer-events-none";
  return (
    <div
      className={cn("burger-wrapper z-10000 fixed top-4 right-4 cursor-pointer p-1.5 md:hidden", className)}
      onClick={() => setOpen(!open)}
    >
      <div className="relative flex w-10 h-8 flex-col justify-between cursor-pointer">
        <span
          className={cn(
            common,
            open
              ? "rotate-45 top-1/2 transition-transform duration-300 delay-200"
              : "top-0 transition-transform duration-300 delay-0"
          )}
          style={{
            height: `${borderWidth}px`,
            backgroundColor: borderColor,
            top: open ? `${height / 2}px` : "0px",
          }}
        />
        <span
          className={cn(
            common,
            "transition-opacity duration-200",
            open ? "opacity-0" : "opacity-100 delay-200"
          )}
          style={{
            top: `${height / 2}px`,
            height: `${borderWidth}px`,
            backgroundColor: borderColor,
          }}
        />
        <span
          className={cn(
            common,
            open
              ? "-rotate-45 top-1/2 transition-transform duration-300 delay-200"
              : "transition-transform duration-300 delay-0"
          )}
          style={{
            top: open ? `${height / 2}px` : `${height}px`,
            height: `${borderWidth}px`,
            backgroundColor: borderColor,
          }}
        />
      </div>
    </div>
  );
};

export const BurgerMenu = ({
  menu,
  open,
  setOpen,
  width = 300,
  backgroundColor = "#fff",
  className = "md:hidden",
  direction = "right",
}: BurgerMenuType) => {
  useEffect(() => {
    if (open) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [open]);

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-screen w-screen transition-opacity duration-300",
        open ? "visible opacity-100" : "invisible opacity-0",
        className
      )}
    >
      <div
        className="fixed left-0 top-0 z-90 h-screen w-screen bg-black/30 backdrop-blur transition-opacity duration-300"
        onClick={() => setOpen(false)}
      />
      <div
        className={cn(
          "absolute z-90 h-screen overflow-y-auto shadow-[0_6px_30px_-4px_rgba(17,33,95,0.2)] transition-all duration-300",
          open
            ? direction === "left"
              ? "left-0"
              : "right-0"
            : direction === "left"
              ? "-left-full"
              : "-right-full"
        )}
        style={{
          width: `${width}px`,
          backgroundColor: backgroundColor,
        }}
      >
        <nav className="p-4 pt-16">
          <ul className="flex flex-col gap-3">
            {menu.map((e, key) =>
              e.isParent ? (
                <Accordion
                  key={e.id}
                  title={e.title}
                  children={e.children}
                  open={open}
                  className="transition-opacity duration-500"
                />
              ) : (
                <MenuLink
                  key={e.id}
                  title={e.title}
                  href={e.href}
                  num={key}
                  open={open}
                />
              )
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};
