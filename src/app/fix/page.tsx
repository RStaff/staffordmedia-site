import { redirect } from "next/navigation";

type PageProps = {
  searchParams?: Promise<{ store?: string }>;
};

function cleanStoreDomain(value: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "");
}

export const dynamic = "force-dynamic";

export default async function FixRedirectPage({ searchParams }: PageProps) {
  const params = (await searchParams) || {};
  const store = cleanStoreDomain(params.store || "");

  if (!store) {
    redirect("/pricing");
  }

  redirect(`/pricing?store=${encodeURIComponent(store)}`);
}
