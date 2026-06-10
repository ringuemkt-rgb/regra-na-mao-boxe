import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import CookieConsent from "@/components/CookieConsent";
import { captureTrackingParams } from "@/lib/tracking";
import { trackPageView } from "@/lib/metaPixel";

const queryClient = new QueryClient();

// Captura UTMs/fbclid/gclid e dispara PageView em cada mudança de rota
const RouteTracker = () => {
  const location = useLocation();
  useEffect(() => {
    captureTrackingParams();
    // [Meta Pixel] PageView — disparado em TODAS as páginas (somente se já carregado pós-consent)
    trackPageView();
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
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <CookieConsent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
