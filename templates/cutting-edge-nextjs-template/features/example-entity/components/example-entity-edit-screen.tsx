"use client";

import { useTranslations } from "next-intl";

import ExampleEntityForm from "@/features/example-entity/components/example-entity-form";
import { useExampleEntity } from "@/features/example-entity/hooks/use-example-entity";
import { getExampleEntityErrorTranslationKey } from "@/lib/toast/messages";

type ExampleEntityEditScreenProps = {
  id: string;
};

export default function ExampleEntityEditScreen({ id }: ExampleEntityEditScreenProps) {
  const t = useTranslations();
  const detailQuery = useExampleEntity(id);

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
    <ExampleEntityForm
      mode="edit"
      id={id}
      defaultValues={{
        title: detailQuery.data.title,
        body: detailQuery.data.body,
      }}
    />
  );
}
