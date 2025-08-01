"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegisterMutation } from "@/hooks/useAuthMutation";
import {
  registerSchema,
  RegisterFormValues,
} from "@/lib/validation/authSchema";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import type { ErrorResponse } from "@/types/api";
import Link from "next/link";
import { JSX } from "react";

// UI Bileşenleri ve İkonlar
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
import { User, Mail, Lock, Loader2, AlertTriangle } from "lucide-react";

export default function RegisterPage(): JSX.Element {
  const router = useRouter();
  const mutation = useRegisterMutation();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    mutation.mutate(data, {
      onSuccess: () => {
        // Başarılı kayıt sonrası kullanıcıyı giriş yapmaya yönlendirmek daha iyi bir UX'tir.
        router.push("/login");
      },
    });
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-slate-50 p-4'>
      <Card className='w-full max-w-md shadow-lg'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl font-bold'>
            Create an Account
          </CardTitle>
          <CardDescription>
            Enter your details below to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <User className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
                        <Input
                          placeholder='John Doe'
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
                name='email'
                render={({ field }) => (
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
                render={({ field }) => (
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

              {mutation.isError && (
                <div className='flex items-center space-x-2 rounded-md border border-red-200 bg-red-50 p-3'>
                  <AlertTriangle className='h-5 w-5 text-red-600' />
                  <p className='text-sm text-red-700'>
                    {(mutation.error as AxiosError<ErrorResponse>)?.response
                      ?.data?.message ??
                      "An unexpected error occurred. Please try again."}
                  </p>
                </div>
              )}

              <Button
                type='submit'
                disabled={mutation.isPending}
                className='w-full'
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Creating Account...
                  </>
                ) : (
                  "Register"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className='flex justify-center'>
          <p className='text-sm text-slate-600'>
            Already have an account?{" "}
            <Link
              href='/login'
              className='font-semibold text-blue-600 hover:underline'
            >
              Log In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
