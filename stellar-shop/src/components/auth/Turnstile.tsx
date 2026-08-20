import { useEffect, useRef, useState } from 'react';
declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: { sitekey: string; callback: (token: string) => void; 'expired-callback'?: () => void; 'error-callback'?: () => void }) => string;
    };
  }
}
export function Turnstile({ onVerify }: { onVerify: (token: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
  useEffect(() => {
    if (!siteKey) return;
    const render = () => {
      if (window.turnstile && ref.current && !ref.current.dataset.rendered) {
        const id = window.turnstile.render(ref.current, { sitekey: siteKey, callback: onVerify, 'expired-callback': () => onVerify(''), 'error-callback': () => onVerify('') });
        ref.current.dataset.rendered = id; setReady(true);
      }
    };
    const existing = document.getElementById('cloudflare-turnstile-script');
    if (!existing) {
      const script = document.createElement('script');
      script.id = 'cloudflare-turnstile-script'; script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'; script.async = true; script.defer = true; script.onload = render; document.head.appendChild(script);
    } else render();
  }, [siteKey, onVerify]);
  if (!siteKey) return null;
  return <div className="rounded-xl border border-base bg-soft p-3"><p className="mb-2 text-xs font-medium text-muted">Security check: verify you are human.</p><div ref={ref} />{!ready && <p className="mt-1 text-xs text-muted">Loading security check…</p>}</div>;
}
