"use client";
import { useProjectsQuery, useCreateProject } from "@/hooks/useProjectQuery";
import { useState } from "react";
import type { Project } from "@/types/project";

export default function ProjectPage() {
  const { data: projects, isLoading, isError } = useProjectsQuery();
  const createMutation = useCreateProject();
  const [projectName, setProjectName] = useState("");

  const handleCreate = () => {
    if (projectName.trim()) {
      createMutation.mutate(projectName);
      setProjectName("");
    }
  };

  return (
    <div className='max-w-3xl mx-auto mt-10 space-y-6'>
      <h1 className='text-3xl font-bold'>Your Projects</h1>

      <div className='flex items-center gap-2'>
        <input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder='New project name'
          className='p-2 border rounded w-full'
        />
        <button
          onClick={handleCreate}
          disabled={createMutation.isPending}
          className='px-4 py-2 bg-blue-500 text-white rounded'
        >
          {createMutation.isPending ? "Adding..." : "Add"}
        </button>
      </div>

      {isLoading && <p>Loading projects...</p>}
      {isError && <p className='text-red-500'>Failed to fetch projects.</p>}

      <ul className='space-y-2'>
        {projects?.map((project: Project) => (
          <li key={project.id} className='border rounded p-3 shadow-sm'>
            {project.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
