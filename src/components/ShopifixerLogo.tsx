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
      src="/brand/transparent-shopifixer-logo.png"
      alt="ShopiFixer"
      width={720}
      height={180}
      priority={priority}
      className={className}
    />
  );
}
