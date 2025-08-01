"use client";

import { useParams, useRouter } from "next/navigation";
import { useProjectsQuery } from "@/hooks/useProjectQuery";
import {
  useTasksQuery,
  useCreateTask,
  useUpdateTaskStatus,
} from "@/hooks/useTaskQuery";
import { useState, JSX } from "react";
import type { Task } from "@/types/task";
import { TaskStatus } from "@/types/status";
import {
  Plus,
  ArrowLeft,
  ListTodo,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";

const statusStyles: {
  [key in TaskStatus]: {
    variant: "default" | "secondary" | "outline";
    icon: JSX.Element;
  };
} = {
  TODO: {
    variant: "outline",
    icon: <ListTodo className='mr-2 h-4 w-4' />,
  },
  IN_PROGRESS: {
    variant: "secondary",
    icon: <Loader2 className='mr-2 h-4 w-4 animate-spin' />,
  },
  DONE: {
    variant: "default",
    icon: <CheckCircle2 className='mr-2 h-4 w-4' />,
  },
};

export default function ProjectDetailPage(): JSX.Element {
  const t = useTranslations("ProjectDetailPage");
  const { id } = useParams();
  const router = useRouter();
  const projectId = Number(id);

  const { data: project, isLoading: isLoadingProject } = useProjectsQuery();
  const {
    data: tasks,
    isLoading: isLoadingTasks,
    isError: isErrorTasks,
  } = useTasksQuery(projectId);
  const createMutation = useCreateTask(projectId);
  const updateStatusMutation = useUpdateTaskStatus(projectId);

  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [updatingTaskId, setUpdatingTaskId] = useState<number | null>(null);

  const handleCreateTask = (): void => {
    if (newTaskTitle.trim()) {
      createMutation.mutate(
        { title: newTaskTitle, projectId },
        {
          onSuccess: () => {
            setNewTaskTitle("");
          },
        }
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      handleCreateTask();
    }
  };

  const handleStatusChange = (taskId: number, newStatus: TaskStatus): void => {
    setUpdatingTaskId(taskId);
    updateStatusMutation.mutate(
      { taskId, status: newStatus },
      {
        onSettled: () => {
          setUpdatingTaskId(null);
        },
      }
    );
  };

  const TaskItem = ({ task }: { task: Task }): JSX.Element => {
    const isUpdating = updatingTaskId === task.id;
    const style = statusStyles[task.status];

    return (
      <Card className='border-0 shadow-sm hover:shadow-md transition-all duration-200'>
        <CardContent className='p-4 flex items-center justify-between'>
          <div className='flex items-center'>
            <div className='mr-4'>{style.icon}</div>
            <div>
              <p className='font-medium text-slate-800'>{task.title}</p>
              <p className='text-xs text-slate-500'>
                {t("created")} {new Date(task.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className='flex items-center space-x-4'>
            <Badge variant={style.variant}>{t(`status.${task.status}`)}</Badge>
            <Select
              value={task.status}
              onValueChange={(value) =>
                handleStatusChange(task.id, value as TaskStatus)
              }
              disabled={isUpdating}
            >
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder={t("statusChange")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='TODO'>{t("status.TODO")}</SelectItem>
                <SelectItem value='IN_PROGRESS'>
                  {t("status.IN_PROGRESS")}
                </SelectItem>
                <SelectItem value='DONE'>{t("status.DONE")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8'>
          <Button
            variant='ghost'
            onClick={() => router.push("/projects")}
            className='mb-4'
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            {t("back")}
          </Button>
          {isLoadingProject ? (
            <div className='animate-pulse'>
              <div className='h-8 bg-slate-200 rounded w-1/2 mb-2'></div>
              <div className='h-4 bg-slate-200 rounded w-3/4'></div>
            </div>
          ) : (
            <div>
              <h1 className='text-3xl font-bold text-slate-900'>
                {project?.name}
              </h1>
              <p className='text-slate-600 mt-1'>{t("headerTitle")}</p>
            </div>
          )}
        </div>

        <Card className='border-0 shadow-sm mb-8'>
          <CardContent className='p-6'>
            <div className='flex items-end space-x-4'>
              <div className='flex-1'>
                <Label
                  htmlFor='task-title'
                  className='text-sm font-medium text-slate-700 mb-2 block'
                >
                  {t("formLabel")}
                </Label>
                <Input
                  id='task-title'
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t("formPlaceholder")}
                  className='border-slate-200 focus:border-blue-500 focus:ring-blue-500'
                  disabled={createMutation.isPending}
                />
              </div>
              <Button
                onClick={handleCreateTask}
                disabled={createMutation.isPending || !newTaskTitle.trim()}
              >
                {createMutation.isPending ? (
                  <>
                    <Clock className='mr-2 h-4 w-4 animate-spin' />
                    {t("formButtonAdding")}
                  </>
                ) : (
                  <>
                    <Plus className='mr-2 h-4 w-4' />
                    {t("formButtonAdd")}
                  </>
                )}
              </Button>
            </div>
            {createMutation.isError && (
              <p className='text-red-500 text-sm mt-2 flex items-center'>
                <AlertTriangle className='h-4 w-4 mr-1' />
                {t("formError")}
              </p>
            )}
          </CardContent>
        </Card>

        {isLoadingTasks && (
          <div className='space-y-4'>
            {[...Array(3)].map((_, i) => (
              <Card key={i} className='border-0 shadow-sm animate-pulse'>
                <CardContent className='p-4 flex items-center justify-between'>
                  <div className='flex items-center'>
                    <div className='h-6 w-6 bg-slate-200 rounded-full mr-4'></div>
                    <div className='space-y-2'>
                      <div className='h-4 bg-slate-200 rounded w-48'></div>
                      <div className='h-3 bg-slate-200 rounded w-32'></div>
                    </div>
                  </div>
                  <div className='h-9 w-48 bg-slate-200 rounded'></div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {isErrorTasks && (
          <Card className='border-0 shadow-sm'>
            <CardContent className='flex flex-col items-center justify-center py-12'>
              <AlertTriangle className='h-12 w-12 text-red-400 mb-4' />
              <h3 className='text-lg font-semibold text-slate-900 mb-2'>
                {t("errorTitle")}
              </h3>
              <p className='text-slate-600 text-center'>{t("errorMessage")}</p>
            </CardContent>
          </Card>
        )}

        {!isLoadingTasks && !isErrorTasks && (!tasks || tasks.length === 0) && (
          <Card className='border-0 shadow-sm'>
            <CardContent className='flex flex-col items-center justify-center py-12 text-center'>
              <ListTodo className='h-12 w-12 text-slate-400 mb-4' />
              <h3 className='text-lg font-semibold text-slate-900 mb-2'>
                {t("emptyTitle")}
              </h3>
              <p className='text-slate-600'>{t("emptyMessage")}</p>
            </CardContent>
          </Card>
        )}

        {!isLoadingTasks && !isErrorTasks && tasks && tasks.length > 0 && (
          <div className='space-y-4'>
            {tasks.map((task: Task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
