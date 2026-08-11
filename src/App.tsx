import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Trust from "./pages/Trust.tsx";
import CookieConsent from "@/components/CookieConsent";
import AdSenseScript from "@/components/ads/AdSenseScript";
import "@/components/ads/adsense.css";
import { captureTrackingParams } from "@/lib/tracking";
import { trackPageView } from "@/lib/metaPixel";
import { ArticlePage, ArticlesPage, CategoryPage, HomePage, ProductsPage } from "@/pages/Portal";
import { AboutPage, AffiliatesPage, ContactPage, EditorialPolicyPage, PrivacyPage, Simple404, TermsPage } from "@/pages/Institutional";
import { ScoutDossierPage, ScoutHomePage } from "@/features/scout/pages";

const queryClient = new QueryClient();

const RouteTracker = () => {
  const location = useLocation();
  useEffect(() => {
    captureTrackingParams();
    trackPageView();
    const w = window as any;
    if (w.gtag) {
      w.gtag("event", "page_view", {
        page_path: `${location.pathname}${location.search}`,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname, location.search]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RouteTracker />
        <AdSenseScript />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/artigos" element={<ArticlesPage />} />
          <Route path="/artigos/:slug" element={<ArticlePage />} />
          <Route path="/categoria/:slug" element={<CategoryPage />} />
          <Route path="/produtos" element={<ProductsPage />} />
          <Route path="/sobre" element={<AboutPage />} />
          <Route path="/politica-editorial" element={<EditorialPolicyPage />} />
          <Route path="/afiliados" element={<AffiliatesPage />} />
          <Route path="/privacidade" element={<PrivacyPage />} />
          <Route path="/termos" element={<TermsPage />} />
          <Route path="/contato" element={<ContactPage />} />
          <Route path="/confianca" element={<Trust />} />
          <Route path="/scout" element={<ScoutHomePage />} />
          <Route path="/scout/atleta/:slug" element={<ScoutDossierPage />} />
          <Route path="*" element={<Simple404 />} />
        </Routes>
        <CookieConsent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
