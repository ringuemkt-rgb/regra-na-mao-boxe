import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const setMeta = (selector: string, attr: string, value: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    const [, key, name] = selector.match(/\[(.+?)="(.+?)"\]/) || [];
    if (key && name) el.setAttribute(key, name);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
};

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);

    const prevTitle = document.title;
    document.title = "Página Não Encontrada (404) | Boxe de Cria";
    const desc = "A página que você procura não existe. Volte ao início e conheça os manuais oficiais de boxe da Boxe de Cria.";
    setMeta('meta[name="description"]', "content", desc);
    setMeta('meta[property="og:title"]', "content", "Página Não Encontrada | Boxe de Cria");
    setMeta('meta[property="og:description"]', "content", desc);
    setMeta('meta[property="og:url"]', "content", `https://regra-na-mao-boxe.lovable.app${location.pathname}`);
    setMeta('meta[name="robots"]', "content", "noindex, follow");

    return () => {
      document.title = prevTitle;
      const robots = document.head.querySelector('meta[name="robots"]');
      if (robots) robots.remove();
    };
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
