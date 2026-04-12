"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UserItem {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  is_superuser: boolean;
  role: "superuser" | "staff" | "viewer";
}

const ROLE_OPTIONS = [
  { value: "superuser", label: "スーパー管理者" },
  { value: "staff", label: "編集者" },
  { value: "viewer", label: "閲覧者" },
];

const ROLE_BADGE: Record<string, string> = {
  superuser: "bg-red-100 text-red-800",
  staff: "bg-blue-100 text-blue-800",
  viewer: "bg-gray-100 text-gray-800",
};

const API_BASE_URL = "/api";

export default function UserManagement() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);

  // フォームの状態
  const [formUsername, setFormUsername] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState("viewer");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/auth/users/`, {
        withCredentials: true,
      });
      setUsers(res.data);
    } catch (error) {
      console.error("ユーザー取得エラー:", error);
      alert("ユーザーの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openCreateForm = () => {
    setEditingUser(null);
    setFormUsername("");
    setFormPassword("");
    setFormEmail("");
    setFormRole("viewer");
    setShowForm(true);
  };

  const openEditForm = (user: UserItem) => {
    setEditingUser(user);
    setFormUsername(user.username);
    setFormPassword("");
    setFormEmail(user.email);
    setFormRole(user.role);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!editingUser && (!formUsername || !formPassword)) {
      alert("ユーザー名とパスワードを入力してください");
      return;
    }

    try {
      setLoading(true);
      if (editingUser) {
        // 更新
        const payload: Record<string, string> = { role: formRole, email: formEmail };
        if (formPassword) payload.password = formPassword;
        await axios.put(
          `${API_BASE_URL}/auth/users/${editingUser.id}/`,
          payload,
          { withCredentials: true }
        );
        alert("ユーザーを更新しました");
      } else {
        // 新規作成
        await axios.post(
          `${API_BASE_URL}/auth/users/`,
          {
            username: formUsername,
            password: formPassword,
            email: formEmail,
            role: formRole,
          },
          { withCredentials: true }
        );
        alert("ユーザーを作成しました");
      }
      setShowForm(false);
      await fetchUsers();
    } catch (error: any) {
      const msg = error.response?.data?.error || "操作に失敗しました";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: number) => {
    if (!confirm("本当に削除しますか?")) return;
    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/auth/users/${userId}/`, {
        withCredentials: true,
      });
      await fetchUsers();
      alert("ユーザーを削除しました");
    } catch (error: any) {
      const msg = error.response?.data?.error || "削除に失敗しました";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">ユーザー管理</h2>
        <Button onClick={openCreateForm} disabled={showForm}>
          新規ユーザー作成
        </Button>
      </div>

      {/* 作成・編集フォーム */}
      {showForm && (
        <div className="mb-8 p-6 border-2 border-blue-500 rounded-lg bg-blue-50">
          <h3 className="text-lg font-semibold mb-4">
            {editingUser ? "ユーザー編集" : "新規ユーザー作成"}
          </h3>
          <div className="grid gap-4 max-w-md">
            <div>
              <label className="block text-sm font-medium mb-1">
                ユーザー名 {!editingUser && <span className="text-red-500">*</span>}
              </label>
              <Input
                type="text"
                value={formUsername}
                onChange={(e) => setFormUsername(e.target.value)}
                disabled={!!editingUser}
                placeholder="ユーザー名"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                パスワード {!editingUser && <span className="text-red-500">*</span>}
                {editingUser && <span className="text-gray-500 font-normal">（変更する場合のみ入力）</span>}
              </label>
              <Input
                type="password"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                placeholder={editingUser ? "変更しない場合は空欄" : "パスワード"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">メールアドレス</label>
              <Input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="例: user@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                権限 <span className="text-red-500">*</span>
              </label>
              <select
                value={formRole}
                onChange={(e) => setFormRole(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSubmit} disabled={loading}>
                {editingUser ? "更新" : "作成"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowForm(false)}
                disabled={loading}
              >
                キャンセル
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ユーザー一覧 */}
      <div>
        <h3 className="text-lg font-semibold mb-3">ユーザー一覧</h3>
        {loading && !showForm ? (
          <p>読み込み中...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-500">ユーザーがいません</p>
        ) : (
          <div className="grid gap-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{user.username}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${ROLE_BADGE[user.role]}`}
                    >
                      {ROLE_OPTIONS.find((o) => o.value === user.role)?.label}
                    </span>
                  </div>
                  {user.email && (
                    <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => openEditForm(user)}
                    variant="outline"
                    size="sm"
                  >
                    編集
                  </Button>
                  <Button
                    onClick={() => deleteUser(user.id)}
                    variant="destructive"
                    size="sm"
                  >
                    削除
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
