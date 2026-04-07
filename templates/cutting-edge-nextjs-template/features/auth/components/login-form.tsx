"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { postLogin } from "@/features/auth/api";
import { loginSchema } from "@/features/auth/schemas/login-schema";
import { useRouter } from "@/i18n/navigation";
import { getAuthErrorTranslationKey } from "@/lib/toast/messages";

export default function LoginForm() {
  const t = useTranslations();
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: postLogin,
    onSuccess: async () => {
      toast.success(t("toast.auth.signedIn"));
      await queryClient.invalidateQueries({ queryKey: ["session"] });
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(
        t(getAuthErrorTranslationKey(error.message, "toast.auth.signInFailed")),
      );
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validatorAdapter: zodValidator(),
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: ({ value }) => {
      mutation.mutate(value);
    },
  });

  return (
    <form
      className="card bg-base-300 p-6 shadow space-y-4"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        form.handleSubmit();
      }}
    >
      <h1 className="text-2xl font-semibold">Sign in</h1>

      <form.Field name="email">
        {(field) => (
          <label className="form-control w-full">
            <span className="label-text mb-1">Email</span>
            <input
              className="input input-bordered w-full"
              type="email"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              placeholder="you@example.com"
            />
            {field.state.meta.errors.length > 0 ? (
              <span className="label-text-alt text-error mt-1">
                {String(field.state.meta.errors[0])}
              </span>
            ) : null}
          </label>
        )}
      </form.Field>

      <form.Field name="password">
        {(field) => (
          <label className="form-control w-full">
            <span className="label-text mb-1">Password</span>
            <input
              className="input input-bordered w-full"
              type="password"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              placeholder="At least 12 characters"
            />
            {field.state.meta.errors.length > 0 ? (
              <span className="label-text-alt text-error mt-1">
                {String(field.state.meta.errors[0])}
              </span>
            ) : null}
          </label>
        )}
      </form.Field>

      <button
        className="btn btn-primary w-full"
        type="submit"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
