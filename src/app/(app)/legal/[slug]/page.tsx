import type { Metadata } from "next";
import { notFound } from "next/navigation";

const DOCUMENTS: Record<string, string> = {
  cgu: "Conditions générales d'utilisation",
  confidentialite: "Politique de confidentialité",
  mentions: "Mentions légales",
};

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  return { title: DOCUMENTS[slug] ?? "Informations légales" };
}

export function generateStaticParams() {
  return Object.keys(DOCUMENTS).map((slug) => ({ slug }));
}

/** Pages légales : textes à fournir par le juriste avant le lancement (CDC §7). */
export default async function LegalPage({ params }: { params: Params }) {
  const { slug } = await params;
  const title = DOCUMENTS[slug];
  if (!title) notFound();

  return (
    <article className="max-w-2xl space-y-4">
      <h1 className="text-[32px] font-bold tracking-[-0.02em] text-ink sm:text-[40px]">{title}</h1>
      <p className="text-[15px] leading-relaxed text-ink-muted">
        Ce document est en cours de rédaction et sera publié avant l&apos;ouverture du service.
      </p>
    </article>
  );
}
