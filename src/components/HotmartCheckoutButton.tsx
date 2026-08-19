// =============================================================
// HotmartCheckoutButton — botão único de compra do site.
//
// Todos os CTAs devem usar este componente, para garantir:
//   - carregamento único do widget da Hotmart (script + CSS);
//   - preservação de utm_*, fbclid, gclid, src e sck;
//   - InitiateCheckout no Meta Pixel antes de abrir o checkout;
//   - acessibilidade (aria-label) e funcionamento mobile/desktop.
//
// 🔧 ONDE ALTERAR checkout URL, produto, valor, moeda e campanha:
//    src/lib/checkout.ts
// =============================================================
import { useEffect } from "react";
import { Flame, Sparkles, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildCheckoutUrl, handleCheckoutClick, PRODUCT_VALUE } from "@/lib/checkout";
import { loadHotmartWidget } from "@/lib/hotmartWidget";

type Variant = "primary" | "gold" | "outline";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-[#D32F2F] hover:bg-[#B71C1C] text-white border-2 border-[#D32F2F] shadow-blood hover:brightness-90",
  gold:
    "gradient-gold text-[#0D0D0D] border-2 border-[#FFD700] shadow-gold hover:brightness-95",
  outline:
    "bg-transparent text-[#FFD700] border-2 border-[#FFD700]/60 hover:bg-[#FFD700]/10",
};

const ICONS = {
  flame: Flame,
  sparkles: Sparkles,
  download: Download,
  none: null,
} as const;

export type HotmartCheckoutButtonProps = {
  /** Texto do botão. Ex.: "COMPRAR AGORA COM ACESSO IMEDIATO" */
  children: React.ReactNode;
  /** Rótulo usado nos eventos de tracking (ex.: "Hero · Comprar agora") */
  label: string;
  /** Valor reportado nos eventos (padrão: PRODUCT_VALUE em checkout.ts) */
  value?: number;
  variant?: Variant;
  icon?: keyof typeof ICONS;
  className?: string;
  /** Texto do aria-label; se omitido, usa o texto do botão */
  ariaLabel?: string;
};

export default function HotmartCheckoutButton({
  children,
  label,
  value = PRODUCT_VALUE,
  variant = "primary",
  icon = "flame",
  className = "",
  ariaLabel,
}: HotmartCheckoutButtonProps) {
  // Carrega o widget da Hotmart uma única vez (idempotente)
  useEffect(() => {
    loadHotmartWidget();
  }, []);

  const Icon = ICONS[icon];
  const href = buildCheckoutUrl();

  return (
    <a
      // classes exigidas pelo widget da Hotmart para abrir o overlay
      className="hotmart-fb hotmart__button-checkout inline-block w-full sm:w-auto cta-button"
      href={href}
      aria-label={ariaLabel ?? (typeof children === "string" ? children : label)}
      onClick={() => {
        // InitiateCheckout + begin_checkout; fallback de redirect se o overlay não abrir.
        // Purchase NUNCA é disparado aqui.
        handleCheckoutClick(label, value);
      }}
    >
      <Button
        asChild={false}
        size="lg"
        type="button"
        tabIndex={-1}
        className={`w-full sm:w-auto font-display font-bold text-base sm:text-lg uppercase tracking-wider px-6 sm:px-10 py-7 rounded-xl transition-all duration-300 whitespace-normal text-center leading-tight ${VARIANTS[variant]} ${className}`}
      >
        {Icon && <Icon className="!size-5 shrink-0" />}
        {children}
      </Button>
    </a>
  );
}
