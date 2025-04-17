import Providers from "@/providers/providers";
import Sidebar from "@/components/Sidebar";
import { Header } from "@/components/Header";
import AuthGuard from "@/components/Auth/AuthGuard";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />

        <div className="flex-1 flex flex-col bg-[#f9f9f9]">
          <div className="sticky top-0 z-50">
            <Header />
          </div>

          <main className="flex-1 overflow-y-auto p-6">
            <Providers>{children}</Providers>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
