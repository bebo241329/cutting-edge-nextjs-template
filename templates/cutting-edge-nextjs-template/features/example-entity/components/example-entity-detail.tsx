"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useDeleteExampleEntity } from "@/features/example-entity/hooks/use-delete-example-entity";
import { useExampleEntity } from "@/features/example-entity/hooks/use-example-entity";
import { Link, useRouter } from "@/i18n/navigation";
import { getExampleEntityErrorTranslationKey } from "@/lib/toast/messages";

type ExampleEntityDetailProps = {
  id: string;
};

export default function ExampleEntityDetail({ id }: ExampleEntityDetailProps) {
  const t = useTranslations();
  const router = useRouter();
  const detailQuery = useExampleEntity(id);
  const deleteMutation = useDeleteExampleEntity();

  if (detailQuery.isPending) {
    return <div className="alert">Loading example entity...</div>;
  }

  if (detailQuery.isError) {
    return (
      <div className="alert alert-error">
        {t(getExampleEntityErrorTranslationKey(detailQuery.error.message, "toast.exampleEntity.loadFailed"))}
      </div>
    );
  }

  if (!detailQuery.data) {
    return <div className="alert">Example entity not found.</div>;
  }

  return (
    <article className="card bg-base-100 shadow">
      <div className="card-body space-y-4">
        <h2 className="card-title text-2xl">{detailQuery.data.title}</h2>
        <p className="whitespace-pre-wrap text-base-content/80">{detailQuery.data.body}</p>
        <p className="text-sm text-base-content/60">
          Updated: {new Date(detailQuery.data.updatedAt).toLocaleString()}
        </p>
        <div className="card-actions justify-end gap-2">
          <Link
            href={`/dashboard/example-entities/${detailQuery.data.id}/edit`}
            className="btn btn-outline"
          >
            Edit
          </Link>
          <button
            type="button"
            className="btn btn-error btn-outline"
            onClick={async () => {
              const isConfirmed = window.confirm(
                "Delete this example entity? This action cannot be undone."
              );

              if (!isConfirmed) {
                return;
              }

              try {
                await deleteMutation.mutateAsync(detailQuery.data.id);
                toast.success(t("toast.exampleEntity.deleted"));
                router.push("/dashboard/example-entities");
              } catch {
                toast.error(
                  t(
                    getExampleEntityErrorTranslationKey(
                      deleteMutation.error?.message,
                      "toast.exampleEntity.deleteFailed",
                    ),
                  ),
                );
              }
            }}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </article>
  );
}
