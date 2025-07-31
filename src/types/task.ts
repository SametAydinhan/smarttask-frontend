import { Project } from "./project";
import { TaskStatus } from "./status";
import { User } from "./user";

export type Task = {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  projectId: number;
  assignedTo: number | null;
  project: Project;
  assignee: User | null;
  createdAt: Date;
};