import AdminHeader from "@/components/AdminHeader";

export default function PanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col bg-page">
      <AdminHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
        {children}
      </main>
    </div>
  );
}
