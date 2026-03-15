"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Tag {
  Tag_id: number;
  Tag_name: string;
}

interface Props {
  canWrite?: boolean;
}

export default function TagManagement({ canWrite = false }: Props) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [editTagName, setEditTagName] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = "http://localhost:8080/api";

  // タグ一覧を取得
  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/tags/`, { withCredentials: true });
      setTags(response.data);
    } catch (error) {
      console.error("タグ取得エラー:", error);
      alert("タグの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  // タグを作成
  const createTag = async () => {
    if (!newTagName.trim()) {
      alert("タグ名を入力してください");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/admin/tags/`, { Tag_name: newTagName }, { withCredentials: true });
      setNewTagName("");
      await fetchTags();
      alert("タグを作成しました");
    } catch (error) {
      console.error("タグ作成エラー:", error);
      alert("タグの作成に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  // タグを更新
  const updateTag = async () => {
    if (!editingTag || !editTagName.trim()) {
      alert("タグ名を入力してください");
      return;
    }

    try {
      setLoading(true);
      await axios.put(`${API_BASE_URL}/admin/tags/${editingTag.Tag_id}/`, { Tag_name: editTagName }, { withCredentials: true });
      setEditingTag(null);
      setEditTagName("");
      await fetchTags();
      alert("タグを更新しました");
    } catch (error) {
      console.error("タグ更新エラー:", error);
      alert("タグの更新に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  // タグを削除
  const deleteTag = async (tagId: number) => {
    if (!confirm("本当に削除しますか?")) return;

    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/admin/tags/${tagId}/`, { withCredentials: true });
      await fetchTags();
      alert("タグを削除しました");
    } catch (error) {
      console.error("タグ削除エラー:", error);
      alert("タグの削除に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">タグマスタ管理</h2>

      {/* 新規作成フォーム */}
      {canWrite && (
        <div className="mb-8 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-3">新規タグ作成</h3>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="タグ名を入力"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              className="flex-1"
            />
            <Button onClick={createTag} disabled={loading}>
              作成
            </Button>
          </div>
        </div>
      )}

      {/* 編集中のタグ */}
      {editingTag && (
        <div className="mb-8 p-4 border-2 border-blue-500 rounded-lg bg-blue-50">
          <h3 className="text-lg font-semibold mb-3">タグ編集</h3>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="タグ名を入力"
              value={editTagName}
              onChange={(e) => setEditTagName(e.target.value)}
              className="flex-1"
            />
            <Button onClick={updateTag} disabled={loading}>
              更新
            </Button>
            <Button
              onClick={() => {
                setEditingTag(null);
                setEditTagName("");
              }}
              variant="outline"
            >
              キャンセル
            </Button>
          </div>
        </div>
      )}

      {/* タグ一覧 */}
      <div>
        <h3 className="text-lg font-semibold mb-3">タグ一覧</h3>
        {loading ? (
          <p>読み込み中...</p>
        ) : tags.length === 0 ? (
          <p className="text-gray-500">タグがありません</p>
        ) : (
          <div className="grid gap-2">
            {tags.map((tag) => (
              <div
                key={tag.Tag_id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <span className="font-medium">{tag.Tag_name}</span>
                {canWrite && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setEditingTag(tag);
                        setEditTagName(tag.Tag_name);
                      }}
                      variant="outline"
                      size="sm"
                    >
                      編集
                    </Button>
                    <Button
                      onClick={() => deleteTag(tag.Tag_id)}
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
