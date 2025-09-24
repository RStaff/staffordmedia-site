import React from 'react';
import Image from 'next/image';
import MediaLogos from '@/components/MediaLogos';

export default function Home() {
  return (
    <section className="min-h-hero flex items-center py-16">
      <div className="container-max grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6 lg:pr-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight" style={{color:'#FFFFFF'}}>
            Unlock 4× ROI in 4 days— no redesigns, no downtime.
          </h1>

          <p className="text-base text-gray-200 max-w-xl">
            Try Abando.ai free: cancel anytime.
          </p>

          <div className="flex items-center gap-4 mt-2">
            <div className="w-10 h-10 rounded-md flex items-center justify-center" style={{background:'#FFE169'}}>
              <span className="font-bold text-sm" style={{color:'#0A0F2A'}}>A</span>
            </div>
            <div className="text-sm text-gray-200">Abando.ai</div>
          </div>

          <div className="flex flex-wrap gap-4 mt-6">
            <a className="btn-primary" href="/signup">Start Free Trial</a>
            <a className="btn-secondary" href="#demo">See Abando.ai In Action</a>
          </div>

          <div className="mt-8">
            <MediaLogos />
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-md bg-white/5 rounded-2xl p-8 flex items-center justify-center">
            <Image src="/logo-grid.png" alt="Hero graphic placeholder" width={420} height={280} />
          </div>
        </div>
      </div>
    </section>
  );
}
