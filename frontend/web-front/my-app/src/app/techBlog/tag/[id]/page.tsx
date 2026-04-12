'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Header from "@/app/techBlog/components/techHeader";
import Footer from "@/app/techBlog/components/techFooter";
import HeroImage from "@/app/techBlog/components/heroImage";
import { Russo_One } from 'next/font/google';

const russoOne = Russo_One({
    weight: "400",
    subsets: ['latin'],
    display: 'swap',
});

type Tag = {
    Tag_id: number;
    Tag_name: string;
};

type ArticleItem = {
    Id: string;
    Title: string;
    Article_id: string;
    Article_body: string;
    Image: string | null;
    Create_date: string;
    Tags: Tag[];
};

export default function TagArticlesPage() {
    const params = useParams();
    const router = useRouter();
    const tagId = params.id;
    const [tagName, setTagName] = useState('');
    const [articles, setArticles] = useState<ArticleItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!tagId) return;
        const fetchArticles = async () => {
            setLoading(true);
            setError(false);
            try {
                const response = await axios.get(`/api/get_articles_by_tag/${tagId}/`);
                setTagName(response.data.tag.Tag_name);
                setArticles(response.data.articles);
            } catch (err) {
                console.error('タグ別記事取得エラー:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, [tagId]);

    return (
        <>
            <Header />
            <HeroImage label="Detail Page" />
            <div className="mx-auto max-w-screen-xl px-4 md:px-8 py-12">
                <h1 className={`mb-8 md:text-3xl sm:text-2xl ${russoOne.className} text-[#000] text-3xl`}>
                    Tag: {tagName}
                </h1>

                {loading && (
                    <p className="text-center text-gray-500">読み込み中...</p>
                )}
                {error && (
                    <p className="text-center text-red-500">記事の取得に失敗しました。</p>
                )}
                {!loading && !error && articles.length === 0 && (
                    <p className="text-center text-gray-500">このタグの記事はありません。</p>
                )}

                <div className="bg-white">
                    <div className="grid gap-4">
                        {articles.map((item) => (
                            <div key={item.Id} className="flex flex-col items-center overflow-hidden rounded-lg border md:flex-row">
                                <a href={`/techBlog/article/${item.Id}`} className="group relative hidden md:block h-48 w-full shrink-0 self-start overflow-hidden bg-gray-100 md:h-full md:w-32 lg:w-48">
                                    {item.Image && (
                                        <img src={`${item.Image}`} loading="lazy" alt={item.Title} className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />
                                    )}
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
                                        {item.Tags.map((tag) => (
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
                    </div>
                </div>

                <div className="mt-12">
                    <a
                        href="/techBlog"
                        className="font-semibold text-indigo-500 transition duration-100 hover:text-indigo-600 active:text-indigo-700"
                    >
                        &larr; 記事一覧に戻る
                    </a>
                </div>
            </div>
            <Footer />
        </>
    );
}
