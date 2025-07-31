import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask, getTasksByProject, updateTaskStatus } from "@/services/taskService";

export const useTasksQuery = (projectId: number) =>
  useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => getTasksByProject(projectId)
  });

export const useCreateTask = (projectId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    }
  });
};

export const useUpdateTaskStatus = (projectId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTaskStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    }
  });
};
