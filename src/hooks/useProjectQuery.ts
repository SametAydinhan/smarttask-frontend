import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProjects, createProject } from "@/services/projectService";

export const useProjectsQuery = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] }); // Listeyi yeniden getir
    },
  });
};
