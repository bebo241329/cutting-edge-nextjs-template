import ForgotPasswordForm from "@/features/auth/components/forgot-password-form";
import { setRequestLocale } from "next-intl/server";

export default async function ForgotPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <section className="mx-auto max-w-md py-10">
      <ForgotPasswordForm />
    </section>
  );
}
