import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { adsenseConfig, isAdRouteEligible } from "@/config/adsense";
import { loadAdSense } from "@/lib/adsense";

/**
 * SPA-aware AdSense bootstrap.
 *
 * The script is only introduced after a user reaches a monetizable editorial
 * route. Manual ad slots remain the default. If Auto ads are enabled later in
 * AdSense, configure Page exclusions in the AdSense dashboard for commercial,
 * legal and trust routes as an additional server-side/account-level safeguard.
 */
export default function AdSenseScript() {
  const location = useLocation();

  useEffect(() => {
    const attemptLoad = () => {
      if (!isAdRouteEligible(location.pathname)) return;
      loadAdSense(location.pathname);
    };

    attemptLoad();

    if (adsenseConfig.consentStrategy === "site-consent") {
      window.addEventListener("bdc:consent", attemptLoad);
      return () => window.removeEventListener("bdc:consent", attemptLoad);
    }

    return undefined;
  }, [location.pathname]);

  return null;
}
