"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Link, usePathname, useRouter } from "@/i18n/navigation";

import { postLogout } from "@/features/auth/api";

type DashboardShellProps = {
  children: React.ReactNode;
};

const navItems = [
  { href: "/dashboard", label: "Overview", exact: true },
  { href: "/dashboard/example-entities", label: "Example Entities" },
] as const;

function getPageTitle(pathname: string) {
  if (pathname.includes("/example-entities/new")) {
    return "Create Example Entity";
  }

  if (pathname.includes("/example-entities/") && pathname.endsWith("/edit")) {
    return "Edit Example Entity";
  }

  if (pathname.includes("/example-entities/")) {
    return "Example Entity Details";
  }

  if (pathname.includes("/example-entities")) {
    return "Example Entities";
  }

  return "Dashboard Overview";
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const pageTitle = useMemo(() => getPageTitle(pathname), [pathname]);

  const logoutMutation = useMutation({
    mutationFn: postLogout,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["session"] });
      router.push("/login");
    },
  });

  return (
    <div className="flex min-h-screen bg-base-200">
      <button
        className="btn btn-primary fixed left-4 top-4 z-50 md:hidden"
        onClick={() => setIsOpen((v) => !v)}
      >
        Menu
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-base-100 transition-transform md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold">Dashboard</h2>
        </div>
        <nav className="space-y-2 px-4 pb-4">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded px-3 py-2 ${
                  isActive
                    ? "bg-primary text-primary-content"
                    : "hover:bg-base-content/10"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link href="/" className="btn btn-outline mt-4 w-full">
            Back to site
          </Link>
        </nav>
      </aside>

      {isOpen ? (
        <button
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      ) : null}

      <div className="flex min-h-screen flex-1 flex-col md:ml-64">
        <header className="navbar border-b border-base-300 bg-base-100 px-4 md:px-6">
          <div className="flex-1">
            <h1 className="text-lg font-semibold md:text-xl">{pageTitle}</h1>
          </div>
          <div className="flex-none">
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? "Signing out..." : "Sign out"}
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 pt-16 md:pt-6">{children}</main>
      </div>
    </div>
  );
}
