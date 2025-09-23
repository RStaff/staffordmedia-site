import { CheckCircleIcon, LightningBoltIcon, CogIcon } from "@heroicons/react/solid";

const features = [
  {
    title: "Signal Detection",
    description: "Pinpoint inefficiencies and automation gaps in real time.",
    icon: LightningBoltIcon,
  },
  {
    title: "Recovery Flows",
    description: "Reclaim hours and dollars with zero disruption to your stack.",
    icon: CheckCircleIcon,
  },
  {
    title: "Stack Ownership",
    description: "Deploy automation that founders actually control.",
    icon: CogIcon,
  },
];

export default function AbandoFeatures() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold text-[#1C2D4A] mb-10 text-center">
        Meet Abando.ai
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map(({ title, description, icon: Icon }) => (
          <div key={title} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
            <Icon className="h-8 w-8 text-[#5B2A8C] mb-4" />
            <h3 className="text-lg font-semibold text-[#1C2D4A] mb-2">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
