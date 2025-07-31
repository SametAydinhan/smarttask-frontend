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
import { ErrorResponse } from "@/types/api";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const router = useRouter();
  const mutation = useRegisterMutation();

  const onSubmit = (data: RegisterFormValues) => {
    mutation.mutate(data, {
      onSuccess: () => {
        router.push("/dashboard"); // 🧭 Başarılı kayıt sonrası yönlendirme
      },
    });
  };

  return (
    <div className='max-w-md mx-auto mt-10'>
      <h1 className='text-2xl font-bold mb-4'>Register</h1>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <input
          {...register("name")}
          placeholder='Name'
          className='w-full p-2 border rounded'
        />
        {errors.name && <p className='text-red-500'>{errors.name.message}</p>}

        <input
          {...register("email")}
          placeholder='Email'
          className='w-full p-2 border rounded'
        />
        {errors.email && <p className='text-red-500'>{errors.email.message}</p>}

        <input
          {...register("password")}
          type='password'
          placeholder='Password'
          className='w-full p-2 border rounded'
        />
        {errors.password && (
          <p className='text-red-500'>{errors.password.message}</p>
        )}

        <button
          type='submit'
          disabled={mutation.isPending}
          className='bg-green-500 text-white px-4 py-2 rounded'
        >
          {mutation.isPending ? "Loading..." : "Register"}
        </button>

        {mutation.isError && (
          <p className='text-red-600'>
            {(mutation.error as AxiosError<ErrorResponse>)?.response?.data
              ?.message ?? "An error occurred"}
          </p>
        )}
      </form>
    </div>
  );
}
