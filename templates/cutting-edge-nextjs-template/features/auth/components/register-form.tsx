"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { postRegister } from "@/features/auth/api";
import { registerSchema } from "@/features/auth/schemas/register-schema";
import { useRouter } from "@/i18n/navigation";
import { getAuthErrorTranslationKey } from "@/lib/toast/messages";

export default function RegisterForm() {
  const t = useTranslations();
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: postRegister,
    onSuccess: async () => {
      toast.success(t("toast.auth.accountCreated"));
      await queryClient.invalidateQueries({ queryKey: ["session"] });
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(
        t(getAuthErrorTranslationKey(error.message, "toast.auth.registerFailed")),
      );
    },
  });

  const form = useForm({
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
    },
    validatorAdapter: zodValidator(),
    validators: {
      onSubmit: registerSchema,
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
      <h1 className="text-2xl font-semibold">Create account</h1>

      <form.Field name="fullName">
        {(field) => (
          <label className="form-control w-full">
            <span className="label-text mb-1">Full name</span>
            <input
              className="input input-bordered w-full"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              placeholder="Your full name"
            />
            {field.state.meta.errors.length > 0 ? (
              <span className="label-text-alt text-error mt-1">
                {String(field.state.meta.errors[0])}
              </span>
            ) : null}
          </label>
        )}
      </form.Field>

      <form.Field name="username">
        {(field) => (
          <label className="form-control w-full">
            <span className="label-text mb-1">Username</span>
            <input
              className="input input-bordered w-full"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              placeholder="your_username"
            />
            {field.state.meta.errors.length > 0 ? (
              <span className="label-text-alt text-error mt-1">
                {String(field.state.meta.errors[0])}
              </span>
            ) : null}
          </label>
        )}
      </form.Field>

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

      <button className="btn btn-primary w-full" type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
