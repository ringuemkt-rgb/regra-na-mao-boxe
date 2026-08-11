# BOXE DE CRIA — Google AdSense System

Status padrão: **SAFE / OFF**.

Este sistema foi desenhado para monetizar o portal editorial sem contaminar a experiência comercial, sem inventar IDs do Google e sem ativar publicidade antes da aprovação do site.

## 1. Arquitetura

```text
AdSense account
  ├─ Site approval
  ├─ Privacy & messaging / certified CMP
  ├─ Manual ad units
  ├─ ads.txt
  └─ Management API v2
          ↓
GitHub Actions daily monitor
          ↓
React app
  ├─ AdSenseScript (route + consent guard)
  ├─ AdSlot (manual placements)
  ├─ editorial routes only
  └─ commercial/legal routes blocked
```

## 2. Filosofia de monetização

Prioridade do BOXE DE CRIA:

1. conteúdo útil;
2. produtos próprios;
3. audiência própria/newsletter;
4. afiliados contextuais;
5. patrocínios;
6. AdSense como receita complementar.

Nunca aumente carga publicitária apenas para maximizar pageviews ou cliques.

## 3. Rotas monetizáveis

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

A home só pode receber anúncios se `VITE_ADSENSE_ALLOW_HOME=true`.

## 4. Ativação em produção

### 4.1 AdSense

1. Adicione o domínio em **AdSense > Sites**.
2. Insira/verifique o código quando solicitado pelo Google.
3. Aguarde o estado do site chegar a `READY`.
4. Configure **Privacy & messaging** antes de tráfego internacional relevante.
5. Crie quatro blocos responsivos manuais:
   - article-after-intro;
   - article-mid;
   - article-end;
   - desktop-sidebar.
6. Copie os IDs reais para as variáveis de ambiente.
7. Publique o `ads.txt` exato fornecido pelo Google.
8. Somente então mude `VITE_ADSENSE_ENABLED=true`.

### 4.2 Variáveis Vite

```env
VITE_ADSENSE_ENABLED=true
VITE_ADSENSE_PUBLISHER_ID=ca-pub-0000000000000000
VITE_ADSENSE_CONSENT_STRATEGY=google-cmp
VITE_ADSENSE_AUTO_ADS=false
VITE_ADSENSE_ALLOW_HOME=false
VITE_ADSENSE_DEBUG=false
VITE_ADSENSE_SLOT_ARTICLE_AFTER_INTRO=0000000000
VITE_ADSENSE_SLOT_ARTICLE_MID=0000000000
VITE_ADSENSE_SLOT_ARTICLE_END=0000000000
VITE_ADSENSE_SLOT_DESKTOP_SIDEBAR=0000000000
```

Nunca use valores de exemplo em produção.

## 5. CMP / consentimento

Estratégia recomendada: `google-cmp`.

Configure o CMP certificado do Google em **AdSense > Privacy & messaging**. Para anúncios personalizados no EEE, Reino Unido e Suíça, o fluxo precisa respeitar os requisitos de CMP certificada/TCF do Google.

`site-consent` é um modo adicional para exigir o aceite do banner local antes do carregamento do script. Ele **não deve ser tratado como substituto** da CMP certificada exigida pelo Google para anúncios personalizados nas regiões aplicáveis.

O banner local existente continua controlando o Meta Pixel. Não misture consentimento de Meta e Google sem uma política de consentimento explicitamente revisada.

## 6. Manual slots primeiro

O rollout inicial usa blocos manuais.

Razões:

- controla densidade;
- protege CTAs comerciais;
- reduz risco de anúncios próximos a botões;
- permite reservar espaço e reduzir CLS;
- facilita testes por posição;
- evita monetização indevida de páginas legais/comerciais.

`VITE_ADSENSE_AUTO_ADS=false` deve permanecer assim no primeiro ciclo.

Quando houver dados suficientes, teste Auto ads usando **Experiments** no próprio AdSense, preferencialmente com exclusões de páginas para rotas comerciais e legais.

