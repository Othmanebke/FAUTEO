import { Suspense } from "react";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

/** Gabarit des espaces connectés (pro, hôte, compte, administration). */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
      </main>
      <Footer />
    </>
  );
}
