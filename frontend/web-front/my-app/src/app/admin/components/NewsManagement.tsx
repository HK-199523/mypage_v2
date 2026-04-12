"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import NewsForm from "./NewsForm";
import { Button } from "@/components/ui/button";

interface NewsItem {
  Id: number;
  Title: string;
  News_body: string;
  Image: string | null;
  Create_date: string;
}

interface Props {
  canWrite?: boolean;
}

export default function NewsManagement({ canWrite = false }: Props) {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = "/api";

  // ニュース一覧を取得
  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/news/`, { withCredentials: true });
      setNewsList(response.data);
    } catch (error) {
      console.error("ニュース取得エラー:", error);
      alert("ニュースの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  // ニュースを削除
  const deleteNews = async (newsId: number) => {
    if (!confirm("本当に削除しますか?")) return;

    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/admin/news/${newsId}/`, { withCredentials: true });
      await fetchNews();
      alert("ニュースを削除しました");
    } catch (error) {
      console.error("ニュース削除エラー:", error);
      alert("ニュースの削除に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  // 編集ボタンをクリック
  const handleEdit = async (newsId: number) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/admin/news/${newsId}/`,
        { withCredentials: true }
      );
      setEditingNews(response.data);
      setShowForm(true);
    } catch (error) {
      console.error("ニュース取得エラー:", error);
      alert("ニュースの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  // フォームを閉じる
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingNews(null);
    fetchNews();
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">ニュース管理</h2>
        {canWrite && (
          <Button
            onClick={() => {
              setEditingNews(null);
              setShowForm(true);
            }}
            disabled={showForm}
          >
            新規ニュース作成
          </Button>
        )}
      </div>

      {/* ニュース作成・編集フォーム */}
      {showForm && (
        <div className="mb-8 p-6 border-2 border-blue-500 rounded-lg bg-blue-50">
          <h3 className="text-lg font-semibold mb-4">
            {editingNews ? "ニュース編集" : "新規ニュース作成"}
          </h3>
          <NewsForm
            news={editingNews}
            onClose={handleCloseForm}
            onSuccess={handleCloseForm}
          />
        </div>
      )}

      {/* ニュース一覧 */}
      <div>
        <h3 className="text-lg font-semibold mb-3">ニュース一覧</h3>
        {loading && !showForm ? (
          <p>読み込み中...</p>
        ) : newsList.length === 0 ? (
          <p className="text-gray-500">ニュースがありません</p>
        ) : (
          <div className="grid gap-4">
            {newsList.map((item) => (
              <div
                key={item.Id}
                className="p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold mb-2">
                      {item.Title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {item.News_body}
                    </p>
                    <p className="text-xs text-gray-500">
                      作成日: {item.Create_date} | ID: {item.Id}
                    </p>
                  </div>
                  {item.Image && (
                    <div className="w-32 h-32 flex-shrink-0">
                      <img
                        src={`${item.Image}`}
                        alt={item.Title}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  )}
                </div>
                {canWrite && (
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={() => handleEdit(item.Id)}
                      variant="outline"
                      size="sm"
                    >
                      編集
                    </Button>
                    <Button
                      onClick={() => deleteNews(item.Id)}
                      variant="destructive"
                      size="sm"
                    >
                      削除
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
