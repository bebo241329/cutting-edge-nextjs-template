"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { postForgotPassword } from "@/features/auth/api";
import { forgotPasswordSchema } from "@/features/auth/schemas/forgot-password-schema";
import { getAuthErrorTranslationKey } from "@/lib/toast/messages";

export default function ForgotPasswordForm() {
  const t = useTranslations();

  const mutation = useMutation({
    mutationFn: postForgotPassword,
    onSuccess: () => {
      toast.success(t("toast.auth.resetSent"));
    },
    onError: (error) => {
      toast.error(
        t(getAuthErrorTranslationKey(error.message, "toast.auth.forgotPasswordFailed")),
      );
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validatorAdapter: zodValidator(),
    validators: {
      onSubmit: forgotPasswordSchema,
    },
    onSubmit: ({ value }) => {
      mutation.mutate(value);
    },
  });

  return (
    <form
      className="card bg-base-100 p-6 shadow space-y-4"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        form.handleSubmit();
      }}
    >
      <h1 className="text-2xl font-semibold">Forgot password</h1>

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

      <button className="btn btn-primary w-full" type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Submitting..." : "Send reset link"}
      </button>
    </form>
  );
}
