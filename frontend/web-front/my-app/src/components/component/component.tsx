'use client';
/**
* This code was generated by v0 by Vercel.
* @see https://v0.dev/t/1IDrlrYLtWW
* Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
*/

/** Add fonts into your Next.js project:

import { Cormorant_Garamond } from 'next/font/google'
import { Judson } from 'next/font/google'

cormorant_garamond({
  subsets: ['latin'],
  display: 'swap',
})

judson({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
import Link from "next/link"
import {Zen_Kurenaido,Russo_One} from 'next/font/google'
import {gsap} from "gsap"
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Link as ScrollLink } from "react-scroll";

import '@splidejs/splide/css'; // デフォルトのテーマを読み込んでいます（コアスタイルのみ読み込む設定も可能）
import { Slider1, Slider2 } from "../ui/slider"

const ScrollLinkAny = ScrollLink as any;


const LoadingSpinner = () => {
  return (
    <div className="backcover">
      <div className="wrapper">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="shadow"></div>
        <div className="shadow"></div>
        <div className="shadow"></div>
        <span>sending</span>
      </div>
    </div>
  );
};

export function Component() {
  
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (!isLoading) return;
    // CSS(email送信のloading画面に関して)
    const style = document.createElement('style');
    style.textContent = `
      .backcover{
          padding:0;
          margin:0;
          width:100%;
          height:100vh;
          background:radial-gradient(#9b59b6,rgb(226, 241, 5));
      }
      .wrapper{
          width:200px;
          height:60px;
          position: absolute;
          left:50%;
          top:50%;
          transform: translate(-50%, -50%);
      }
      .circle{
          width:20px;
          height:20px;
          position: absolute;
          border-radius: 50%;
          background-color: #fff;
          left:15%;
          transform-origin: 50%;
          animation: circle .5s alternate infinite ease;
      }

      @keyframes circle{
          0%{
              top:60px;
              height:5px;
              border-radius: 50px 50px 25px 25px;
              transform: scaleX(1.7);
          }
          40%{
              height:20px;
              border-radius: 50%;
              transform: scaleX(1);
          }
          100%{
              top:0%;
          }
      }
      .circle:nth-child(2){
          left:45%;
          animation-delay: .2s;
      }
      .circle:nth-child(3){
          left:auto;
          right:15%;
          animation-delay: .3s;
      }
      .shadow{
          width:20px;
          height:4px;
          border-radius: 50%;
          background-color: rgba(0,0,0,.5);
          position: absolute;
          top:62px;
          transform-origin: 50%;
          z-index: -1;
          left:15%;
          filter: blur(1px);
          animation: shadow .5s alternate infinite ease;
      }

      @keyframes shadow{
          0%{
              transform: scaleX(1.5);
          }
          40%{
              transform: scaleX(1);
              opacity: .7;
          }
          100%{
              transform: scaleX(.2);
              opacity: .4;
          }
      }
      .shadow:nth-child(4){
          left: 45%;
          animation-delay: .2s
      }
      .shadow:nth-child(5){
          left:auto;
          right:15%;
          animation-delay: .3s;
      }
      .wrapper span{
          position: absolute;
          top:75px;
          font-family: 'Lato';
          font-size: 20px;
          letter-spacing: 12px;
          color: #000;
          left:15%;
      }`;
    
    document.head.append(style);
    return () => {
      document.head.removeChild(style); // クリーンアップ
    }
  });

  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    message: "",
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormValues({
      ...formValues,
      [name]: value
    })
  };

  const mailSend = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    try {
        const csrfToken = getCsrfToken();
        const response = await axios.post('http://localhost:8080/api/send_email/', {
          name:formValues.name,
          email: formValues.email,
          message: formValues.message
        },{
          headers: {
            'X-CSRFToken': csrfToken,   //CSRFトークンをリクエストヘッダーに追加
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });
        console.log(response);
        mailInputclear();
        setIsLoading(false);
        alert('メールが送信されました！');
    } catch (error) {
        console.error('メール送信エラー:', error);
        setIsLoading(false);
        alert('送信に失敗しました');
    }
  };

  function getCsrfToken() {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith('csrftoken=')) {
            return cookie.split('=')[1];
        }
    }
    return '';
  };

   function mailInputclear () {
    setFormValues({
      name:"",
      email:"",
      message:""
    })
  };
  
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="bg-[#8b4513] border-b px-4 lg:px-6 h-14 flex items-center justify-between fixed top-0 left-0 right-0 z-10 backdrop-blur-md">
        <Link href="#" className="flex items-center" prefetch={false}>
          <MonitorIcon className="h-6 w-6 text-[#ffd700]" />
          <span className="sr-only">Monicle Financial</span>
          <div className={`${russoOne.className} ml-4 text-[#ffd700] text-3xl	`}>Chacon</div>
        </Link>
        <div className="flex items-center">
          <nav className="hidden lg:flex gap-4 sm:gap-6">
            <Link
              href="/"
              className="text-1xl font-medium hover:underline underline-offset-4 text-[#ffd700]"
              prefetch={false}
            >
              Home
            </Link>
            <Link
              href="#"
              className="text-1xl font-medium hover:underline underline-offset-4 text-[#ffd700]"
              prefetch={false}
            >
              About
            </Link>
            <Link
              href="#"
              className="text-1xl font-medium hover:underline underline-offset-4 text-[#ffd700]"
              prefetch={false}
            >
              Services
            </Link>
            <Link
              href="#"
              className="text-1xl font-medium hover:underline underline-offset-4 text-[#ffd700]"
              prefetch={false}
            >
              Blog
            </Link>
            <ScrollLinkAny
              to="mailSection" smooth={true} duration={500}
              className="text-1xl font-medium hover:underline underline-offset-4 text-[#ffd700]"
              //prefetch={false}
            >
              Contact
            </ScrollLinkAny>
          </nav>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden bg-[#ffd700] text-[#8b4513]">
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#ffd700] text-[#8b4513]">
              <div className="grid gap-4 p-6">
                <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
                  Home
                </Link>
                <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
                  About
                </Link>
                <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
                  Services
                </Link>
                <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
                  Blog
                </Link>
                <ScrollLinkAny to="mailSection" smooth={true} duration={500} className="text-sm font-medium hover:underline underline-offset-4" /*prefetch={false}*/>
                  Contact
                </ScrollLinkAny>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <Button className="hidden lg:inline-flex bg-[#8b4513] text-[#ffd700] hover:bg-[#a0522d]">Get a Quote</Button>
      </header>
      <main className="flex-1">
        <section className="py-16 md:py-20 lg:py-28 bg-[#ffd700]">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-[#8b4513]">
                  Chacon公式サイト
                </h1>
                <p className={`${zenKurenaido.className} text-[#8b4513] md:text-xl `}>
                  色々なことをゆるゆる発信していくサイトになります。ITについてのナレッジや自分の趣味の発信をするサイトになります。ゆっくりご覧ください。
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="#"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-[#8b4513] px-8 text-sm font-medium text-[#ffd700] shadow transition-colors hover:bg-[#a0522d] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Blog
                  </Link>
                </div>
              </div>
              <Slider1/>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-20 lg:py-28 bg-[#ffd700]">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <Slider2/>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-[#8b4513]">
                  個人的な開発について
                </h2>
                <p className={`${zenKurenaido.className} text-[#8b4513] md:text-xl`}>
                  一からサイトを作成しているのでサイトについて興味をお持ちでしたら下記からご気軽にご連絡をお願いいたします。
                  サイト以外にシステムの開発など受け付けております。
                  LINEもしくはメールにてご気軽にご連絡ください。
                </p>
                <ScrollLinkAny
                  to="mailSection" smooth={true} duration={500} 
                  className="inline-flex h-10 items-center justify-center rounded-md bg-[#8b4513] px-8 text-sm font-medium text-[#ffd700] shadow transition-colors hover:bg-[#a0522d] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  //prefetch={false}
                >
                  メール
                </ScrollLinkAny>
                <Link
                  href="https://lin.ee/WQmbO4L"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-[#8b4513] px-8 text-sm font-medium text-[#ffd700] shadow transition-colors hover:bg-[#a0522d] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ml-4"
                  prefetch={false}
                >
                  LINE
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-20 lg:py-28 bg-[#ffd700]">
          <div className="container mx-auto px-4 md:px-6">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-[#8b4513]">Our Services</h2>
              <p className="text-[#8b4513] md:text-xl">
                Monicle Financial offers a wide range of financial services to meet your needs.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
              <div className="bg-[#fff] rounded-lg shadow p-6 space-y-4">
                <CoinsIcon className="w-8 h-8 text-[#8b4513]" />
                <h3 className="text-xl font-bold text-[#8b4513]">Investments</h3>
                <p className="text-[#8b4513]">
                  Our investment services help you grow your wealth and achieve your financial goals.
                </p>
                <Link
                  href="#"
                  className="inline-flex h-9 items-center justify-center rounded-md bg-[#8b4513] px-4 text-sm font-medium text-[#ffd700] shadow transition-colors hover:bg-[#a0522d] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  Learn More
                </Link>
              </div>
              <div className="bg-[#fff] rounded-lg shadow p-6 space-y-4">
                <RecycleIcon className="w-8 h-8 text-[#8b4513]" />
                <h3 className="text-xl font-bold text-[#8b4513]">Retirement Planning</h3>
                <p className="text-[#8b4513]">We help you plan for a secure and comfortable retirement.</p>
                <Link
                  href="#"
                  className="inline-flex h-9 items-center justify-center rounded-md bg-[#8b4513] px-4 text-sm font-medium text-[#ffd700] shadow transition-colors hover:bg-[#a0522d] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  Learn More
                </Link>
              </div>
              <div className="bg-[#fff] rounded-lg shadow p-6 space-y-4">
                <CurrencyIcon className="w-8 h-8 text-[#8b4513]" />
                <h3 className="text-xl font-bold text-[#8b4513]">Tax Planning</h3>
                <p className="text-[#8b4513]">
                  Our tax planning services help you minimize your tax burden and maximize your savings.
                </p>
                <Link
                  href="#"
                  className="inline-flex h-9 items-center justify-center rounded-md bg-[#8b4513] px-4 text-sm font-medium text-[#ffd700] shadow transition-colors hover:bg-[#a0522d] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section id="mailSection" className="py-12 md:py-20 lg:py-28 bg-[#ffd700]">
          <div className="container mx-auto px-4 md:px-6">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-[#8b4513]">Contact Us</h2>
              <p className="text-[#8b4513] md:text-xl">Get in touch with us to learn more about our services.</p>
            </div>
            <form className="max-w-md mx-auto mt-8 space-y-4" onSubmit={mailSend}>
              <Input 
                type="text" 
                name="name" 
                placeholder="Name"
                value={formValues.name}
                onChange={handleInputChange}
                className="bg-[#fff] text-[#8b4513]" 
              />
              <Input 
                type="email" 
                name="email" 
                placeholder="Email" 
                value={formValues.email}
                onChange={handleInputChange}
                className="bg-[#fff] text-[#8b4513]" 
              />
              <Textarea 
                name="message" 
                placeholder="Message" 
                value={formValues.message}
                onChange={handleInputChange}
                className="bg-[#fff] text-[#8b4513]" 
              />
              <Button type="submit" className="w-full bg-[#8b4513] text-[#ffd700] hover:bg-[#a0522d]">
                送信
              </Button>
              {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                  <LoadingSpinner />
                </div>
              )}
            </form>
          </div>
        </section>
      </main>
      <footer className="bg-[#8b4513] border-t px-4 md:px-6 py-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-[#ffd700]">&copy; 2024 Monicle Financial. All rights reserved.</p>
        <nav className="flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-[#ffd700]" prefetch={false}>
            Privacy
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-[#ffd700]" prefetch={false}>
            Terms
          </Link>
        </nav>
      </footer>
    </div>
  )
}


function CoinsIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="8" r="6" />
      <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
      <path d="M7 6h1v4" />
      <path d="m16.71 13.88.7.71-2.82 2.82" />
    </svg>
  )
}


function CurrencyIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="8" />
      <line x1="3" x2="6" y1="3" y2="6" />
      <line x1="21" x2="18" y1="3" y2="6" />
      <line x1="3" x2="6" y1="21" y2="18" />
      <line x1="21" x2="18" y1="21" y2="18" />
    </svg>
  )
}


function MenuIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}


function MonitorIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  )
}


function RecycleIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
      <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" />
      <path d="m14 16-3 3 3 3" />
      <path d="M8.293 13.596 7.196 9.5 3.1 10.598" />
      <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843" />
      <path d="m13.378 9.633 4.096 1.098 1.097-4.096" />
    </svg>
  )
}


function XIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

/**
 * 下記は文字セット設定用
 */

const zenKurenaido = Zen_Kurenaido({
  weight: "400", // 必須のプロパティを追加
  subsets: ['latin'],
  display: 'swap',
  preload: false
});

const russoOne = Russo_One({
  weight:"400",
  subsets: ['latin'],
  display: 'swap',
  preload: false
}); 


