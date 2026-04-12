"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const API_BASE_URL = "/api";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("ユーザー名とパスワードを入力してください");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/auth/login/`,
        {
          username,
          password,
        },
        {
          withCredentials: true, // セッション認証のため必須
        }
      );

      // ログイン成功
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("username", response.data.username);

      router.push("/admin");
    } catch (error: any) {
      console.error("ログインエラー:", error);
      const errorMessage =
        error.response?.data?.error || "ログインに失敗しました";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">管理画面ログイン</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              ユーザー名
            </label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ユーザー名を入力"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              パスワード
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワードを入力"
              disabled={loading}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "ログイン中..." : "ログイン"}
          </Button>
        </form>

        <div className="mt-4 text-sm text-gray-600 text-center">
        </div>
      </div>
    </div>
  );
}
