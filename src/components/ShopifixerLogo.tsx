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
      src="/brand/shopifixer-logo-final.png"
      alt="ShopiFixer"
      width={880}
      height={220}
      priority={priority}
      className={className}
    />
  );
}
