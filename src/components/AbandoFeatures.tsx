import { CheckCircleIcon, BoltIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";

const features = [
  {
    name: "Automation-first",
    description: "Zero manual edits. CLI-native scaffolds only.",
    icon: CheckCircleIcon,
  },
  {
    name: "Conversion-driven",
    description: "Every deploy signals premium positioning.",
    icon: BoltIcon,
  },
  {
    name: "Modular architecture",
    description: "Scalable, frictionless, and brand-aligned.",
    icon: Cog6ToothIcon,
  },
];

export default function AbandoFeatures() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12 px-6">
      {features.map((feature) => (
        <div key={feature.name} className="flex flex-col items-start gap-3">
          <feature.icon className="h-6 w-6 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">{feature.name}</h3>
          <p className="text-sm text-gray-300">{feature.description}</p>
        </div>
      ))}
    </section>
  );
}
