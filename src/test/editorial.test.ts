import { describe, expect, it } from "vitest";
import { articles, categories, getArticle } from "@/data/editorial";
import { PRODUCT_CHECKOUTS } from "@/lib/checkout";

describe("BOXE DE CRIA editorial core", () => {
  it("ships the five launch articles with unique slugs", () => {
    expect(articles).toHaveLength(5);
    const slugs = articles.map((article) => article.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs).toEqual(expect.arrayContaining([
      "boxe-para-iniciantes",
      "como-escolher-luva-de-boxe",
      "como-colocar-bandagem-de-boxe",
      "guarda-e-base-no-boxe",
      "como-fazer-jab-no-boxe",
    ]));
  });

  it("keeps health content visibly scoped", () => {
    const wraps = getArticle("como-colocar-bandagem-de-boxe");
    expect(wraps?.healthNotice).toBeTruthy();
    expect(wraps?.healthNotice?.toLowerCase()).toContain("não substitui");
  });

  it("exposes the five launch categories", () => {
    expect(categories.map((category) => category.slug)).toEqual(expect.arrayContaining([
      "tecnica-e-treino",
      "saude-do-atleta",
      "equipamentos",
      "historia-e-cultura",
      "formacao-de-treinadores",
    ]));
  });

  it("keeps each product mapped to its own Hotmart destination", () => {
    expect(PRODUCT_CHECKOUTS.corner).toContain("D105758587D");
    expect(PRODUCT_CHECKOUTS.caminho).toContain("D105758904F");
    expect(PRODUCT_CHECKOUTS.combo).toContain("E105828277Q");
    expect(new Set(Object.values(PRODUCT_CHECKOUTS)).size).toBe(3);
  });
});
