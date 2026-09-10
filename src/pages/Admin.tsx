// =============================================================
// Área de administração editorial: /admin
// Publicar, editar e excluir artigos e categorias sem SQL.
// Acesso somente para contas com papel de administrador
// (validado no servidor pelas regras de acesso do banco).
// =============================================================
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "@/lib/seo";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  createCategory,
  createPost,
  deleteCategory,
  deletePost,
  fetchAllPosts,
  fetchCategories,
  postBodyText,
  updateCategory,
  updatePost,
  type Category,
  type Post,
  type PostInput,
} from "@/lib/blog";

const EMPTY_POST: PostInput = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  category_id: null,
  cover_image: null,
  read_time: null,
  seo_title: null,
  seo_description: null,
  status: "draft",
  featured: false,
};

const input =
  "w-full rounded-lg border border-white/15 bg-[#0B0B0B] px-3 py-2 text-sm text-[#F0E6D2] outline-none focus:border-[#FFD700]";
const btn =
  "rounded-lg px-4 py-2 text-sm font-bold uppercase tracking-wide transition disabled:opacity-50";

export default function Admin() {
  const { session, isAdmin, loading } = useIsAdmin();
  const [posts, setPosts] = useState<Post[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [form, setForm] = useState<PostInput>(EMPTY_POST);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [catForm, setCatForm] = useState({ name: "", slug: "", description: "" });
  const [editingCat, setEditingCat] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const reload = useCallback(async () => {
    try {
      const [p, c] = await Promise.all([fetchAllPosts(), fetchCategories()]);
      setPosts(p);
      setCats(c);
    } catch (e) {
      toast({ title: "Não foi possível carregar o conteúdo", variant: "destructive" });
    }
  }, []);

  useEffect(() => {
    if (isAdmin) void reload();
  }, [isAdmin, reload]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] px-4 py-20 text-[#C9BDAA]">
        Verificando acesso…
      </main>
    );
  }

  if (!session || !isAdmin) {
    return (
      <main className="min-h-screen bg-[#050505] px-4 py-20 text-[#F0E6D2]">
        <Seo
          title="Administração | Boxe de Cria"
          description="Área restrita."
          path="/admin"
          noindex
        />
        <div className="mx-auto max-w-md rounded-2xl border border-white/10 p-8 text-center">
          <h1 className="font-display text-2xl text-[#FFD700]">Área restrita</h1>
          <p className="mt-3 text-sm text-[#C9BDAA]">
            {session
              ? "Esta conta não tem permissão de administração."
              : "Entre com a conta de administrador para publicar artigos."}
          </p>
          {session ? (
            <button
              className={`${btn} mt-6 bg-white/10 text-white`}
              onClick={() => supabase.auth.signOut()}
            >
              Sair
            </button>
          ) : (
            <Link
              to="/auth?next=%2Fadmin"
              className={`${btn} mt-6 inline-block bg-[#FFD700] text-[#0D0D0D]`}
            >
              Entrar
            </Link>
          )}
        </div>
      </main>
    );
  }

  async function savePost(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (editingId) await updatePost(editingId, form);
      else await createPost(form);
      toast({ title: editingId ? "Artigo atualizado" : "Artigo criado" });
      setForm(EMPTY_POST);
      setEditingId(null);
      await reload();
    } catch (err) {
      toast({
        title: "Erro ao salvar",
        description: (err as Error).message,
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  }

  function editPost(p: Post) {
    setEditingId(p.id);
    setForm({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      content: postBodyText(p),
      category_id: p.category_id,
      cover_image: p.cover_image,
      read_time: p.read_time,
      seo_title: p.seo_title,
      seo_description: p.seo_description,
      status: p.status === "published" ? "published" : "draft",
      featured: p.featured,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function removePost(p: Post) {
    if (!window.confirm(`Excluir o artigo “${p.title}”?`)) return;
    try {
      await deletePost(p.id);
      toast({ title: "Artigo excluído" });
      await reload();
    } catch (err) {
      toast({ title: "Erro ao excluir", description: (err as Error).message, variant: "destructive" });
    }
  }

  async function saveCategory(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (editingCat) await updateCategory(editingCat, catForm);
      else await createCategory(catForm);
      toast({ title: editingCat ? "Categoria atualizada" : "Categoria criada" });
      setCatForm({ name: "", slug: "", description: "" });
      setEditingCat(null);
      await reload();
    } catch (err) {
      toast({ title: "Erro ao salvar categoria", description: (err as Error).message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  }

  async function removeCategory(c: Category) {
    if (!window.confirm(`Excluir a categoria “${c.name}”?`)) return;
    try {
      await deleteCategory(c.id);
      toast({ title: "Categoria excluída" });
      await reload();
    } catch (err) {
      toast({ title: "Erro ao excluir", description: (err as Error).message, variant: "destructive" });
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-[#F0E6D2]">
      <Seo
        title="Administração editorial | Boxe de Cria"
        description="Área restrita de publicação."
        path="/admin"
        noindex
      />
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-display text-2xl uppercase tracking-wide text-[#FFD700]">
            Administração
          </h1>
          <button className={`${btn} bg-white/10 text-white`} onClick={() => supabase.auth.signOut()}>
            Sair
          </button>
        </div>

        {/* ---------- Artigo ---------- */}
        <form onSubmit={savePost} className="mt-8 space-y-3 rounded-2xl border border-white/10 p-5">
          <h2 className="font-display text-lg text-[#F0E6D2]">
            {editingId ? "Editar artigo" : "Novo artigo"}
          </h2>
          <input className={input} placeholder="Título" required value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input className={input} placeholder="Endereço (ex.: como-fazer-jab-no-boxe)" required value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <textarea className={input} rows={2} placeholder="Resumo" value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
          <textarea className={input} rows={12} placeholder="Texto do artigo (parágrafos separados por linha em branco)"
            value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          <div className="grid gap-3 sm:grid-cols-2">
            <select className={input} value={form.category_id ?? ""}
              onChange={(e) => setForm({ ...form, category_id: e.target.value || null })}>
              <option value="">Sem categoria</option>
              {cats.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <input className={input} placeholder="Tempo de leitura (ex.: 6 min)" value={form.read_time ?? ""}
              onChange={(e) => setForm({ ...form, read_time: e.target.value || null })} />
            <input className={input} placeholder="URL da imagem de capa" value={form.cover_image ?? ""}
              onChange={(e) => setForm({ ...form, cover_image: e.target.value || null })} />
            <select className={input} value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as "draft" | "published" })}>
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
            </select>
            <input className={input} placeholder="Título para busca (opcional)" value={form.seo_title ?? ""}
              onChange={(e) => setForm({ ...form, seo_title: e.target.value || null })} />
            <input className={input} placeholder="Descrição para busca (opcional)" value={form.seo_description ?? ""}
              onChange={(e) => setForm({ ...form, seo_description: e.target.value || null })} />
          </div>
          <label className="flex items-center gap-2 text-sm text-[#C9BDAA]">
            <input type="checkbox" checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            Destacar na home
          </label>
          <div className="flex gap-3">
            <button type="submit" disabled={busy} className={`${btn} bg-[#FFD700] text-[#0D0D0D]`}>
              {editingId ? "Salvar alterações" : "Criar artigo"}
            </button>
            {editingId && (
              <button type="button" className={`${btn} bg-white/10 text-white`}
                onClick={() => { setEditingId(null); setForm(EMPTY_POST); }}>
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* ---------- Lista de artigos ---------- */}
        <section className="mt-10">
          <h2 className="font-display text-lg text-[#F0E6D2]">Artigos ({posts.length})</h2>
          <ul className="mt-4 space-y-3">
            {posts.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 p-4">
                <div>
                  <p className="font-semibold">{p.title}</p>
                  <p className="text-xs text-[#C9BDAA]">
                    /{p.slug} · {p.status === "published" ? "publicado" : "rascunho"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className={`${btn} bg-white/10 text-white`} onClick={() => editPost(p)}>Editar</button>
                  <button className={`${btn} bg-[#8E1C1C] text-white`} onClick={() => removePost(p)}>Excluir</button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- Categorias ---------- */}
        <form onSubmit={saveCategory} className="mt-12 space-y-3 rounded-2xl border border-white/10 p-5">
          <h2 className="font-display text-lg text-[#F0E6D2]">
            {editingCat ? "Editar categoria" : "Nova categoria"}
          </h2>
          <input className={input} placeholder="Nome" required value={catForm.name}
            onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} />
          <input className={input} placeholder="Endereço (ex.: tecnica-e-treino)" required value={catForm.slug}
            onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })} />
          <textarea className={input} rows={2} placeholder="Descrição" value={catForm.description}
            onChange={(e) => setCatForm({ ...catForm, description: e.target.value })} />
          <div className="flex gap-3">
            <button type="submit" disabled={busy} className={`${btn} bg-[#FFD700] text-[#0D0D0D]`}>
              {editingCat ? "Salvar" : "Criar categoria"}
            </button>
            {editingCat && (
              <button type="button" className={`${btn} bg-white/10 text-white`}
                onClick={() => { setEditingCat(null); setCatForm({ name: "", slug: "", description: "" }); }}>
                Cancelar
              </button>
            )}
          </div>
        </form>

        <ul className="mt-4 space-y-3 pb-16">
          {cats.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 p-4">
              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-xs text-[#C9BDAA]">/{c.slug}</p>
              </div>
              <div className="flex gap-2">
                <button className={`${btn} bg-white/10 text-white`}
                  onClick={() => { setEditingCat(c.id); setCatForm({ name: c.name, slug: c.slug, description: c.description }); }}>
                  Editar
                </button>
                <button className={`${btn} bg-[#8E1C1C] text-white`} onClick={() => removeCategory(c)}>Excluir</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
