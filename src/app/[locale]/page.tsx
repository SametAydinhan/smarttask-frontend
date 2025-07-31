"use client";

import { useEffect } from "react";
import { useAuth } from "@/store/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useProjectsQuery } from "@/hooks/useProjectQuery";
import type { Project } from "@/types/project";

export default function DashboardPage() {
  const { user, logout, token, hasHydrated } = useAuth();
  const router = useRouter();

  const { data: projects, isLoading } = useProjectsQuery();

 useEffect(() => {
   if (!hasHydrated) return; 
   if (!token || !user) {
     router.push("/login");
   }
 }, [token, user, router, hasHydrated]);

  if (!hasHydrated || !user) return null;

  return (
    <div className='max-w-5xl mx-auto mt-10 space-y-8'>
      <div className='flex justify-between items-center'>
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

      <p className='text-gray-600'>
        Here&#39;s a quick overview of your workspace. You can create new projects,
        manage tasks, and track your progress.
      </p>

      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold'>Your Recent Projects</h2>
        <Link
          href='/projects'
          className='text-sm text-blue-600 hover:underline'
        >
          View All →
        </Link>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {isLoading ? (
          <p>Loading projects...</p>
        ) : projects?.length > 0 ? (
          projects.slice(0, 3).map((project: Project) => (
            <div
              key={project.id}
              className='p-4 border rounded shadow-sm bg-white'
            >
              <h3 className='text-lg font-bold mb-2'>{project.name}</h3>
              <p className='text-sm text-gray-500'>ID: {project.id}</p>
              <Link
                href={`/projects/${project.id}`}
                className='mt-2 inline-block text-blue-600 text-sm hover:underline'
              >
                Manage Tasks →
              </Link>
            </div>
          ))
        ) : (
          <p>No projects yet. Start by creating one!</p>
        )}
      </div>
    </div>
  );
}
