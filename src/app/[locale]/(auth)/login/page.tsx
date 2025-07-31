"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "@/lib/validation/authSchema";
import { useLoginMutation } from "@/hooks/useAuthMutation";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/types/api";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const loginMutation = useLoginMutation();

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  return (
    <div className='max-w-md mx-auto mt-10'>
      <h1 className='text-2xl font-bold mb-4'>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <input
          {...register("email")}
          placeholder='Email'
          className='w-full p-2 border'
        />
        {errors.email && <p className='text-red-500'>{errors.email.message}</p>}

        <input
          {...register("password")}
          type='password'
          placeholder='Password'
          className='w-full p-2 border'
        />
        {errors.password && (
          <p className='text-red-500'>{errors.password.message}</p>
        )}

        <button
          type='submit'
          disabled={loginMutation.isPending}
          className='bg-blue-500 text-white px-4 py-2 rounded'
        >
          {loginMutation.isPending ? "Loading..." : "Login"}
        </button>

        {loginMutation.isError && (
          <p className='text-red-600'>
            {(loginMutation.error as AxiosError<ErrorResponse>)?.response?.data
              ?.message ?? "Something went wrong"}
          </p>
        )}
      </form>
    </div>
  );
}
