import { useEffect } from "react";
import { loadGoogleAds } from "@/lib/googleAds";
import { getConsent } from "@/lib/tracking";

/**
 * Provider global: prepara o runtime do AdSense, mas não coloca anúncios sozinho.
 * Os slots continuam sendo decididos pelo layout editorial.
 */
export default function AdSenseProvider() {
  useEffect(() => {
    if (getConsent() === "granted") void loadGoogleAds();

    const onConsent = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      if (detail === "granted") void loadGoogleAds();
    };

    window.addEventListener("bdc:consent", onConsent);
    return () => window.removeEventListener("bdc:consent", onConsent);
  }, []);

  return null;
}
