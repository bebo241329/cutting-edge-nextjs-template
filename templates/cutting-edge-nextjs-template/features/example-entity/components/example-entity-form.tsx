"use client";

import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useCreateExampleEntity } from "@/features/example-entity/hooks/use-create-example-entity";
import { useUpdateExampleEntity } from "@/features/example-entity/hooks/use-update-example-entity";
import { exampleEntitySchema } from "@/features/example-entity/schemas/entity-schema";
import { useRouter } from "@/i18n/navigation";
import { getExampleEntityErrorTranslationKey } from "@/lib/toast/messages";

type ExampleEntityFormProps =
  | {
      mode: "create";
      id?: never;
      defaultValues?: never;
    }
  | {
      mode: "edit";
      id: string;
      defaultValues: {
        title: string;
        body: string;
      };
    };

export default function ExampleEntityForm(props: ExampleEntityFormProps) {
  const t = useTranslations();
  const router = useRouter();
  const createMutation = useCreateExampleEntity();
  const updateMutation = useUpdateExampleEntity();

  const isPending =
    props.mode === "create" ? createMutation.isPending : updateMutation.isPending;

  const form = useForm({
    defaultValues:
      props.mode === "create"
        ? {
            title: "",
            body: "",
          }
        : props.defaultValues,
    validatorAdapter: zodValidator(),
    validators: {
      onSubmit: exampleEntitySchema,
    },
    onSubmit: async ({ value }) => {
      try {
        if (props.mode === "create") {
          const created = await createMutation.mutateAsync(value);
          toast.success(t("toast.exampleEntity.created"));
          router.push(`/dashboard/example-entities/${created.id}`);
          return;
        }

        await updateMutation.mutateAsync({
          id: props.id,
          payload: value,
        });
        toast.success(t("toast.exampleEntity.updated"));
        router.push(`/dashboard/example-entities/${props.id}`);
      } catch {
        const errorCode =
          props.mode === "create" ? createMutation.error?.message : updateMutation.error?.message;
        toast.error(
          t(getExampleEntityErrorTranslationKey(errorCode, "toast.exampleEntity.saveFailed")),
        );
      }
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
      <h2 className="text-2xl font-semibold">
        {props.mode === "create" ? "Create Example Entity" : "Edit Example Entity"}
      </h2>

      <form.Field name="title">
        {(field) => (
          <label className="form-control w-full">
            <span className="label-text mb-1">Title</span>
            <input
              className="input input-bordered w-full"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              placeholder="Enter a title"
            />
            {field.state.meta.errors.length > 0 ? (
              <span className="label-text-alt text-error mt-1">
                {String(field.state.meta.errors[0])}
              </span>
            ) : null}
          </label>
        )}
      </form.Field>

      <form.Field name="body">
        {(field) => (
          <label className="form-control w-full">
            <span className="label-text mb-1">Body</span>
            <textarea
              className="textarea textarea-bordered min-h-40 w-full"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              placeholder="Enter content"
            />
            {field.state.meta.errors.length > 0 ? (
              <span className="label-text-alt text-error mt-1">
                {String(field.state.meta.errors[0])}
              </span>
            ) : null}
          </label>
        )}
      </form.Field>

      <button className="btn btn-primary" type="submit" disabled={isPending}>
        {isPending
          ? "Saving..."
          : props.mode === "create"
            ? "Create Example Entity"
            : "Save changes"}
      </button>
    </form>
  );
}
