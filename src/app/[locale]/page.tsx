"use client";

import { useEffect, JSX } from "react";
import { useAuth } from "@/store/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useProjectsQuery } from "@/hooks/useProjectQuery";
import type { Project } from "@/types/project";
import type { Task } from "@/types/task";
import {
  Plus,
  ArrowRight,
  FolderOpen,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3,
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
import Header from "@/components/Header";

interface ProjectWithTasks extends Project {
  tasks?: Task[];
}

export default function DashboardPage(): JSX.Element | null {
  const { user, token, hasHydrated } = useAuth();
  const router = useRouter();

  const { data: projects, isLoading } = useProjectsQuery() as {
    data: ProjectWithTasks[] | undefined;
    isLoading: boolean;
  };

  useEffect(() => {
    if (!hasHydrated) return;
    if (!token || !user) {
      router.push("/login");
    }
  }, [token, user, router, hasHydrated]);

  if (!hasHydrated || !user) return null;

  // Calculate stats
  const totalProjects: number = projects?.length ?? 0;
  const totalTasks: number =
    projects?.reduce(
      (acc: number, project: ProjectWithTasks) =>
        acc + (project.tasks?.length ?? 0),
      0
    ) ?? 0;
  const completedTasks: number =
    projects?.reduce(
      (acc: number, project: ProjectWithTasks) =>
        acc +
        (project.tasks?.filter((task: Task) => task.status === "DONE").length ??
          0),
      0
    ) ?? 0;
  const inProgressTasks: number =
    projects?.reduce(
      (acc: number, project: ProjectWithTasks) =>
        acc +
        (project.tasks?.filter((task: Task) => task.status === "IN_PROGRESS")
          .length ?? 0),
      0
    ) ?? 0;

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30'>
      <Header />
    {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Welcome Section */}
        <div className='mb-8'>
          <div className='flex items-center space-x-3 mb-2'>
            <h1 className='text-3xl font-bold text-slate-900'>
              Welcome back, {user.name}!
            </h1>
            <span className='text-2xl'>👋</span>
          </div>
          <p className='text-slate-600 text-lg'>
            Here&#39;s what&#39;s happening with your projects today
          </p>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <Card className='border-0 shadow-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-blue-100 text-sm font-medium'>
                    Total Projects
                  </p>
                  <p className='text-3xl font-bold'>{totalProjects}</p>
                </div>
                <FolderOpen className='h-8 w-8 text-blue-200' />
              </div>
            </CardContent>
          </Card>

          <Card className='border-0 shadow-sm'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-slate-600 text-sm font-medium'>
                    Total Tasks
                  </p>
                  <p className='text-3xl font-bold text-slate-900'>
                    {totalTasks}
                  </p>
                </div>
                <BarChart3 className='h-8 w-8 text-slate-400' />
              </div>
            </CardContent>
          </Card>

          <Card className='border-0 shadow-sm'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-slate-600 text-sm font-medium'>
                    In Progress
                  </p>
                  <p className='text-3xl font-bold text-amber-600'>
                    {inProgressTasks}
                  </p>
                </div>
                <Clock className='h-8 w-8 text-amber-400' />
              </div>
            </CardContent>
          </Card>

          <Card className='border-0 shadow-sm'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-slate-600 text-sm font-medium'>
                    Completed
                  </p>
                  <p className='text-3xl font-bold text-green-600'>
                    {completedTasks}
                  </p>
                </div>
                <CheckCircle2 className='h-8 w-8 text-green-400' />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Section */}
        <div className='space-y-6'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-2xl font-bold text-slate-900'>
                Recent Projects
              </h2>
              <p className='text-slate-600'>
                Your most recently updated projects
              </p>
            </div>
            <div className='flex space-x-3'>
              <Button asChild variant='outline'>
                <Link href='/projects'>
                  View All Projects
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </Button>
            </div>
          </div>

          {/* Projects Grid */}
          {isLoading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {[...Array(3)].map((_, i: number) => (
                <Card key={i} className='border-0 shadow-sm animate-pulse'>
                  <CardContent className='p-6'>
                    <div className='h-4 bg-slate-200 rounded mb-4'></div>
                    <div className='h-3 bg-slate-200 rounded mb-6 w-2/3'></div>
                    <div className='flex space-x-2 mb-4'>
                      <div className='h-6 bg-slate-200 rounded w-16'></div>
                      <div className='h-6 bg-slate-200 rounded w-20'></div>
                    </div>
                    <div className='h-9 bg-slate-200 rounded'></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (projects?.length ?? 0) > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {(projects ?? []).slice(0, 6).map((project: ProjectWithTasks) => {
                const projectTasks: Task[] = project.tasks ?? [];
                const completedCount: number = projectTasks.filter(
                  (task: Task) => task.status === "DONE"
                ).length;
                const totalCount: number = projectTasks.length;
                const completionRate: number =
                  totalCount > 0
                    ? Math.round((completedCount / totalCount) * 100)
                    : 0;

                return (
                  <Card
                    key={project.id}
                    className='border-0 shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer'
                  >
                    <CardHeader className='pb-3'>
                      <div className='flex items-start justify-between'>
                        <div className='flex-1'>
                          <CardTitle className='text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors'>
                            {project.name}
                          </CardTitle>
                          <CardDescription className='text-slate-500 mt-1'>
                            Created{" "}
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
                        >
                          {completionRate}%
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className='pt-0'>
                      <div className='space-y-4'>
                        <div className='flex items-center justify-between text-sm'>
                          <span className='text-slate-600'>Progress</span>
                          <span className='font-medium text-slate-900'>
                            {completedCount}/{totalCount} tasks
                          </span>
                        </div>

                        <div className='w-full bg-slate-200 rounded-full h-2'>
                          <div
                            className='bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300'
                            style={{ width: `${completionRate}%` }}
                          ></div>
                        </div>

                        <div className='flex items-center justify-between pt-2'>
                          <div className='flex space-x-4 text-xs text-slate-500'>
                            <span className='flex items-center'>
                              <Calendar className='h-3 w-3 mr-1' />
                              {totalCount} tasks
                            </span>
                            {projectTasks.filter(
                              (task: Task) => task.status === "IN_PROGRESS"
                            ).length > 0 && (
                              <span className='flex items-center text-amber-600'>
                                <AlertCircle className='h-3 w-3 mr-1' />
                                Active
                              </span>
                            )}
                          </div>

                          <Button
                            asChild
                            size='sm'
                            variant='ghost'
                            className='h-8 px-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                          >
                            <Link href={`/projects/${project.id}`}>
                              Open
                              <ArrowRight className='ml-1 h-3 w-3' />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className='border-0 shadow-sm'>
              <CardContent className='flex flex-col items-center justify-center py-12'>
                <FolderOpen className='h-12 w-12 text-slate-400 mb-4' />
                <h3 className='text-lg font-semibold text-slate-900 mb-2'>
                  No projects yet
                </h3>
                <p className='text-slate-600 text-center mb-6 max-w-sm'>
                  Get started by creating your first project and organizing your
                  tasks
                </p>
                <Button asChild>
                  <Link href='/projects/new'>
                    <Plus className='mr-2 h-4 w-4' />
                    Create Your First Project
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
