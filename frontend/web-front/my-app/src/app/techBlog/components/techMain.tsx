import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {Russo_One} from 'next/font/google'
import HeroImage from '@/app/techBlog/components/heroImage'
import Sidebar from '@/app/techBlog/components/Sidebar'


type NewsItem = {
    Id: number;
    Title: string;
    News_body: string;
    Image: string;
    Create_date:string;
};

type Tag = {
    Tag_id: string;
    Tag_name: string;
};

type TechNewsItem = {
    Id: number;
    Title: string;
    Article_id: string;
    Article_body: string
    Image: string;
    Create_date: string;
    Tags:Tag[];
};
  
type Props = {
    news: NewsItem[];
    techNews: TechNewsItem[];
};

const Main = ({news, techNews }:Props ) => {
    const router = useRouter();
    console.log(news);
    return (
        <div className='z-0'>
            <HeroImage label="トップ" />
            <div className="grid grid-cols-1 md:grid-cols-12 mt-8">
                <div id="sideMenu" className="md:col-span-2">
                    サイドメニュー
                </div>
                <div id="contents" className="md:col-span-7">
                    <div className="mb-16">
                        <h1 className={`animate-tracking-in-expand relative mb-5 md:text-3xl sm:text-2xl ${russoOne.className} ml-4 text-[#000] text-3xl `}>
                            Recently News
                        </h1>
                        <div className="grid gap-4 md:gap-6 lg:grid-cols-2 xl:grid-cols-3 xl:gap-8 p-8">
                            {/*  article - start  */}
                            { news.map((item) =>(
                                <div className="flex flex-col overflow-hidden rounded-lg border bg-white" key={item.Id}>
                                    <a href={`/techBlog/news/${item.Id}`} className="group relative block h-28 overflow-hidden bg-gray-100 md:h-64">
                                        <img src={`http://localhost:8080${item.Image}`} loading="lazy" alt="Photo by Minh Pham" className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />
                                    </a>

                                    <div className="flex flex-1 flex-col p-4 sm:p-6">
                                    <h2 className="mb-2 text-lg font-semibold text-gray-800">
                                        <a href={`/techBlog/news/${item.Id}`} className="transition duration-100 hover:text-indigo-500 active:text-indigo-600">{item.Title}</a>
                                    </h2>

                                    <p className="mb-8 text-gray-500">{item.News_body}</p>

                                    <div className="mt-auto flex items-end justify-between">
                                        <div className="flex items-center gap-2">
                                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-100">
                                            <img src="https://images.unsplash.com/photo-1611898872015-0571a9e38375?auto=format&q=75&fit=crop&w=64" loading="lazy" alt="Photo by Brock Wegner" className="h-full w-full object-cover object-center" />
                                        </div>

                                        <div>
                                            <span className="block text-indigo-500">Mike Lane</span>
                                            <span className="block text-sm text-gray-400">{item.Create_date}</span>
                                        </div>
                                        </div>

                                        <span className="rounded border px-2 py-1 text-sm text-gray-500">Article</span>
                                    </div>
                                    </div>
                                </div>
                            ))}
                            {/*  article - end  */}
                        </div>
                    </div>
                    <div>
                        <h1 className={`animate-tracking-in-expand mb-5 md:text-3xl sm:text-2xl ${russoOne.className} ml-4 text-[#000] text-3xl `}>
                            Tech Article
                        </h1>
                        <div className="bg-white">
                            <div className="mx-auto max-w-screen-xl px-4 md:px-8">
                                <div className="grid gap-4 ">
                                    {/*  article - start  */}
                                    { techNews.map((item) =>(
                                        
                                        <div key={item.Id} className="flex flex-col items-center overflow-hidden rounded-lg border md:flex-row">
                                            <a href={`/techBlog/article/${item.Id}`} className="group relative hidden md:block h-48 w-full shrink-0 self-start overflow-hidden bg-gray-100 md:h-full md:w-32 lg:w-48">
                                                <img src={`http://localhost:8080${item.Image}`} loading="lazy" alt="Photo by Minh Pham" className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />
                                            </a>

                                            <div className="flex flex-col gap-2 p-4 lg:p-6 flex-1">
                                                <span className="text-sm text-gray-400">{item.Create_date}</span>

                                                <h2 className="text-xl font-bold text-gray-800">
                                                    <a href={`/techBlog/article/${item.Id}`} className="transition duration-100 hover:text-indigo-500 active:text-indigo-600">{item.Title}</a>
                                                </h2>

                                                <p className="text-gray-500">{item.Article_body}</p>

                                                <div>
                                                    <a href={`/techBlog/article/${item.Id}`} className="font-semibold text-indigo-500 transition duration-100 hover:text-indigo-600 active:text-indigo-700">Read more</a>
                                                </div>
                                                <div className="flex flex-wrap gap-1 justify-end">
                                                    {item.Tags.map((tag) =>(
                                                        <button
                                                            key={tag.Tag_id}
                                                            onClick={() => router.push(`/techBlog/tag/${tag.Tag_id}`)}
                                                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-black text-cyan-400 border border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-200 cursor-pointer"
                                                        >
                                                            {tag.Tag_name}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {/*  article - end  */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Sidebar />
            </div>
        </div>
    );
};


const russoOne = Russo_One({
  weight:"400",
  subsets: ['latin'],
  display: 'swap',
}); 

export default Main;