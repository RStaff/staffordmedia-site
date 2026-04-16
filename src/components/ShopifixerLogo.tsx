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
      src="/brand/new_shopifixer-logo2.png"
      alt="ShopiFixer"
      width={880}
      height={220}
      priority={priority}
      className={className}
    />
  );
}
