'use client';

import React,{ useState,useEffect } from 'react';
import axios from 'axios';
import Header from "@/app/techBlog/components/techHeader";
import Main from "@/app/techBlog/components/techMain";
import Footer from "@/app/techBlog/components/techFooter";


type NewsItem = {
    id: number;
    title: string;
    newsBody: string;
    image: string;
    createDate:string;
};

type Tag = {
    Tag_id: string;
    Tag_name: string;
};

type TechNewsItem = {
    id: number;
    title: string;
    articleId: string;
    articleBody: string
    image: string;
    createDate: string;
    Tags:Tag[];
};
  
type Props = {
    news: NewsItem[];
    techNews:TechNewsItem[];
};

export default function Tech() {
    const [news, setNews] = useState([]);

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

    useEffect(() => {
        const getNews = async () => {
            try {
                const csrfToken = getCsrfToken();
                const response = await axios.post('/api/get_news/',
                    {
                        record_num:3
                    },{
                        headers: {
                        'X-CSRFToken': csrfToken,   //CSRFトークンをリクエストヘッダーに追加
                        'Content-Type': 'application/json'
                        },
                        withCredentials: true
                    }
                );
                setNews(response.data);
            } catch (err) {
            console.error('ニュース取得エラー:', err);
            setNews([]);
            }
        };

        getNews();
    },[])

    const [techNews, setTechNews] = useState<TechNewsItem[]>([]);

    useEffect(() => {
        const getTechNews = async () => {
            try {
                const csrfToken = getCsrfToken();
                const response = await axios.post(
                    '/api/get_tech_news/',
                    {
                        record_num: 10
                    },
                    {
                        headers: {
                            'X-CSRFToken': csrfToken,
                            'Content-Type': 'application/json'
                        },
                        withCredentials: true
                    }
                );

                setTechNews(response.data);
            } catch (err) {
                console.error('Techニュース取得エラー:', err);
                setTechNews([]);
            }
        };

        getTechNews();
    }, []);



    return (
        <>
            <Header/>
            <Main news={news} techNews={techNews} />
            <Footer/>
        </>
    )
};