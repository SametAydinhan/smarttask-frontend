"use client";

import { useParams } from "next/navigation";
import { useTasksQuery, useCreateTask, useUpdateTaskStatus } from "@/hooks/useTaskQuery";
import { useState } from "react";
import { TaskStatus } from "@/types/status";
import { Task } from "@/types/task";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const projectId = Number(id);
  const { data: tasks, isLoading } = useTasksQuery(projectId);
  const createMutation = useCreateTask(projectId);
  const updateStatus = useUpdateTaskStatus(projectId);

  const [title, setTitle] = useState("");

  const handleAddTask = () => {
    if (title.trim()) {
      createMutation.mutate({ title, projectId });
      setTitle("");
    }
  };

  const handleStatusChange = (taskId: number, newStatus: string) => {
    updateStatus.mutate({ taskId, status: newStatus as TaskStatus });
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-bold">Project #{projectId}</h1>

      <div className="flex items-center gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task title"
          className="p-2 border rounded w-full"
        />
        <button onClick={handleAddTask} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Task
        </button>
      </div>

      {isLoading ? (
        <p>Loading tasks...</p>
      ) : (
        <ul className="space-y-2">
          {tasks?.map((task: Task) => (
            <li key={task.id} className="p-4 border rounded shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-gray-500">{task.status}</p>
                </div>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  className="border p-1 rounded"
                >
                  <option value="TODO">TODO</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="DONE">DONE</option>
                </select>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
