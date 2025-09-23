import { CheckCircleIcon, BoltIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";

const features = [
  {
    name: "Zero manual edits",
    description: "Every deploy is CLI-native. No placeholders, no patching.",
    icon: CheckCircleIcon,
  },
  {
    name: "Conversion-first layout",
    description: "Each pixel signals premium positioning and trust.",
    icon: BoltIcon,
  },
  {
    name: "Modular and scalable",
    description: "Frictionless architecture built for results and ownership.",
    icon: Cog6ToothIcon,
  },
];

export default function AbandoFeatures() {
  return (
    <>
      {features.map((feature) => (
        <div key={feature.name} className="flex flex-col items-start gap-4">
          <feature.icon className="h-8 w-8 text-[#FFD700]" />
          <h3 className="text-lg font-bold text-[#1C2D4A]">{feature.name}</h3>
          <p className="text-sm text-gray-700">{feature.description}</p>
        </div>
      ))}
    </>
  );
}
