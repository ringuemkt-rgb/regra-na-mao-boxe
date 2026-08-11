# BOXE DE CRIA — Arquitetura do Blog para Monetização

## Objetivo
Transformar o projeto atual em um portal editorial de boxe que preserve a área comercial existente e crie tráfego orgânico, audiência própria e inventário publicitário compatível com Google AdSense.

## Princípio econômico
AdSense é receita complementar. A hierarquia padrão do projeto é:

1. Produtos próprios
2. Captura de audiência própria
3. Afiliados com valor editorial real
4. Patrocínio direto
5. AdSense/programática

A métrica central não é quantidade de posts. É valor por sessão e confiança acumulada.

## Estado atual do projeto
- React + Vite + TypeScript
- React Router
- Supabase disponível
- checkout/produtos existentes
- UTMs/Meta Pixel já presentes
- consentimento de cookies
- robots.txt / sitemap.xml / llms.txt

## Arquitetura de rotas alvo

### Editorial
- `/artigos`
- `/artigos/:slug`
- `/categoria/:slug`
- `/sobre`
- `/politica-editorial`
- `/divulgacao-de-afiliados`
- `/privacidade`
- `/termos`
- `/contato`

### Comercial
- `/produtos`
- preservar `/confianca`
- preservar checkout, preços e rastreamento existentes até migração explicitamente aprovada

## Componentes recomendados

### Conteúdo
- `ArticleCard`
- `ArticleHeader`
- `ArticleBody`
- `ArticleTableOfContents`
- `ArticleSources`
- `AuthorBox`
- `ReviewerBox`
- `RelatedArticles`
- `Breadcrumbs`

### Monetização
- `ProductCard`
- `ProductInlineCTA`
- `NewsletterCTA`
- `AffiliateDisclosure`
- `AdSlot`

### Descoberta
- `ArticleSearch`
- `CategoryFilter`
- `PopularArticles`
- `LatestArticles`

## Modelo mínimo de artigo

```ts
export type Article = {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  author: string;
  reviewer?: string;
  publishedAt: string;
  updatedAt?: string;
  readingTimeMinutes: number;
  heroImage?: string;
  heroAlt?: string;
  canonical?: string;
  sources: ArticleSource[];
  relatedSlugs: string[];
  monetization: {
    productIds?: string[];
    newsletter?: boolean;
    adsEligible?: boolean;
    affiliateDisclosure?: boolean;
  };
};
```

## Modelo editorial por estágio

`idea -> brief_needed -> researching -> drafting -> review_needed -> approved -> published -> update_needed -> retired`

### Regras
- `published` exige `editorialScore >= 85`
- saúde/prevenção exige revisão de saúde
- review comercial só pode declarar teste prático quando houver evidência registrada
- nenhum status aprovado/publicado pode conter fonte inventada

## Sistema de fontes

### Prioridade para fatos que mudam
1. órgão/regulamento oficial
2. documentação primária
3. artigo científico/revisão apropriada
4. fonte secundária confiável

### Biblioteca técnica do BOXE DE CRIA
Usar como base de pesquisa, síntese e orientação temática os materiais licenciados/fornecidos pelo projeto sobre:
- atuação fisioterapêutica no boxe
- bandagem de mão
- lesões musculoesqueléticas em esportes de combate
- assistência fisioterapêutica ao atleta de combate
- metodologia cubana de ensino do boxe
- fundamentos técnicos e táticos
- estrutura/metodologia do ensino
- preparação física, técnica e tática

Não reproduzir capítulos, tabelas ou figuras protegidas. Criar explicação e ilustração próprias e citar a referência usada.

## Primeira árvore de conteúdo

### Pilar 1 — Boxe para iniciantes
- equipamentos básicos
- primeira aula
- guarda/base
- deslocamentos
- jab
- direto
- defesas básicas
- segurança

### Pilar 2 — Equipamentos
- luvas
- bandagem
- protetor bucal
- saco/manopla
- comparativos somente com critérios e experiência real quando declarada

### Pilar 3 — Saúde e prevenção
- mão/punho
- ombro
- mobilidade
- fadiga e técnica
- recuperação
- sinais de alerta / quando procurar avaliação profissional

