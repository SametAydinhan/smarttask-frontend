"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "@/lib/validation/authSchema";
import { useLoginMutation } from "@/hooks/useAuthMutation";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/useAuth";
import { AxiosError } from "axios";
import type { ErrorResponse } from "@/types/api";
import Link from "next/link";
import { JSX } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Loader2, AlertTriangle } from "lucide-react";

export default function LoginPage(): JSX.Element {
  const router = useRouter();
  const setAuth = useAuth((state) => state.setAuth);
  const loginMutation = useLoginMutation();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data, {
      onSuccess: (response) => {
        setAuth(response.token, response.user);
        router.push("/projects"); // Proje sayfasına yönlendirme
      },
    });
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-slate-50 p-4'>
      <Card className='w-full max-w-md shadow-lg'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl font-bold'>Welcome Back!</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }: { field: import("react-hook-form").ControllerRenderProps<LoginFormValues, "email"> }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Mail className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
                        <Input
                          placeholder='name@example.com'
                          {...field}
                          className='pl-10'
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='password'
                render={({ field }: { field: import("react-hook-form").ControllerRenderProps<LoginFormValues, "password"> }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Lock className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
                        <Input
                          type='password'
                          placeholder='••••••••'
                          {...field}
                          className='pl-10'
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {loginMutation.isError && (
                <div className='flex items-center space-x-2 rounded-md border border-red-200 bg-red-50 p-3'>
                  <AlertTriangle className='h-5 w-5 text-red-600' />
                  <p className='text-sm text-red-700'>
                    {(loginMutation.error as AxiosError<ErrorResponse>)
                      ?.response?.data?.message ??
                      "An unexpected error occurred. Please try again."}
                  </p>
                </div>
              )}

              <Button
                type='submit'
                disabled={loginMutation.isPending}
                className='w-full'
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Signing In...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className='flex justify-center'>
          <p className='text-sm text-slate-600'>
            Don&#39;t have an account?{" "}
            <Link
              href='/register'
              className='font-semibold text-blue-600 hover:underline'
            >
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
