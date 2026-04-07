"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useDeleteExampleEntity } from "@/features/example-entity/hooks/use-delete-example-entity";
import { useExampleEntities } from "@/features/example-entity/hooks/use-example-entities";
import { Link } from "@/i18n/navigation";
import { getExampleEntityErrorTranslationKey } from "@/lib/toast/messages";

export default function ExampleEntitiesTable() {
  const t = useTranslations();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const listQuery = useExampleEntities();
  const deleteMutation = useDeleteExampleEntity();

  if (listQuery.isPending) {
    return <div className="alert">Loading example entities...</div>;
  }

  if (listQuery.isError) {
    return (
      <div className="alert alert-error">
        {t(getExampleEntityErrorTranslationKey(listQuery.error.message, "toast.exampleEntity.loadListFailed"))}
      </div>
    );
  }

  if (listQuery.data.length === 0) {
    return (
      <div className="card bg-base-100 p-8 text-center shadow">
        <p className="text-base-content/70">No example entities yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-box border border-base-content/10 bg-base-100">
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Updated</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {listQuery.data.map((entity) => {
            const isDeleting =
              deleteMutation.isPending && deleteMutation.variables === entity.id;

            return (
              <tr key={entity.id}>
                <td className="font-medium">{entity.title}</td>
                <td>{new Date(entity.updatedAt).toLocaleString()}</td>
                <td className="space-x-2 text-right">
                  <Link
                    href={`/dashboard/example-entities/${entity.id}`}
                    className="btn btn-sm btn-ghost"
                  >
                    View
                  </Link>
                  <Link
                    href={`/dashboard/example-entities/${entity.id}/edit`}
                    className="btn btn-sm btn-outline"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="btn btn-sm btn-error btn-outline"
                    onClick={() => setPendingDeleteId(entity.id)}
                    disabled={isDeleting}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {pendingDeleteId ? (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="text-lg font-semibold">Delete example entity?</h3>
            <p className="py-2 text-sm text-base-content/70">
              This action cannot be undone.
            </p>
            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => setPendingDeleteId(null)}
                disabled={deleteMutation.isPending}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-error"
                onClick={async () => {
                  const id = pendingDeleteId;
                  if (!id) {
                    return;
                  }

                  try {
                    await deleteMutation.mutateAsync(id);
                    toast.success(t("toast.exampleEntity.deleted"));
                    setPendingDeleteId(null);
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
        </dialog>
      ) : null}
    </div>
  );
}
