# BOXE DE CRIA — Google Ads / AdSense System

## 1. Objetivo

Este sistema prepara o portal editorial do BOXE DE CRIA para monetização com Google AdSense sem transformar a landing comercial em inventário publicitário e sem publicar IDs falsos.

A regra de negócio é simples:

- **landing comercial, produtos, checkout e páginas legais:** sem AdSense;
- **artigos e categorias editoriais:** elegíveis;
- **Auto ads:** desligado no lançamento;
- **slots manuais:** padrão inicial;
- **AdSense inteiro:** desligado até conta/site estarem prontos;
- **nenhum código do projeto mede cliques em anúncios.**

## 2. Arquitetura

### Runtime

- `src/config/adsense.ts` — feature flags, publisher ID, slots e regras de rota.
- `src/lib/adsense.ts` — carrega o script oficial uma única vez e solicita fill.
- `src/components/ads/AdSenseScript.tsx` — bootstrap SPA por rota.
- `src/components/ads/AdSlot.tsx` — unidade manual, responsiva, rotulada como Publicidade.
- `src/components/ads/adsense.css` — oculta unidades não preenchidas.
- `src/lib/googleConsent.ts` — ponte entre o banner local e Google Consent Mode v2.
- `src/components/CookieConsent.tsx` — atualiza consentimento Google e Meta.
- `index.html` — define Consent Mode v2 **antes** de GA/GTM.

### Operação

- `scripts/generate-ads-txt.mjs` — gera `public/ads.txt` somente com publisher ID válido.
- `scripts/adsense-readiness-audit.mjs` — auditor estrutural/política.
- `.env.adsense.example` — contrato de configuração sem credenciais reais.

## 3. Fluxo de ativação

### Etapa A — conta e site

1. Criar/usar conta Google AdSense real.
2. Adicionar o domínio/site correto na área **Sites**.
3. Copiar o Publisher ID real, formato `ca-pub-...`.
4. Manter `VITE_ADSENSE_ENABLED=false` enquanto o site estiver em preparação/revisão.

O Google pode verificar o site por snippet, metatag ou outros métodos oferecidos na conta. Não inserir Publisher ID inventado.

### Etapa B — privacidade

O projeto implementa Google Consent Mode v2 com os quatro sinais:

- `ad_storage`
- `ad_user_data`
- `ad_personalization`
- `analytics_storage`

O estado inicial é negado quando não existe uma preferência salva. O banner local atualiza o estado assim que o visitante aceita ou recusa.

**Importante:** para anúncios personalizados no EEE, Reino Unido e Suíça, o banner próprio do site não substitui a exigência de uma CMP certificada pelo Google e integrada ao IAB TCF. Configure a CMP em **AdSense → Privacidade e mensagens** antes de usar `VITE_ADSENSE_CONSENT_STRATEGY=google-cmp` para esse tráfego.

## 4. Variáveis de ambiente

Use `.env.adsense.example` como referência.

Principais valores:

```env
VITE_ADSENSE_ENABLED=false
VITE_ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXXXXXXXX
VITE_ADSENSE_CONSENT_STRATEGY=site-consent
VITE_ADSENSE_AUTO_ADS=false
VITE_ADSENSE_ALLOW_HOME=false
VITE_ADSENSE_SLOT_ARTICLE_AFTER_INTRO=XXXXXXXXXX
VITE_ADSENSE_SLOT_ARTICLE_MID=XXXXXXXXXX
VITE_ADSENSE_SLOT_ARTICLE_END=XXXXXXXXXX
VITE_ADSENSE_SLOT_DESKTOP_SIDEBAR=XXXXXXXXXX
ADSENSE_PUBLISHER_ID=pub-XXXXXXXXXXXXXXXX
```

## 5. Slots recomendados

### Artigo: depois da introdução

Objetivo: primeira unidade após o leitor já receber valor editorial.

```tsx
<AdSlot
  slot={adsenseConfig.slots.articleAfterIntro}
  placement="article-after-intro"
  minHeight={280}
/>
```

### Artigo: meio

Inserir apenas em artigos suficientemente longos. Não quebrar tabela, lista, passo-a-passo ou alerta de segurança.

```tsx
<AdSlot
  slot={adsenseConfig.slots.articleMid}
  placement="article-mid"
  minHeight={280}
/>
```

### Artigo: final

Aparece antes de relacionados/newsletter, sem competir diretamente com um botão de checkout.

