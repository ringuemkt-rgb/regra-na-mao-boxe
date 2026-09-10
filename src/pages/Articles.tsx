// Hub de artigos: /artigos
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "@/lib/seo";
import { fetchPublishedPosts, fetchCategories, type Post, type Category } from "@/lib/blog";

export default function Articles() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchPublishedPosts(), fetchCategories()])
      .then(([p, c]) => {
        setPosts(p);
        setCats(c);
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  const catName = (id: string | null) =>
    cats.find((c) => c.id === id)?.name ?? null;

  return (
    <main className="min-h-screen bg-[#050505] text-[#F0E6D2]">
      <Seo
        title="Artigos de boxe — técnica, regras e cultura | Boxe de Cria"
        description="Artigos da Boxe de Cria sobre técnica, treino, saúde do atleta, equipamentos e cultura do boxe."
        path="/artigos"
        noindex={!loading && posts.length === 0}
      />
      <div className="mx-auto max-w-4xl px-4 py-12">
        <Link to="/" className="text-sm text-[#C9BDAA] hover:text-[#FFD700]">
          ← Página inicial
        </Link>
        <h1 className="mt-6 font-display text-3xl sm:text-4xl font-bold uppercase tracking-wide text-[#FFD700]">
          Artigos
        </h1>
        <p className="mt-2 text-[#C9BDAA]">
          Técnica, regras, prevenção e cultura da luta.
        </p>

        {loading && <p className="mt-10 text-sm text-[#C9BDAA]">Carregando…</p>}

        {!loading && posts.length === 0 && (
          <p className="mt-10 text-sm text-[#C9BDAA]">
            Nenhum artigo publicado ainda.
          </p>
        )}

        <ul className="mt-10 space-y-6">
          {posts.map((p) => (
            <li
              key={p.id}
              className="rounded-2xl border border-white/10 p-5 hover:border-[#FFD700]/40"
            >
              <Link to={`/artigos/${p.slug}`}>
                <h2 className="font-display text-xl text-[#F0E6D2]">{p.title}</h2>
                <p className="mt-2 text-sm text-[#C9BDAA]">{p.excerpt}</p>
                <p className="mt-3 text-xs uppercase tracking-widest text-[#B78A56]">
                  {[catName(p.category_id), p.read_time].filter(Boolean).join(" · ")}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
