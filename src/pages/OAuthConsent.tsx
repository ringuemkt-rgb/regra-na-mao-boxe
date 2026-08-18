import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<{ data: any; error: any }>;
  approveAuthorization: (id: string) => Promise<{ data: any; error: any }>;
  denyAuthorization: (id: string) => Promise<{ data: any; error: any }>;
};

const oauth = () => (supabase.auth as unknown as { oauth: OAuthApi }).oauth;

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Requisição inválida: authorization_id ausente.");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/auth?next=" + encodeURIComponent(next);
        return;
      }
      const { data, error } = await oauth().getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (error) {
        setError(error.message);
        return;
      }
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const api = oauth();
    const { data, error } = approve
      ? await api.approveAuthorization(authorizationId)
      : await api.denyAuthorization(authorizationId);
    if (error) {
      setBusy(false);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("O servidor de autorização não retornou um destino de redirecionamento.");
      return;
    }
    window.location.href = target;
  }

  const clientName = details?.client?.name ?? "o aplicativo";

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl">
        {error ? (
          <>
            <h1 className="font-display text-xl uppercase tracking-wide text-destructive">
              Não foi possível concluir
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">{error}</p>
            <a href="/" className="mt-6 inline-block text-xs uppercase tracking-widest underline underline-offset-4">
              Voltar ao site
            </a>
          </>
        ) : !details ? (
          <p className="text-sm text-muted-foreground">Carregando pedido de autorização…</p>
        ) : (
          <>
            <h1 className="font-display text-2xl uppercase tracking-wide text-primary">
              Conectar {clientName}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              {clientName} poderá usar as ferramentas do Boxe de Cria em seu nome, com as mesmas
              permissões da sua conta. Você pode revogar o acesso a qualquer momento.
            </p>
            <div className="mt-8 flex gap-3">
              <button
                disabled={busy}
                onClick={() => decide(true)}
                className="flex-1 rounded-lg bg-primary px-4 py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
              >
                Aprovar
              </button>
              <button
                disabled={busy}
                onClick={() => decide(false)}
                className="flex-1 rounded-lg border border-border bg-secondary px-4 py-3 text-sm font-semibold text-secondary-foreground transition hover:opacity-90 disabled:opacity-50"
              >
                Recusar
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
