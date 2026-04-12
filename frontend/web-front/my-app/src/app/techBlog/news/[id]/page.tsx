'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Header from "@/app/techBlog/components/techHeader";
import Footer from "@/app/techBlog/components/techFooter";

type NewsDetail = {
    Id: number;
    Title: string;
    News_body: string;
    Image: string;
    Create_date: string;
};

export default function NewsDetailPage() {
    const params = useParams();
    const id = params.id;
    const [news, setNews] = useState<NewsDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetchNews = async () => {
            try {
                const response = await axios.get(`/api/get_news/${id}/`);
                setNews(response.data);
            } catch (err) {
                console.error('ニュース詳細取得エラー:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, [id]);

    return (
        <>
            <Header />
            <div className="mx-auto max-w-screen-md px-4 md:px-8 py-12">
                {loading && (
                    <p className="text-center text-gray-500">読み込み中...</p>
                )}
                {error && (
                    <p className="text-center text-red-500">記事が見つかりませんでした。</p>
                )}
                {news && (
                    <article>
                        <h1 className="mb-4 text-2xl font-bold text-gray-800 md:text-3xl">
                            {news.Title}
                        </h1>
                        <p className="mb-6 text-sm text-gray-400">{news.Create_date}</p>
                        <div className="mb-8 overflow-hidden rounded-lg">
                            <img
                                src={`${news.Image}`}
                                alt={news.Title}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                        <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                            {news.News_body}
                        </div>
                    </article>
                )}
                <div className="mt-12">
                    <a
                        href="/techBlog"
                        className="font-semibold text-indigo-500 transition duration-100 hover:text-indigo-600 active:text-indigo-700"
                    >
                        &larr; ニュース一覧に戻る
                    </a>
                </div>
            </div>
            <Footer />
        </>
    );
}
