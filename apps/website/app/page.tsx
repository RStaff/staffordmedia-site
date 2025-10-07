import Hero from "./components/Hero";

export default function Page() {
  const variant = "roi" as const;
  return <Hero variant={variant} />;
}
