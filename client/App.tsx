// App.tsx - VERSÃO CORRIGIDA
import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Gallery from "./pages/Gallery";
import SubmitWish from "./pages/SubmitWish";
import About from "./pages/About";
import supabase from './config/supabaseClient.js' 
import Success from "./pages/Success.js";
import NotFound from "./pages/NotFound.js";
import { Cancel } from "@radix-ui/react-alert-dialog";
import DreamPage from "./pages/DreamPage";
import Contact from "./pages/Contact.js";
import Privacy from "./pages/Privacy.js";
import Terms from "./pages/Terms.js";
import FAQ from "./pages/FAQ.js";
import Support from "./pages/Support.js";
import Checkout from "./pages/Checkout";
import DreamsAboutDreams from "./pages/DreamsAboutDreams.js";
import DreamsThatComeTrue from "./pages/DreamsThatComeTrue.js";

// Teste de conexão removido ou ajustado
async function testConnection() {
  try {
    // A tabela '_test' provavelmente não existe. Vamos testar de forma diferente
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.log('Erro de conexão com Supabase:', error.message);
    } else {
      console.log('✅ Conexão com Supabase estabelecida com sucesso!');
      console.log('Sessão atual:', data.session ? 'Usuário logado' : 'Sem sessão');
    }
  } catch (err: any) {
    console.log('❌ Erro fatal na conexão:', err.message);
  }
}

// Executa o teste apenas em desenvolvimento
if (import.meta.env.DEV) {
  testConnection();
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/submit" element={<SubmitWish />} />
          <Route path="/about" element={<About />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/support" element={<Support />} />
          <Route path="/dream/:id" element={<DreamPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/dreams-about-dreams" element={<DreamsAboutDreams />} />
          <Route path="/dreams-that-come-true" element={<DreamsThatComeTrue />} 
        />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
export default App;