### Pilar 4 — Técnica e tática
- base
- distância
- golpes
- defesas
- contra-ataques
- combinações
- manoplas
- estratégia

### Pilar 5 — História e cultura
- história do boxe
- escolas de boxe
- boxe brasileiro
- personagens/treinadores com fontes verificáveis

## AdSense — arquitetura segura

O componente `AdSlot` deve:
- renderizar nada quando a configuração de AdSense não existir
- receber um identificador semântico de posição
- preservar espaço para reduzir layout shift
- nunca ser colocado dentro de navegação ou perto de botões de ação ambíguos
- respeitar consentimento aplicável

### Posições inicialmente elegíveis
- `article_after_intro`
- `article_mid_content`
- `article_after_content`
- `desktop_sidebar`

### Não elegíveis por padrão
- páginas legais
- páginas de pesquisa/filtro vazias
- 404
- páginas sem conteúdo editorial substancial
- telas de checkout

## SEO técnico

Cada artigo precisa de:
- title único
- meta description única
- canonical
- Open Graph / Twitter
- H1 único
- estrutura semântica
- breadcrumb
- `Article` JSON-LD apenas com campos verdadeiros
- `BreadcrumbList`
- `Product` somente quando a página realmente descreve/vende o produto
- sitemap atualizado
- links internos contextuais

Não adicionar schema só para tentar obter rich result.

## Analytics e eventos

Preservar eventos atuais e adicionar:
- `article_view`
- `article_scroll_50`
- `article_complete`
- `newsletter_signup`
- `product_click`
- `internal_search`
- `category_click`

Não usar cliques em anúncios como KPI editorial.

## Newsletter / Supabase

Tabela sugerida: `newsletter_subscribers`

Campos mínimos:
- `id uuid`
- `email text unique`
- `consented_at timestamptz`
- `source text`
- `utm_source text`
- `utm_medium text`
- `utm_campaign text`
- `created_at timestamptz`

Requisitos:
- RLS
- política de inserção restrita ao fluxo público necessário
- não expor lista de inscritos no cliente
- validação de email
- duplicidade tratada sem vazar existência do endereço

Lead magnet inicial:
**Checklist do Primeiro Treino de Boxe**

## Automação diária

Workflow: `.github/workflows/boxe-blog-daily-audit.yml`

Executa:
1. validação da fila editorial
2. detecção de duplicidades / campos ausentes
3. hard-fail de saúde sem revisão
4. hard-fail de publicação com score < 85
5. verificação de disponibilidade/fingerprint das páginas oficiais do Google
6. relatório em artifact
7. atualização de um issue persistente

Ele não publica conteúdo.

## Evolução da automação

Quando as integrações estiverem disponíveis, adicionar ao mesmo loop:
- Google Search Console: queries, páginas, CTR, posição e indexação
- GA4: sessões, origem, scroll, conversões e receita assistida
- AdSense: page RPM, receita e viewability
- Hotmart/checkout: vendas atribuídas e receita assistida

### Motor de priorização futuro

`OpportunityScore = usefulness + topicalFit + sourceStrength + originalValue + businessValue + freshness - risk`

Usar score para escolher o que deve ser pesquisado/revisado, não para gerar páginas automaticamente.

## Rollout seguro

### Fase 1 — Fundação
- skill editorial
- fila
- audit diário
- arquitetura de rotas
- políticas/editorial pages

### Fase 2 — MVP editorial
- `/artigos`
- `/artigos/:slug`
- 5 artigos iniciais
- newsletter
- produtos contextuais

### Fase 3 — SEO/medição
- metadados por rota
- schema
- sitemap dinâmico/build-time
- eventos analytics
- Search Console

### Fase 4 — AdSense
Somente após:
- site completo
- conteúdo original suficiente
- navegação/editorial pages finalizadas
- política/privacidade adequadas
- aprovação da conta/site

Ativar anúncios progressivamente e medir impacto em UX, Core Web Vitals e conversão de produtos.

## Critério de sucesso de 90 dias
Não prometer ranking ou renda. Avaliar tendência em:
- páginas úteis indexadas
- impressões orgânicas
- cliques orgânicos
- CTR
- cadastros de email
- cliques em produtos
- vendas assistidas
- receita por 1.000 sessões
- atualizações bem-sucedidas de conteúdo existente
