import { setRequestLocale } from "next-intl/server";

import ExampleEntityEditScreen from "@/features/example-entity/components/example-entity-edit-screen";

export default async function EditExampleEntityPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return (
    <section className="mx-auto max-w-3xl space-y-4">
      <ExampleEntityEditScreen id={id} />
    </section>
  );
}
