import Image from "next/image";
import React from "react";

export default function MediaLogos() {
  return (
    <div className="media-logos" style={{
      display: "flex",
      justifyContent: "center",
      gap: "2rem",
      marginBottom: "2rem"
    }}>
      <Image src="/logo-grid.png" alt="Featured in Forbes" width={120} height={40} />
      <Image src="/smc-new-logo.png" alt="Featured in TechCrunch" width={140} height={40} />
      <Image src="/logo-grid.png" alt="Featured in The Times" width={100} height={40} />
    </div>
  );
}
