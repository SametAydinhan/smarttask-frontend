import { useMutation, UseMutationResult } from "@tanstack/react-query"
import { login, register } from "../services/authService"
import { useAuth } from "../store/useAuth"
import { LoginFormValues, RegisterFormValues } from "@/lib/validation/authSchema";
import { AuthResponse } from "@/types/auth";
import { AxiosError } from "axios";


// Login
export const useLoginMutation = (): UseMutationResult<
  AuthResponse,
  AxiosError,
  LoginFormValues
> =>
  useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      useAuth.getState().setAuth(data.token, data.user);
    },
  });

// Register
export const useRegisterMutation = (): UseMutationResult<
  AuthResponse,
  AxiosError,
  RegisterFormValues
> =>
  useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      useAuth.getState().setAuth(data.token, data.user);
    },
  });