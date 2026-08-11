// =============================================================
// Banner LGPD — Aceitar / Recusar cookies opcionais.
// Sincroniza Meta Pixel + Google Consent Mode v2.
// =============================================================
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";
import { getConsent, setConsent } from "@/lib/tracking";
import { loadMetaPixel } from "@/lib/metaPixel";
import { updateGoogleConsent } from "@/lib/googleConsent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const status = getConsent();

    if (status === "granted") {
      updateGoogleConsent("granted");
      loadMetaPixel();
    } else if (status === "denied") {
      updateGoogleConsent("denied");
    } else {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    setConsent("granted");
    updateGoogleConsent("granted");
    loadMetaPixel();
    setVisible(false);
  };

  const decline = () => {
    setConsent("denied");
    updateGoogleConsent("denied");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Preferências de cookies"
      className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4 pb-[calc(env(safe-area-inset-bottom)+12px)] lg:pb-4"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-[#FFD700]/30 bg-[#0D0D0D]/95 backdrop-blur shadow-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <Cookie className="size-6 text-[#FFD700] shrink-0" />
        <p className="text-xs sm:text-sm text-white/85 leading-relaxed flex-1">
          Usamos cookies opcionais para medir o desempenho e, quando o blog
          estiver monetizado, veicular publicidade conforme suas preferências.
          Você pode aceitar ou recusar. Cookies essenciais continuam ativos para
          o funcionamento do site.
        </p>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            onClick={decline}
            variant="outline"
            className="flex-1 sm:flex-none border-white/20 text-white hover:bg-white/10"
          >
            Recusar
          </Button>
          <Button
            onClick={accept}
            className="flex-1 sm:flex-none bg-[#FFD700] text-[#0D0D0D] hover:bg-[#FFC700] font-bold"
          >
            Aceitar
          </Button>
        </div>
      </div>
    </div>
  );
}