```tsx
<AdSlot
  slot={adsenseConfig.slots.articleEnd}
  placement="article-end"
  minHeight={280}
/>
```

### Desktop sidebar

Somente quando o layout possuir espaço real. Não usar sticky agressivo nem unidade que encoste em controles de navegação.

## 6. Rotas monetizáveis

Permitidas por padrão:

- `/artigos/*`
- `/categoria/*`

Bloqueadas por padrão:

- `/`
- `/confianca`
- `/produtos`
- `/checkout`
- `/privacidade`
- `/termos`
- `/contato`
- `/afiliados`
- `/politica-editorial`
- `/sobre`

A homepage só pode receber anúncios se `VITE_ADSENSE_ALLOW_HOME=true`; não habilitar durante o lançamento.

## 7. ads.txt

O Google recomenda publicar o seller autorizado no diretório raiz.

Formato esperado:

```txt
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
```

O projeto **não comita** um Publisher ID falso em `/ads.txt`.

Durante o build, `scripts/generate-ads-txt.mjs` aceita:

- `ADSENSE_PUBLISHER_ID=pub-...`
- ou `VITE_ADSENSE_PUBLISHER_ID=ca-pub-...`

Com valor válido, gera `public/ads.txt` automaticamente.

Depois do deploy, confirmar que:

```txt
https://SEU-DOMINIO/ads.txt
```

responde em HTTPS com a linha correta.

## 8. Política de tráfego inválido

Nunca:

- clicar nos próprios anúncios;
- pedir a seguidores que cliquem para “ajudar o projeto”;
- criar CTA apontando para anúncio;
- colocar anúncio colado em botão, menu, player ou controle que gere clique acidental;
- comprar tráfego automatizado/robótico;
- auto-atualizar unidades para fabricar impressões;
- medir ou capturar o destino de cliques de anúncios no JavaScript do site.

Picos de Instagram devem ser identificados por UTM, mas **sem qualquer incentivo para interação com anúncios**.

## 9. Auto ads

Começar com `false`.

Só testar Auto ads depois de existir baseline de:

- Page RPM;
- viewability;
- Core Web Vitals;
- receita por sessão;
- conversão dos produtos próprios;
- bounce/engagement;
- densidade publicitária por página.

Se Auto ads for ativado, configurar Page exclusions na conta para páginas comerciais, legais e de confiança como segunda barreira além do código.

## 10. Métricas

### AdSense

- Estimated earnings
- Page RPM
- Impression RPM
- Active View / viewability quando disponível
- ad requests / impressions

### Site

- sessões por origem;
- páginas por sessão;
- engagement time;
- newsletter signup;
- product CTA click;
- checkout iniciado;
- venda atribuída.

**Não criar evento próprio de `ad_click`.** O AdSense já mede a publicidade; observar o iframe de anúncio para rastrear clique aumenta risco e não é necessário.

## 11. Ordem econômica

O sistema não foi desenhado para maximizar anúncios a qualquer custo.

Prioridade:

1. conteúdo útil;
2. produto próprio contextual;
3. newsletter/audiência própria;
4. afiliados relevantes;
5. patrocínio;
6. AdSense complementar.

Uma unidade que aumenta Page RPM mas derruba venda de e-book ou cadastro deve ser removida.

## 12. Checklist antes de ligar `VITE_ADSENSE_ENABLED=true`

- [ ] AdSense account ativa.
- [ ] Site adicionado na conta.
- [ ] Site com status pronto ou instrução equivalente na interface atual.
- [ ] Publisher ID real configurado.
- [ ] `ads.txt` válido publicado.
- [ ] Política de Privacidade atualizada para publicidade Google.
- [ ] CMP Google certificada configurada para tráfego EEE/UK/Suíça quando aplicável.
- [ ] Consent Mode testado no Tag Assistant.
- [ ] Slots reais criados na conta.
- [ ] Homepage/checkout/produtos sem ads.
- [ ] Mobile sem anúncios encostando em controles.
- [ ] Core Web Vitals medidos antes/depois.
- [ ] Nenhum CTA incentiva clique em publicidade.

## 13. Rollout recomendado

### Semana 1

- 1 unidade após introdução;
- 1 unidade no final;
- sem sidebar;
- sem Auto ads.

### Semana 2

Se UX e CWV estiverem estáveis, testar unidade de meio em artigos longos.

### Semana 3+

Decidir pelo dado: manter/remover cada slot usando receita incremental **e** impacto em produtos próprios.
