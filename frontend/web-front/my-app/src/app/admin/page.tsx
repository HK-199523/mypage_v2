"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import TagManagement from "./components/TagManagement";
import ArticleManagement from "./components/ArticleManagement";
import NewsManagement from "./components/NewsManagement";
import UserManagement from "./components/UserManagement";
import { Button } from "@/components/ui/button";

type Role = "superuser" | "staff" | "viewer";
type Tab = "articles" | "news" | "tags" | "users";

const ROLE_LABEL: Record<Role, string> = {
  superuser: "スーパー管理者",
  staff: "編集者",
  viewer: "閲覧者",
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("articles");
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<Role>("viewer");
  const router = useRouter();

  const API_BASE_URL = "http://localhost:8080/api";

  const canWrite = role === "superuser" || role === "staff";

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = localStorage.getItem("isAuthenticated");
      const storedUsername = localStorage.getItem("username");

      if (!isAuthenticated) {
        router.push("/admin/login");
        return;
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/auth/check/`, {
          withCredentials: true,
        });

        setUsername(storedUsername || "");
        const serverRole: Role = res.data.role ?? "viewer";
        setRole(serverRole);
        localStorage.setItem("role", serverRole);
        setLoading(false);
      } catch {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        router.push("/admin/login");
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/auth/logout/`,
        {},
        { withCredentials: true }
      );
    } catch {
      // ignore
    } finally {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      router.push("/admin/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>認証確認中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">管理画面</h1>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                <span>{username}</span>
                <span className="ml-2 px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  {ROLE_LABEL[role]}
                </span>
              </div>
              <Button onClick={handleLogout} variant="outline" size="sm">
                ログアウト
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!canWrite && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded text-sm">
            閲覧者権限でログイン中です。データの読み取りのみ可能です。
          </div>
        )}

        <div className="mb-6 flex gap-4 flex-wrap">
          <Button
            onClick={() => setActiveTab("articles")}
            variant={activeTab === "articles" ? "default" : "outline"}
          >
            記事管理
          </Button>
          <Button
            onClick={() => setActiveTab("news")}
            variant={activeTab === "news" ? "default" : "outline"}
          >
            ニュース管理
          </Button>
          <Button
            onClick={() => setActiveTab("tags")}
            variant={activeTab === "tags" ? "default" : "outline"}
          >
            タグマスタ管理
          </Button>
          {role === "superuser" && (
            <Button
              onClick={() => setActiveTab("users")}
              variant={activeTab === "users" ? "default" : "outline"}
            >
              ユーザー管理
            </Button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === "tags" && <TagManagement canWrite={canWrite} />}
          {activeTab === "articles" && <ArticleManagement canWrite={canWrite} />}
          {activeTab === "news" && <NewsManagement canWrite={canWrite} />}
          {activeTab === "users" && role === "superuser" && <UserManagement />}
        </div>
      </main>
    </div>
  );
}
