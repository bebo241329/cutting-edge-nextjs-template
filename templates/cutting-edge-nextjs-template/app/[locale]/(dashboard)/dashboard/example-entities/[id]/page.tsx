import { setRequestLocale } from "next-intl/server";

import ExampleEntityDetail from "@/features/example-entity/components/example-entity-detail";

export default async function ExampleEntityDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return (
    <section className="mx-auto max-w-4xl space-y-4">
      <ExampleEntityDetail id={id} />
    </section>
  );
}
