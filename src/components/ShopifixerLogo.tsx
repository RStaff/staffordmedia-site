import Image from "next/image";

export default function ShopifixerLogo({
  className = "",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/shopifixer-logo-dark.svg"
      alt="ShopiFixer"
      width={720}
      height={180}
      priority={priority}
      className={className}
    />
  );
}
