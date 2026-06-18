import { Link } from "react-router-dom";

// Trust / Privacy / Security page — app-owned content, maintained by the site owner.
const Trust = () => {
  return (
    <main className="min-h-screen bg-background text-foreground py-12 px-4">
      <article className="max-w-3xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">Confiança, Privacidade e Segurança</h1>
          <p className="text-sm text-muted-foreground">
            Esta página é mantida pelo proprietário do site Regra na Mão para responder
            às dúvidas mais comuns sobre privacidade, segurança e tratamento de dados.
            Não é uma certificação independente.
          </p>
        </header>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Sobre o site</h2>
          <p>
            Regra na Mão é um site informativo que disponibiliza e-books digitais sobre
            regras de boxe e artes marciais. O checkout e o processamento de pagamento
            são feitos pela Hotmart, fora deste site.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Dados que coletamos</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Dados de navegação anônimos (páginas visitadas, origem do tráfego).</li>
            <li>
              Identificadores de campanhas (UTMs, fbclid, gclid) para entender de onde
              vieram as visitas.
            </li>
            <li>
              Eventos enviados ao Meta Pixel, Google Tag Manager e Google Analytics
              somente após o seu consentimento de cookies.
            </li>
          </ul>
          <p>
            Não coletamos nome, e-mail, CPF ou dados de pagamento neste site. Esses
            dados, quando aplicáveis, são coletados diretamente pela Hotmart no momento
            da compra, sob a Política de Privacidade dela.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Cookies e consentimento</h2>
          <p>
            Utilizamos um banner de consentimento (LGPD). Cookies de marketing e
            analytics só são carregados após você aceitar. Você pode limpar os cookies
            do navegador a qualquer momento para revogar o consentimento.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Serviços de terceiros (subprocessadores)</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Hotmart — checkout, pagamento e entrega do produto digital.</li>
            <li>Meta (Facebook) Pixel — mensuração de campanhas.</li>
            <li>Google Tag Manager e Google Analytics — análise de tráfego.</li>
            <li>Lovable Cloud — hospedagem do site.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Segurança</h2>
          <p>
            O site é servido via HTTPS. Não armazenamos senhas, dados de cartão ou
            informações pessoais sensíveis em nossa infraestrutura. Pagamentos são
            tratados integralmente pela Hotmart.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Seus direitos (LGPD)</h2>
          <p>
            Você pode solicitar acesso, correção ou exclusão de dados pessoais
            relacionados a você. Para solicitações sobre dados de compra, contate o
            suporte da Hotmart. Para solicitações relativas a este site, entre em
            contato pelo canal oficial divulgado na página inicial.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Contato</h2>
          <p>
            Dúvidas sobre privacidade ou segurança podem ser enviadas pelo canal de
            atendimento divulgado na página inicial.
          </p>
        </section>

        <footer className="pt-6 border-t">
          <Link to="/" className="text-sm underline">← Voltar para o início</Link>
        </footer>
      </article>
    </main>
  );
};

export default Trust;
