"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import ArticleForm from "./ArticleForm";
import { Button } from "@/components/ui/button";

interface Tag {
  Tag_id: number;
  Tag_name: string;
}

interface Article {
  Id: string;
  Title: string;
  Article_id: number;
  Overview: string;
  Detail: string;
  Article_image: string | null;
  Related_tag_id: number;
  Create_date: string;
  Tags: Tag[];
  tag_ids?: number[];
}

interface Props {
  canWrite?: boolean;
}

export default function ArticleManagement({ canWrite = false }: Props) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = "http://localhost:8080/api";

  // 記事一覧を取得
  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/articles/`, { withCredentials: true });
      setArticles(response.data);
    } catch (error) {
      console.error("記事取得エラー:", error);
      alert("記事の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  // 記事を削除
  const deleteArticle = async (articleId: string) => {
    if (!confirm("本当に削除しますか?")) return;

    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/admin/articles/${articleId}/`, { withCredentials: true });
      await fetchArticles();
      alert("記事を削除しました");
    } catch (error) {
      console.error("記事削除エラー:", error);
      alert("記事の削除に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  // 編集ボタンをクリック
  const handleEdit = async (articleId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/admin/articles/${articleId}/`,
        { withCredentials: true }
      );
      setEditingArticle(response.data);
      setShowForm(true);
    } catch (error) {
      console.error("記事取得エラー:", error);
      alert("記事の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  // フォームを閉じる
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingArticle(null);
    fetchArticles();
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">記事管理</h2>
        {canWrite && (
          <Button
            onClick={() => {
              setEditingArticle(null);
              setShowForm(true);
            }}
            disabled={showForm}
          >
            新規記事作成
          </Button>
        )}
      </div>

      {/* 記事作成・編集フォーム */}
      {showForm && (
        <div className="mb-8 p-6 border-2 border-blue-500 rounded-lg bg-blue-50">
          <h3 className="text-lg font-semibold mb-4">
            {editingArticle ? "記事編集" : "新規記事作成"}
          </h3>
          <ArticleForm
            article={editingArticle}
            onClose={handleCloseForm}
            onSuccess={handleCloseForm}
          />
        </div>
      )}

      {/* 記事一覧 */}
      <div>
        <h3 className="text-lg font-semibold mb-3">記事一覧</h3>
        {loading && !showForm ? (
          <p>読み込み中...</p>
        ) : articles.length === 0 ? (
          <p className="text-gray-500">記事がありません</p>
        ) : (
          <div className="grid gap-4">
            {articles.map((article) => (
              <div
                key={article.Id}
                className="p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold mb-2">
                      {article.Title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {article.Overview}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {article.Tags.map((tag) => (
                        <span
                          key={tag.Tag_id}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                        >
                          {tag.Tag_name}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      作成日: {article.Create_date} | Article ID:{" "}
                      {article.Article_id}
                    </p>
                  </div>
                  {article.Article_image && (
                    <div className="w-32 h-32 flex-shrink-0">
                      <img
                        src={`http://localhost:8080${article.Article_image}`}
                        alt={article.Title}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  )}
                </div>
                {canWrite && (
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={() => handleEdit(article.Id)}
                      variant="outline"
                      size="sm"
                    >
                      編集
                    </Button>
                    <Button
                      onClick={() => deleteArticle(article.Id)}
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
