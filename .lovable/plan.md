## Mudanças

**1. Adicionar script de rastreamento Hotmart Launcher**
- Inserir o snippet `hot('account','fbad94f3-f9ce-370d-8fb2-cbc0656a2636')` no `index.html`, dentro do `<head>` (junto aos demais scripts de tracking como Meta Pixel e GA4), para que carregue em todas as páginas.

**2. Atualizar link do Combo**
- Em `src/pages/Index.tsx`, substituir a constante:
  - `LINK_COMBO` de `https://go.hotmart.com/E105828277Q`
  - para `https://pay.hotmart.com/E105828277Q?checkoutMode=0&bid=1779626342467`
- Isso atualiza automaticamente todos os CTAs do combo (Hero, Card Combo, Garantia, Footer e botão flutuante mobile).
- `llms.txt` e JSON-LD do `index.html` também referenciam o link antigo do combo — atualizar para o novo link de checkout direto, mantendo consistência.

## Detalhes técnicos

- O Hotmart Launcher é um script assíncrono — seguro no `<head>`.
- Nenhuma alteração em lógica de tracking de eventos (`trackCheckout`, `begin_checkout`, `InitiateCheckout`) — os botões continuam disparando Meta Pixel e GA4 normalmente, e agora o Hotmart também recebe os dados de origem via o launcher.
