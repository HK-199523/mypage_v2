"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface NewsItem {
  Id: number;
  Title: string;
  News_body: string;
  Image: string | null;
  Create_date: string;
}

interface NewsFormProps {
  news: NewsItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewsForm({ news, onClose, onSuccess }: NewsFormProps) {
  const [title, setTitle] = useState("");
  const [newsBody, setNewsBody] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = "/api";

  // ニュースデータをフォームに設定
  useEffect(() => {
    if (news) {
      setTitle(news.Title);
      setNewsBody(news.News_body);
    }
  }, [news]);

  // フォーム送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !newsBody) {
      alert("必須項目を入力してください");
      return;
    }

    if (!news && !imageFile) {
      alert("画像を選択してください");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("Title", title);
      formData.append("News_body", newsBody);

      if (imageFile) {
        formData.append("Image", imageFile);
      }

      if (news) {
        // 更新
        await axios.put(
          `${API_BASE_URL}/admin/news/${news.Id}/`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );
        alert("ニュースを更新しました");
      } else {
        // 作成
        await axios.post(`${API_BASE_URL}/admin/news/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        alert("ニュースを作成しました");
      }

      onSuccess();
    } catch (error: any) {
      console.error("ニュース保存エラー:", error);

      let errorMessage = "ニュースの保存に失敗しました";

      if (error.response?.data) {
        if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (typeof error.response.data === "object") {
          errorMessage =
            "入力エラー:\n" +
            Object.entries(error.response.data)
              .map(([key, value]) => {
                const valueStr =
                  typeof value === "object" ? JSON.stringify(value) : value;
                return `${key}: ${valueStr}`;
              })
              .join("\n");
        }
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          タイトル <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="ニュースのタイトル"
          maxLength={50}
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          {title.length}/50文字
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          本文 <span className="text-red-500">*</span>
        </label>
        <Textarea
          value={newsBody}
          onChange={(e) => setNewsBody(e.target.value)}
          placeholder="ニュースの本文"
          rows={8}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          画像 {!news && <span className="text-red-500">*</span>}
        </label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />
        {news?.Image && !imageFile && (
          <div className="mt-2">
            <p className="text-sm text-gray-600 mb-1">現在の画像:</p>
            <img
              src={`${news.Image}`}
              alt="現在の画像"
              className="w-32 h-32 object-cover rounded"
            />
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? "保存中..." : news ? "更新" : "作成"}
        </Button>
        <Button type="button" onClick={onClose} variant="outline">
          キャンセル
        </Button>
      </div>
    </form>
  );
}
