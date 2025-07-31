import api from "@/lib/axios";

export const getTasksByProject = async (projectId: number) => {
  const res = await api.get(`/tasks/${projectId}`);
  return res.data;
};

export const createTask = async (payload: {
  title: string;
  description?: string;
  projectId: number;
}) => {
  const res = await api.post("/tasks", payload);
  return res.data;
};

export const updateTaskStatus = async ({
  taskId,
  status,
}: {
  taskId: number;
  status: "TODO" | "IN_PROGRESS" | "DONE";
}) => {
  const res = await api.patch(`/tasks/${taskId}/status`, { status });
  return res.data;
};
