import { setRequestLocale } from "next-intl/server";

import ExampleEntitiesTable from "@/features/example-entity/components/example-entities-table";
import { Link } from "@/i18n/navigation";

export default async function ExampleEntitiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Example Entities</h1>
        <Link href="/dashboard/example-entities/new" className="btn btn-primary">
          Create Example Entity
        </Link>
      </div>
      <ExampleEntitiesTable />
    </section>
  );
}
