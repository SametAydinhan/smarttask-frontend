"use client";

import { useEffect } from "react";
import { useAuth } from "@/store/useAuth";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, logout, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token || !user) {
      router.push("/login");
    }
  }, [token, user, router]);

  if (!user) return null;

  return (
    <div className='max-w-3xl mx-auto mt-10'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Welcome, {user.name} 👋</h1>
        <button
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className='text-sm px-4 py-2 bg-red-500 text-white rounded'
        >
          Logout
        </button>
      </div>

      <p className='text-gray-700'>
        Bu senin dashboard sayfan. Burada projelerini görebilecek, yeni görevler
        oluşturabileceksin.
      </p>
    </div>
  );
}
