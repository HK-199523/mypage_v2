"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

interface ArticleFormProps {
  article: Article | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ArticleForm({
  article,
  onClose,
  onSuccess,
}: ArticleFormProps) {
  const [title, setTitle] = useState("");
  const [articleId, setArticleId] = useState<number | null>(null);
  const [overview, setOverview] = useState("");
  const [detail, setDetail] = useState("");
  const [relatedTagId, setRelatedTagId] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = "http://localhost:8080/api";

  // タグ一覧を取得
  const fetchTags = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/tags/`, { withCredentials: true });
      setAvailableTags(response.data);
    } catch (error) {
      console.error("タグ取得エラー:", error);
    }
  };

  // 記事データをフォームに設定
  useEffect(() => {
    if (article) {
      setTitle(article.Title);
      setArticleId(article.Article_id);
      setOverview(article.Overview);
      setDetail(article.Detail);
      setRelatedTagId(article.Related_tag_id);
      setSelectedTagIds(article.tag_ids || []);
    }
  }, [article]);

  useEffect(() => {
    fetchTags();
  }, []);

  // タグの選択を切り替え
  const toggleTag = (tagId: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  // フォーム送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !overview || !detail) {
      alert("必須項目を入力してください");
      return;
    }

    if (!article && !imageFile) {
      alert("画像を選択してください");
      return;
    }

    try {
      setLoading(true);

      // タグIDが整数の配列であることを保証
      const tagIdsAsNumbers = selectedTagIds.map((id) => Number(id));
      console.log("送信するタグID:", tagIdsAsNumbers);

      const formData = new FormData();
      formData.append("Title", title);
      formData.append("Overview", overview);
      formData.append("Detail", detail);

      // Article_idとRelated_tag_idは編集時のみ送信（新規作成時は自動採番）
      if (article) {
        if (articleId !== null) {
          formData.append("Article_id", articleId.toString());
        }
        if (relatedTagId !== null) {
          formData.append("Related_tag_id", relatedTagId.toString());
        }
      }

      if (imageFile) {
        formData.append("Article_image", imageFile);
      }

      // タグIDをJSON配列として追加（整数配列であることを保証）
      formData.append("tag_ids", JSON.stringify(tagIdsAsNumbers));
      console.log("FormDataに追加したtag_ids:", JSON.stringify(tagIdsAsNumbers));

      if (article) {
        // 更新
        await axios.put(
          `${API_BASE_URL}/admin/articles/${article.Id}/`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );
        alert("記事を更新しました");
      } else {
        // 作成
        await axios.post(`${API_BASE_URL}/admin/articles/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        alert("記事を作成しました");
      }

      onSuccess();
    } catch (error: any) {
      console.error("記事保存エラー:", error);
      console.error("エラー詳細:", error.response?.data);
      console.error("エラー詳細（JSON）:", JSON.stringify(error.response?.data, null, 2));

      let errorMessage = "記事の保存に失敗しました";

      if (error.response?.data) {
        if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (typeof error.response.data === "object") {
          // バリデーションエラーの場合
          errorMessage =
            "入力エラー:\n" +
            Object.entries(error.response.data)
              .map(([key, value]) => {
                // 配列やオブジェクトの場合はJSON文字列化
                const valueStr = typeof value === 'object' ? JSON.stringify(value) : value;
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
          placeholder="記事のタイトル"
          required
        />
      </div>

      {article && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Article ID（編集時のみ表示）
          </label>
          <Input
            type="number"
            value={articleId || ""}
            onChange={(e) =>
              setArticleId(e.target.value ? Number(e.target.value) : null)
            }
            placeholder="記事ID（整数）"
          />
          <p className="text-xs text-gray-500 mt-1">
            新規作成時は自動採番されます
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">
          概要 <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          value={overview}
          onChange={(e) => setOverview(e.target.value)}
          placeholder="記事の概要（100文字以内）"
          maxLength={100}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          詳細 <span className="text-red-500">*</span>
        </label>
        <Textarea
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder="記事の詳細内容"
          rows={6}
          required
        />
      </div>

      {article && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Related Tag ID（編集時のみ表示）
          </label>
          <Input
            type="number"
            value={relatedTagId || ""}
            onChange={(e) =>
              setRelatedTagId(e.target.value ? Number(e.target.value) : null)
            }
            placeholder="関連タグID（整数）"
          />
          <p className="text-xs text-gray-500 mt-1">
            新規作成時は自動採番されます
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">
          画像 {!article && <span className="text-red-500">*</span>}
        </label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />
        {article?.Article_image && !imageFile && (
          <div className="mt-2">
            <p className="text-sm text-gray-600 mb-1">現在の画像:</p>
            <img
              src={`http://localhost:8080${article.Article_image}`}
              alt="現在の画像"
              className="w-32 h-32 object-cover rounded"
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">タグ選択</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {availableTags.map((tag) => (
            <label
              key={tag.Tag_id}
              className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={selectedTagIds.includes(tag.Tag_id)}
                onChange={() => toggleTag(tag.Tag_id)}
              />
              <span className="text-sm">{tag.Tag_name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? "保存中..." : article ? "更新" : "作成"}
        </Button>
        <Button type="button" onClick={onClose} variant="outline">
          キャンセル
        </Button>
      </div>
    </form>
  );
}
