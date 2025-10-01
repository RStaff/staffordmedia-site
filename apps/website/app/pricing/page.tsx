export const metadata = {
  title: "Pricing – Stafford Media Consulting",
  description: "Simple plans that pay for themselves after a single recovered cart.",
};
import Pricing from "@/components/Pricing";
export default function Page(){
  return (
    <main className="bg-[#0B1220] min-h-screen text-white">
      <Pricing />
    </main>
  );
}
