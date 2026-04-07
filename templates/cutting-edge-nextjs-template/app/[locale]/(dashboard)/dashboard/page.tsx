import { setRequestLocale } from "next-intl/server";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <p className="text-base-content/70">
        Manage authenticated dashboard workflows. Current locale: {locale}
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        <article className="card bg-base-100 p-4 shadow">
          <h2 className="text-lg font-semibold">Overview</h2>
          <p className="text-sm text-base-content/70">
            Protected dashboard landing experience.
          </p>
        </article>
        <article className="card bg-base-100 p-4 shadow">
          <h2 className="text-lg font-semibold">Example Entities</h2>
          <p className="text-sm text-base-content/70">
            List, view, create, edit, and delete example entities.
          </p>
        </article>
        <article className="card bg-base-100 p-4 shadow">
          <h2 className="text-lg font-semibold">Provider Switch</h2>
          <p className="text-sm text-base-content/70">
            Data is served by REST or Firebase through a single configuration key.
          </p>
        </article>
      </div>
    </section>
  );
}
