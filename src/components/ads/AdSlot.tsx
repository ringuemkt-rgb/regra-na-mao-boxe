import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { adsenseConfig, isAdRouteEligible, isValidAdSlot } from "@/config/adsense";
import { loadAdSense, requestAdFill } from "@/lib/adsense";
import { getConsent } from "@/lib/tracking";

export type AdPlacement = "article-after-intro" | "article-mid" | "article-end" | "desktop-sidebar";

type Props = {
  slot: string;
  placement?: AdPlacement;
  label?: string;
  className?: string;
  minHeight?: number;
  format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
};

export default function AdSlot({ slot, placement = "article-mid", label = "Publicidade", className = "", minHeight = 280, format = "auto" }: Props) {
  const location = useLocation();
  const requested = useRef(false);
  const [consent, setConsentState] = useState(() => getConsent());

  useEffect(() => {
    const onConsent = (event: Event) => {
      const value = (event as CustomEvent<string>).detail;
      if (value === "granted" || value === "denied") setConsentState(value);
    };
    window.addEventListener("bdc:consent", onConsent);
    return () => window.removeEventListener("bdc:consent", onConsent);
  }, []);

  const consentEligible = adsenseConfig.consentStrategy !== "site-consent" || consent === "granted";
  const eligible = isAdRouteEligible(location.pathname) && isValidAdSlot(slot) && consentEligible;

  useEffect(() => {
    requested.current = false;
    if (!eligible) return;
    loadAdSense(location.pathname);
    requested.current = requestAdFill();
  }, [eligible, location.pathname, slot]);

  if (!eligible) return null;

  return (
    <aside className={`bdc-ad-slot my-8 w-full overflow-hidden ${className}`} data-ad-placement={placement} aria-label="Publicidade">
      <div className="mb-2 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground/70">{label}</div>
      <ins className="adsbygoogle block w-full" style={{ display: "block", minHeight }} data-ad-client={adsenseConfig.publisherId} data-ad-slot={slot} data-ad-format={format} data-full-width-responsive="true" />
    </aside>
  );
}
