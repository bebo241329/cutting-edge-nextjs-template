import { Link } from "@/i18n/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";

export default async function UnauthorizedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.unauthorized");

  return (
    <section className="mx-auto max-w-xl py-16 text-center space-y-4">
      <h1 className="text-3xl font-semibold">{t("title")}</h1>
      <h2 className="text-xl text-base-content/80">{t("heading")}</h2>
      <p className="text-base-content/70">{t("description")}</p>
      <div>
        <Link className="btn btn-primary" href="/">
          {t("backToHome")}
        </Link>
      </div>
    </section>
  );
}
