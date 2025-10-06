'use client';

type Gtag = (cmd: 'event', name: string, params?: Record<string, unknown>) => void;
type DataLayerPush = (obj: Record<string, unknown>) => void;
type Fbq = (cmd: 'trackCustom', name: string, params?: Record<string, unknown>) => void;

declare global {
  interface Window {
    gtag?: Gtag;
    dataLayer?: { push: DataLayerPush };
    fbq?: Fbq;
  }
}
type Props = {
  event: string;
  params?: Record<string, unknown>;
  children: React.ReactNode;
  className?: string;
};

export default function TrackCTA({ event, params, children, className }: Props) {
  const onClick = () => {
    try {
      window.gtag?.('event', event, params || {});            // GA4
      window.dataLayer?.push({ event, ...(params||{}) });     // GTM
      window.fbq?.('trackCustom', event, params || {});       // Meta
    } catch {}
  };
  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
}
