// =============================================================
// CONFIGURAÇÃO ÚNICA DE MEDIÇÃO — BOXE DE CRIA
//
// HISTÓRICO (não apagar): o index.html carregava 4 medidores ao
// mesmo tempo, o que gerava page_view duplicado e custo de
// performance:
//   - GT-T5P2XLG7   (Google tag)
//   - G-D168GCSVL8  (GA4)
//   - G-R6CBL4MGP3  (GA4)
//   - GTM-MC7BNL97  (Google Tag Manager)
//
// DECISÃO ATUAL: apenas UM caminho ativo — GA4 direto (gtag.js),
// carregado somente após consentimento LGPD, com send_page_view
// desligado; o page_view é disparado manualmente uma única vez
// por rota em src/lib/analytics.ts.
//
// 🔧 PARA TROCAR A PROPRIEDADE DEFINITIVA:
//    mude ACTIVE_CHANNEL e/ou GA4_MEASUREMENT_ID abaixo.
//    Para voltar ao GTM, use ACTIVE_CHANNEL = "gtm" (o container
//    passa a ser responsável pelo page_view; nesse caso desative
//    o page_view manual dentro do container).
// =============================================================

export type AnalyticsChannel = "ga4" | "gtm" | "none";

/** Único caminho de medição ativo. */
export const ACTIVE_CHANNEL: AnalyticsChannel = "ga4";

/** GA4 ativo. */
export const GA4_MEASUREMENT_ID = "G-D168GCSVL8";

/** GTM — inativo hoje, mantido para retomada consciente. */
export const GTM_CONTAINER_ID = "GTM-MC7BNL97";

/** IDs históricos, inativos. Não carregar simultaneamente. */
export const INACTIVE_MEASUREMENT_IDS = ["GT-T5P2XLG7", "G-R6CBL4MGP3"];
