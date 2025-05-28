"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import Image from "next/image";
import Providers from "../../providers/providers";
import AuthGuard from "@/components/Auth/AuthGuard";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const imageSrc =
    pathname === "/onboarding/campaign" ? "/onboardingCampaign.svg" : "/onboardingHero.svg";

  return ( 
    <>
      <Header />
      <main className="flex h-[calc(100vh-80px)] overflow-hidden scrollbar-hide">
        <AuthGuard>
          <div className="w-1/2 h-full overflow-y-auto p-10">
            <Providers>{children}</Providers>
          </div>
          <div className="w-1/2 relative hidden lg:block">
            <Image
              src={imageSrc}
              alt="Onboarding Visual"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        </AuthGuard>
      </main>
    </>
  );
}
