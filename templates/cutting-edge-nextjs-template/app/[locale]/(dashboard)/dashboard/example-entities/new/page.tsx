import { setRequestLocale } from "next-intl/server";

import ExampleEntityForm from "@/features/example-entity/components/example-entity-form";

export default async function NewExampleEntityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <section className="mx-auto max-w-3xl space-y-4">
      <ExampleEntityForm mode="create" />
    </section>
  );
}
