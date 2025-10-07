'use client';
import Script from 'next/script';

const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
const gaId  = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID; // e.g. G-XXXX
const fbId  = process.env.NEXT_PUBLIC_FB_PIXEL_ID;       // e.g. 1234567890

export default function Analytics() {
  return (
    <>
      {/* Google Tag Manager */}
      {gtmId ? (
        <>
          <Script id="gtm" strategy="afterInteractive">{`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${gtmId}');
          `}</Script>
        </>
      ) : null}

      {/* GA4 direct (optional if not routed via GTM) */}
      {gaId ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', { anonymize_ip: true });
          `}</Script>
        </>
      ) : null}

      {/* Meta Pixel (optional) */}
      {fbId ? (
        <>
          <Script id="fb-pixel" strategy="afterInteractive">{`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
            (window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${fbId}'); fbq('track', 'PageView');
          `}</Script>
          <noscript>
            { }
            <img height="1" width="1" style={{display:'none'}}
              src={`https://www.facebook.com/tr?id=${fbId}&ev=PageView&noscript=1`} alt="" />
          </noscript>
        </>
      ) : null}
    </>
  );
}
