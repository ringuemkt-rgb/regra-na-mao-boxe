## Objetivo

Alinhar a instalação de tracking já existente ao spec enviado, sem reintroduzir `Purchase` no site (Purchase fica só na Hotmart).

## O que já está OK (manter)

- Meta Pixel carregado dinamicamente via `VITE_META_PIXEL_ID` após consent LGPD (`src/lib/metaPixel.ts`).
- `PageView` em toda mudança de rota (`RouteTracker` em `src/App.tsx`).
- `ViewContent` no mount da landing (`src/pages/Index.tsx`).
- `InitiateCheckout` centralizado em `src/lib/checkout.ts`, com delay de 250ms antes do redirect.
- Captura de UTMs/fbclid/gclid em localStorage e anexação ao link Hotmart com `src=site_boxe_de_cria` (`src/lib/tracking.ts`).
- Nenhum `Purchase` é disparado no site.

## Mudanças

### 1. `src/lib/tracking.ts`
- Adicionar `sck` e `src` à lista `TRACKING_KEYS` para também serem capturados da URL e persistidos no localStorage, propagando ao link Hotmart (mantém o default `src=site_boxe_de_cria` quando ausente).

### 2. `src/lib/metaPixel.ts`
- Ajustar `DEFAULT_CONTENT` para refletir exatamente o spec: `content_name: "Boxe de Cria Ebook"`, `content_category: "Ebook / Boxe / Artes Marciais"`, `content_type: "product"`, `currency: "BRL"`.
- Tornar `value` obrigatório em `trackViewContent` e `trackInitiateCheckout` (sem default fixo) para evitar o 89,90 hardcoded — o valor passa a vir do chamador.
- Comentários no topo explicando como trocar pixel ID (via `.env` `VITE_META_PIXEL_ID`).

### 3. `src/lib/checkout.ts`
- Aceitar `value` por CTA (sem default 89,9). Os chamadores passam o preço real do item:
  - Card "Manual do Córner" → 49.90
  - Card "Caminho do Boxeador" → 67.90
  - Hero / Combo / Garantia / Footer / Mobile floating → 89.90
- Constante `HOTMART_CHECKOUT_URL` (combo) mantida; comentário deixando claro que é o destino único atual.

### 4. `src/pages/Index.tsx`
- `trackViewContent(89.9)` no mount (valor do produto principal exibido na landing — o combo).
- Atualizar cada `handleCheckoutClick(label)` para passar o `value` correspondente ao CTA (49.90 / 67.90 / 89.90).

### 5. `index.html`
- Sem mudanças no Pixel (continua carregado pós-consent, como manda a LGPD). Não adicionar `<noscript><img>` do Pixel para não disparar PageView sem consentimento.
- Manter GA4 e Hotmart Launcher como estão.

## Não-mudanças (decisões)

- **Valor por CTA** (em vez do 47,00 do spec): o produto principal vendido é o Combo a R$ 89,90, e os cards individuais têm preços próprios. Usar 47,00 reportaria valor errado ao Meta.
- **`sck` adicionado** à persistência de tracking.
- **Sem `<noscript>` do Pixel**: dispararia evento antes do consent LGPD; mantemos somente carregamento controlado.

## Arquivos editados

- `src/lib/tracking.ts`
- `src/lib/metaPixel.ts`
- `src/lib/checkout.ts`
- `src/pages/Index.tsx`
