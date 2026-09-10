// Capas oficiais de cada produto (fundo transparente, sem preço na imagem).
import cornerCover from "@/assets/manual-corner-site-v2.png";
import caminhoCover from "@/assets/caminho-boxeador-site-v2.png";
import comboCover from "@/assets/combo-completo-site-v2.png";
import type { ProductId } from "@/config/products";

export type Cover = { src: string; width: number; height: number; alt: string };

export const COVERS: Record<ProductId, Cover> = {
  corner: {
    src: cornerCover,
    width: 1024,
    height: 1536,
    alt: "Capa do e-book Regras do Boxe — O Manual do Córner, edição premium para treinadores",
  },
  caminho: {
    src: caminhoCover,
    width: 1024,
    height: 1536,
    alt: "Capa do e-book O Caminho do Boxeador — fundamentos técnicos e metodologia",
  },
  combo: {
    src: comboCover,
    width: 1024,
    height: 1536,
    alt: "Combo Completo — O Manual do Córner e O Caminho do Boxeador juntos",
  },
};
