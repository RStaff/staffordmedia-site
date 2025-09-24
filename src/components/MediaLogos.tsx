import React from 'react';
import Image from 'next/image';

export default function MediaLogos(){
  return (
    <div className="mt-8 flex items-center justify-center gap-8">
      <Image src="/logo-grid.png" alt="Featured logos" width={420} height={40} />
    </div>
  );
}
