'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Header from "@/app/techBlog/components/techHeader";
import Footer from "@/app/techBlog/components/techFooter";
import HeroImage from "@/app/techBlog/components/heroImage";

type Tag = {
    Tag_id: number;
    Tag_name: string;
};

type ArticleDetail = {
    Id: string;
    Title: string;
    Detail: string;
    Article_image: string | null;
    Create_date: string;
    Tags: Tag[];
};

export default function ArticleDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id;
    const [article, setArticle] = useState<ArticleDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetchArticle = async () => {
            try {
                const response = await axios.get(`/api/get_article/${id}/`);
                setArticle(response.data);
            } catch (err) {
                console.error('記事詳細取得エラー:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [id]);

    return (
        <>
            <Header />
            <HeroImage label="Detail Page" />
            <div className="mx-auto max-w-screen-md px-4 md:px-8 py-12">
                {loading && (
                    <p className="text-center text-gray-500">読み込み中...</p>
                )}
                {error && (
                    <p className="text-center text-red-500">記事が見つかりませんでした。</p>
                )}
                {article && (
                    <article>
                        <h1 className="mb-4 text-2xl font-bold text-gray-800 md:text-3xl">
                            {article.Title}
                        </h1>
                        <div className="flex items-center mb-6">
                            <span className="text-sm text-gray-400">{article.Create_date}</span>
                            <div className="flex flex-wrap gap-2 ml-auto">
                                {article.Tags.map((tag) => (
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
                        {article.Article_image && (
                            <div className="mb-8 overflow-hidden rounded-lg">
                                <img
                                    src={`${article.Article_image}`}
                                    alt={article.Title}
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        )}
                        <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                            {article.Detail}
                        </div>
                    </article>
                )}
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
