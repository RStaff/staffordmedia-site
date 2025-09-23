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
      <Image src="/media/forbes.png" alt="Featured in Forbes" width={120} height={40} />
      <Image src="/media/techcrunch.png" alt="Featured in TechCrunch" width={140} height={40} />
      <Image src="/media/times.png" alt="Featured in The Times" width={100} height={40} />
    </div>
  );
}