## 7. Inserção em artigos

Exemplo:

```tsx
import AdSlot from "@/components/ads/AdSlot";
import { adsenseConfig } from "@/config/adsense";

<AdSlot
  placement="article-after-intro"
  slot={adsenseConfig.slots.articleAfterIntro}
/>
```

Posições recomendadas para teste:

1. depois da introdução/resposta principal;
2. aproximadamente no meio de artigos longos;
3. após a conclusão, antes dos relacionados;
4. sidebar somente em desktop e sem competir com navegação/CTA.

Não inserir anúncio:

- entre título e primeira frase;
- colado a botão de compra;
- dentro de formulário;
- como se fosse recomendação editorial;
- em áreas que induzam clique acidental.

## 8. ads.txt

O arquivo deve estar disponível em:

```text
https://SEU-DOMINIO/ads.txt
```

Use **somente** a linha entregue pela sua conta AdSense. O repositório contém `public/ads.txt.example` como lembrete e não como arquivo publicável.

## 9. Monitor diário pela API

Workflow:

```text
.github/workflows/adsense-daily-report.yml
```

Execução:

- diariamente às 09:15 America/Bahia;
- manualmente por `workflow_dispatch`;
- gera artifact de 30 dias;
- atualiza um issue persistente `[BOT] AdSense — relatório diário`.

Dados consultados:

- estado dos sites (`READY`, `NEEDS_ATTENTION`, etc.);
- Auto ads ligado/desligado;
- policy issues;
- alertas;
- page views;
- ad requests;
- impressões;
- cliques;
- Page CTR;
- cobertura;
- Active View viewability;
- receita estimada;
- Page RPM.

### GitHub Actions Secrets

Crie em **Settings > Secrets and variables > Actions**:

```text
ADSENSE_CLIENT_ID
ADSENSE_CLIENT_SECRET
ADSENSE_REFRESH_TOKEN
ADSENSE_ACCOUNT_ID   # opcional se o OAuth enxergar exatamente uma conta
```

A API do AdSense exige OAuth 2.0 com usuário autenticado. Não coloque client secret nem refresh token em variáveis `VITE_*`.

Escopo recomendado para o monitor:

```text
https://www.googleapis.com/auth/adsense.readonly
```

## 10. KPIs

Não otimize somente receita.

Acompanhe em conjunto:

- Page RPM;
- cobertura;
- viewability;
- receita por página;
- engaged sessions;
- Core Web Vitals;
- cliques em produtos;
- newsletter signup;
- checkout iniciado;
- receita própria por mil sessões.

Uma posição de anúncio deve ser removida se aumentar receita publicitária mas degradar significativamente leitura, velocidade ou conversão dos produtos próprios.

## 11. Regras de segurança

Nunca:

- clique nos próprios anúncios;
- peça que leitores cliquem nos anúncios;
- compre tráfego duvidoso para elevar receita;
- coloque anúncios perto de controles de navegação de forma enganosa;
- imite o design de um anúncio para fazê-lo parecer conteúdo editorial;
- automatize cliques/impressões;
- publique conteúdo raso apenas para criar inventário de anúncios.

## 12. Rollout recomendado

### Fase A — antes da aprovação

- `VITE_ADSENSE_ENABLED=false`;
- construir artigos e páginas institucionais;
- validar Core Web Vitals;
- configurar CMP;
- solicitar aprovação.

### Fase B — primeiros 30 dias

- manual slots somente;
- 1 a 2 posições por artigo no início;
- home sem anúncios;
- acompanhar cobertura, Page RPM, viewability e conversões próprias.

### Fase C — otimização

- testar terceira posição apenas em artigos longos;
- testar sidebar desktop;
- usar Experiments no AdSense;
- comparar receita incremental com perda/ganho de conversão.

### Fase D — escala

- expandir somente os placements vencedores;
- manter page exclusions;
- revisar policy issues diariamente;
- usar atualização editorial para aumentar valor por página, não quantidade artificial de páginas.
