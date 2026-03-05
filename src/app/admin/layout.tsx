import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — PNG Minify",
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}

