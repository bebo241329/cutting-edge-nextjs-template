import LoginForm from "@/features/auth/components/login-form";
import { setRequestLocale } from "next-intl/server";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <section className="mx-auto max-w-md py-10">
      <LoginForm />
    </section>
  );
}
