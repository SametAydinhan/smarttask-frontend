"use client";

import { useProjectsQuery, useCreateProject } from "@/hooks/useProjectQuery";
import { useState, JSX } from "react";
import type { Project } from "@/types/project";
import type { Task } from "@/types/task";
import Link from "next/link";
import {
  Plus,
  ArrowRight,
  FolderOpen,
  Clock,
  AlertTriangle,
  Search,
  Grid3X3,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";

interface ProjectWithTasks extends Project {
  tasks?: Task[];
}

export default function ProjectPage(): JSX.Element {
  const t = useTranslations("ProjectPage");
  const {
    data: projects,
    isLoading,
    isError,
  } = useProjectsQuery() as {
    data: ProjectWithTasks[] | undefined;
    isLoading: boolean;
    isError: boolean;
  };

  const createMutation = useCreateProject();
  const [projectName, setProjectName] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleCreate = (): void => {
    if (projectName.trim()) {
      createMutation.mutate(projectName);
      setProjectName("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      handleCreate();
    }
  };

  const filteredProjects =
    projects?.filter((project: ProjectWithTasks) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) ?? [];

  const getProjectStats = (project: ProjectWithTasks) => {
    const tasks: Task[] = project.tasks ?? [];
    const totalTasks: number = tasks.length;
    const completedTasks: number = tasks.filter(
      (task: Task) => task.status === "DONE"
    ).length;
    const inProgressTasks: number = tasks.filter(
      (task: Task) => task.status === "IN_PROGRESS"
    ).length;
    const completionRate: number =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return { totalTasks, completedTasks, inProgressTasks, completionRate };
  };

  const ProjectCard = ({
    project,
  }: {
    project: ProjectWithTasks;
  }): JSX.Element => {
    const { totalTasks, completedTasks, inProgressTasks, completionRate } =
      getProjectStats(project);

    return (
      <Card className='border-0 shadow-sm hover:shadow-md transition-all duration-200 group'>
        <CardHeader className='pb-3'>
          <div className='flex items-start justify-between'>
            <div className='flex-1'>
              <CardTitle className='text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors'>
                {project.name}
              </CardTitle>
              <CardDescription className='text-slate-500 mt-1'>
                {t("created")}{" "}
                {new Date(project.createdAt).toLocaleDateString()}
              </CardDescription>
            </div>
            <Badge
              variant={
                completionRate === 100
                  ? "default"
                  : completionRate > 0
                  ? "secondary"
                  : "outline"
              }
              className='ml-2'
            >
              {completionRate}%
            </Badge>
          </div>
        </CardHeader>

        <CardContent className='pt-0'>
          <div className='space-y-4'>
            <div className='grid grid-cols-3 gap-3 text-center'>
              <div className='bg-slate-50 rounded-lg p-2'>
                <div className='text-lg font-semibold text-slate-900'>
                  {totalTasks}
                </div>
                <div className='text-xs text-slate-600'>{t("stats.total")}</div>
              </div>
              <div className='bg-amber-50 rounded-lg p-2'>
                <div className='text-lg font-semibold text-amber-600'>
                  {inProgressTasks}
                </div>
                <div className='text-xs text-amber-600'>
                  {t("stats.active")}
                </div>
              </div>
              <div className='bg-green-50 rounded-lg p-2'>
                <div className='text-lg font-semibold text-green-600'>
                  {completedTasks}
                </div>
                <div className='text-xs text-green-600'>{t("stats.done")}</div>
              </div>
            </div>

            <div className='space-y-2'>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-slate-600'>{t("stats.progress")}</span>
                <span className='font-medium text-slate-900'>
                  {completedTasks}/{totalTasks}
                </span>
              </div>
              <div className='w-full bg-slate-200 rounded-full h-2'>
                <div
                  className='bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300'
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>

            <Button asChild className='w-full mt-4' variant='outline'>
              <Link href={`/projects/${project.id}`}>
                <FolderOpen className='mr-2 h-4 w-4' />
                {t("manageTasks")}
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const ProjectListItem = ({
    project,
  }: {
    project: ProjectWithTasks;
  }): JSX.Element => {
    const { totalTasks, completedTasks, inProgressTasks, completionRate } =
      getProjectStats(project);

    return (
      <Card className='border-0 shadow-sm hover:shadow-md transition-all duration-200'>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between'>
            <div className='flex-1'>
              <div className='flex items-center space-x-4'>
                <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center'>
                  <FolderOpen className='h-6 w-6 text-white' />
                </div>
                <div>
                  <h3 className='text-lg font-semibold text-slate-900'>
                    {project.name}
                  </h3>
                  <p className='text-sm text-slate-500'>
                    {t("created")} {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className='flex items-center space-x-6'>
              <div className='text-center'>
                <div className='text-sm font-medium text-slate-900'>
                  {totalTasks}
                </div>
                <div className='text-xs text-slate-500'>{t("stats.totalTasks")}</div>
              </div>
              <div className='text-center'>
                <div className='text-sm font-medium text-amber-600'>
                  {inProgressTasks}
                </div>
                <div className='text-xs text-slate-500'>{t("stats.inProgress")}</div>
              </div>
              <div className='text-center'>
                <div className='text-sm font-medium text-green-600'>
                  {completedTasks}
                </div>
                <div className='text-xs text-slate-500'>{t("stats.completed")}</div>
              </div>
              <Badge variant={completionRate === 100 ? "default" : "secondary"}>
                {completionRate}%
              </Badge>
              <Button asChild variant='outline' size='sm'>
                <Link href={`/projects/${project.id}`}>
                  {t("viewTasks")}
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h1 className='text-3xl font-bold text-slate-900'>
                {t("title")}
              </h1>
              <p className='text-slate-600 mt-1'>{t("description")}</p>
            </div>

            <div className='flex items-center space-x-3'>
              <div className='flex items-center bg-white rounded-lg border'>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size='sm'
                  onClick={() => setViewMode("grid")}
                  className='rounded-r-none'
                >
                  <Grid3X3 className='h-4 w-4' />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size='sm'
                  onClick={() => setViewMode("list")}
                  className='rounded-l-none'
                >
                  <List className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </div>

          {/* Create New Project */}
          <Card className='border-0 shadow-sm mb-6'>
            <CardContent className='p-6'>
              <div className='flex items-center space-x-4'>
                <div className='flex-1'>
                  <Label
                    htmlFor='project-name'
                    className='text-sm font-medium text-slate-700 mb-2 block'
                  >
                    {t("createLabel")}
                  </Label>
                  <Input
                    id='project-name'
                    value={projectName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setProjectName(e.target.value)
                    }
                    onKeyUp={handleKeyPress}
                    placeholder='Enter project name...'
                    className='border-slate-200 focus:border-blue-500 focus:ring-blue-500'
                    disabled={createMutation.isPending}
                  />
                </div>
                <Button
                  onClick={handleCreate}
                  disabled={createMutation.isPending || !projectName.trim()}
                  className='mt-6'
                >
                  {createMutation.isPending ? (
                    <>
                      <Clock className='mr-2 h-4 w-4 animate-spin' />
                      {t("creating")}
                    </>
                  ) : (
                    <>
                      <Plus className='mr-2 h-4 w-4' />
                      {t("create")}
                    </>
                  )}
                </Button>
              </div>
              {createMutation.isError && (
                <p className='text-red-500 text-sm mt-2 flex items-center'>
                  <AlertTriangle className='h-4 w-4 mr-1' />
                  {t("createError")}
                </p>
              )}
            </CardContent>
          </Card>

          <div className='relative mb-6'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4' />
            <Input
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
              placeholder={t("search")}
              className='pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500'
            />
          </div>
        </div>

        {/* Content */}
        {isLoading && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {[...Array(6)].map((_, i: number) => (
              <Card key={i} className='border-0 shadow-sm animate-pulse'>
                <CardContent className='p-6'>
                  <div className='h-4 bg-slate-200 rounded mb-4'></div>
                  <div className='h-3 bg-slate-200 rounded mb-6 w-2/3'></div>
                  <div className='grid grid-cols-3 gap-3 mb-4'>
                    <div className='h-12 bg-slate-200 rounded'></div>
                    <div className='h-12 bg-slate-200 rounded'></div>
                    <div className='h-12 bg-slate-200 rounded'></div>
                  </div>
                  <div className='h-9 bg-slate-200 rounded'></div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {isError && (
          <Card className='border-0 shadow-sm'>
            <CardContent className='flex flex-col items-center justify-center py-12'>
              <AlertTriangle className='h-12 w-12 text-red-400 mb-4' />
              <h3 className='text-lg font-semibold text-slate-900 mb-2'>
                {t("error.title")}
              </h3>
              <p className='text-slate-600 text-center'>
                {t("error.description")}
              </p>
            </CardContent>
          </Card>
        )}

        {!isLoading &&
          !isError &&
          filteredProjects.length === 0 &&
          projects &&
          projects.length > 0 && (
            <Card className='border-0 shadow-sm'>
              <CardContent className='flex flex-col items-center justify-center py-12'>
                <Search className='h-12 w-12 text-slate-400 mb-4' />
                <h3 className='text-lg font-semibold text-slate-900 mb-2'>
                  {t("searchEmpty.title")}
                </h3>
                <p className='text-slate-600 text-center'>
                  {t("searchEmpty.description")}
                </p>
              </CardContent>
            </Card>
          )}

        {!isLoading && !isError && (!projects || projects.length === 0) && (
          <Card className='border-0 shadow-sm'>
            <CardContent className='flex flex-col items-center justify-center py-12'>
              <FolderOpen className='h-12 w-12 text-slate-400 mb-4' />
              <h3 className='text-lg font-semibold text-slate-900 mb-2'>
                {t("noProjects.title")}
              </h3>
              <p className='text-slate-600 text-center mb-6 max-w-sm'>
                {t("noProjects.description")}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Projects Display */}
        {!isLoading && !isError && filteredProjects.length > 0 && (
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <p className='text-slate-600'>
                {t("showingPrefix")} {filteredProjects.length}{" "}
                {t("showingMiddle")} {projects?.length ?? 0}{" "}
                {t("showingSuffix")}
              </p>
            </div>

            {viewMode === "grid" ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {filteredProjects.map((project: ProjectWithTasks) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className='space-y-4'>
                {filteredProjects.map((project: ProjectWithTasks) => (
                  <ProjectListItem key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
