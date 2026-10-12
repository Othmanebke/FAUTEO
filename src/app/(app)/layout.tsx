import { Suspense } from "react";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

/** Gabarit des espaces connectés (pro, hôte, compte, administration). */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-[1216px] flex-1 px-4 pb-24 pt-10 sm:px-8 lg:pb-32 lg:pt-14">
        <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
      </main>
      <Footer rounded />
    </>
  );
}
