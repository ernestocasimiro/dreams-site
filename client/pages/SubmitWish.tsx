import { useState } from "react";
import supabase from "@/config/supabaseClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { loadStripe } from "@stripe/stripe-js";

// ⚡ Inicializa o Stripe (ainda necessário para outras funcionalidades)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

// URL do backend
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://dreams-site.onrender.com";

export default function SubmitWish() {
  const [wish, setWish] = useState("");
  const [author, setAuthor] = useState("");
  const [country, setCountry] = useState("");
  const [language, setLanguage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  // Função para gerar título automático
  const generateTitle = (description: string, authorName: string): string => {
    if (!description.trim()) return `Dream from ${authorName}`;
    
    const words = description.trim().split(/\s+/);
    if (words.length <= 5) {
      return description.length > 50 
        ? `${description.substring(0, 50)}...` 
        : description;
    }
    
    const shortTitle = words.slice(0, 4).join(' ') + '...';
    return shortTitle;
  };

  // Adiciona mensagem de debug
  const addDebug = (message: string) => {
    console.log(`🔍 ${message}`);
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Limpa debug info
  const clearDebug = () => setDebugInfo([]);

  // Função para criar sonho no Supabase
  const createDream = async (dreamTitle: string): Promise<string> => {
    try {
      addDebug("Creating dream in database...");
      
      const { data: dreamData, error: dreamError } = await supabase
        .from("dreams")
        .insert([
          {
            title: dreamTitle,
            description: wish,
            author: author.trim(),
            country: country.trim(),
            language: language.trim() || null,
            likes: 0,
            views: 0,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (dreamError) {
        addDebug(`❌ Database error: ${dreamError.message}`);
        throw new Error(`Database error: ${dreamError.message}`);
      }

      addDebug(`✅ Dream created with ID: ${dreamData.id}`);
      return dreamData.id;
    } catch (error: any) {
      addDebug(`❌ Failed to create dream: ${error.message}`);
      throw error;
    }
  };

  // Função para criar sessão de checkout
  const createCheckoutSession = async (dreamId: string): Promise<{sessionId: string, url: string}> => {
    try {
      addDebug("Creating Stripe checkout session...");
      
      const response = await fetch(`${BACKEND_URL}/create-checkout-session`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ 
          amount: 100,
          currency: "usd",
          dreamId,
          author: author.trim(),
          country: country.trim(),
          language: language.trim() || null,
        }),
      });

      const responseText = await response.text();
      addDebug(`Backend response: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        let errorMessage = `Payment error (${response.status}): ${response.statusText}`;
        
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = `Payment error: ${errorData.error || errorData.message || responseText}`;
        } catch {
          addDebug(`Raw error response: ${responseText}`);
        }
        
        throw new Error(errorMessage);
      }

      try {
        const data = JSON.parse(responseText);
        
        if (!data.sessionId || !data.url) {
          addDebug(`❌ Invalid response: Missing sessionId or url`);
          throw new Error("Invalid response from payment server");
        }

        addDebug(`✅ Checkout session created: ${data.sessionId}`);
        addDebug(`Redirect URL: ${data.url?.substring(0, 50)}...`);
        
        return {
          sessionId: data.sessionId,
          url: data.url
        };
      } catch (parseError) {
        addDebug(`❌ Failed to parse response: ${parseError}`);
        throw new Error("Invalid response format from payment server");
      }
    } catch (error: any) {
      addDebug(`❌ Failed to create checkout session: ${error.message}`);
      throw error;
    }
  };

  // NOVA FUNÇÃO: Redirecionamento para Stripe (versão atualizada)
  const redirectToStripeCheckout = async (checkoutUrl: string): Promise<void> => {
    try {
      addDebug("Redirecting to Stripe checkout...");
      
      if (!checkoutUrl) {
        throw new Error("No checkout URL available");
      }
      
      addDebug(`Checkout URL: ${checkoutUrl.substring(0, 60)}...`);
      
      // Método SIMPLES e FUNCIONAL: Redirecionamento direto
      window.location.href = checkoutUrl;
      
      // O redirecionamento acontece aqui, o código abaixo não será executado
      addDebug("✅ Redirect initiated");
      
    } catch (error: any) {
      addDebug(`❌ Redirect error: ${error.message}`);
      throw error;
    }
  };

  // Função principal de submissão
  const handlePaymentAndSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Limpa estados anteriores
    clearDebug();
    setError("");

    // VALIDAÇÕES  
    if (!wish.trim()) {
      setError("Please write your dream");
      return;
    }
    
    if (wish.trim().length < 10) {
      setError("Your dream should be at least 10 characters");
      return;
    }
    
    if (!author.trim()) {
      setError("Please write your name or pseudonym");
      return;
    }
    
    if (!country.trim()) {
      setError("Please write your country");
      return;
    }

    setIsSubmitting(true);  
    addDebug("=== Starting submission process ===");
    addDebug(`Frontend origin: ${window.location.origin}`);
    addDebug(`Backend URL: ${BACKEND_URL}`);

    try {
      // 1. Gerar título automático
      const dreamTitle = generateTitle(wish, author);
      addDebug(`Generated title: "${dreamTitle}"`);
      addDebug(`Author: ${author}, Country: ${country}, Language: ${language || 'Not specified'}`);

      // 2. Criar sonho no banco de dados
      addDebug("--- Creating dream in database ---");
      const dreamId = await createDream(dreamTitle);

      // 3. Criar sessão de checkout
      addDebug("--- Creating payment session ---");
      const { sessionId, url } = await createCheckoutSession(dreamId);

      // 4. Redirecionar para o Stripe (MÉTODO ATUALIZADO)
      addDebug("--- Redirecting to payment ---");
      await redirectToStripeCheckout(url);

      // Se chegou aqui, o redirecionamento falhou silenciosamente
      addDebug("⚠️ Redirect didn't happen as expected");
      
    } catch (err: any) {
      // Tratamento detalhado de erros
      addDebug(`❌❌❌ SUBMISSION FAILED ❌❌❌`);
      addDebug(`Error: ${err.message}`);
      
      let userFriendlyError = "Something went wrong. Please try again.";
      
      // Erros de Stripe específicos
      if (err.message.includes('redirectToCheckout') || 
          err.message.includes('Stripe.js')) {
        userFriendlyError = `
          Payment system update required. Please:
          1. Refresh the page and try again
          2. The payment link should open automatically
          3. If not, please copy this URL and open manually:
             ${window.location.origin}/retry-payment
        `;
      }
      
      // Erros de rede
      else if (err.message.includes('Failed to fetch') || 
               err.message.includes('NetworkError')) {
        userFriendlyError = "Network error. Please check your connection and try again.";
      }
      
      setError(userFriendlyError.trim());
      setIsSubmitting(false);
    }
  };

  // Função alternativa: Redirecionamento manual (fallback)
  const redirectManually = (url: string) => {
    if (url) {
      window.open(url, '_blank');
      return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Header />

      <main className="pt-32 pb-20 px-4 sm:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="font-orbitron text-4xl sm:text-5xl font-bold text-white mb-4">
              Submit Your Dream
            </h1>
            <p className="text-neon-secondary font-exo2 mb-4">
              Share your wish with the world and inspire others
            </p>
            
          </div>

          {/* FORM */}
          <form onSubmit={handlePaymentAndSubmit} className="card-dark p-8 rounded-lg">
            <div className="mb-6">
              <label className="block text-sm font-exo2 text-neon-secondary mb-2">
                Name or Pseudonym *
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. StarWalker, Emilia, Luna..."
                className="input-dark w-full p-4 rounded-lg font-exo2 focus:ring-2 focus:ring-neon-primary/50 disabled:opacity-50"
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-exo2 text-neon-secondary mb-2">
                Country *
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. USA, Brazil, China…"
                className="input-dark w-full p-4 rounded-lg font-exo2 focus:ring-2 focus:ring-neon-primary/50 disabled:opacity-50"
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-exo2 text-neon-secondary mb-2">
                Language (optional)
              </label>
              <input
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="e.g. Portuguese, English, Spanish..."
                className="input-dark w-full p-4 rounded-lg font-exo2 focus:ring-2 focus:ring-neon-primary/50 disabled:opacity-50"
                disabled={isSubmitting}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="wish" className="block text-sm font-exo2 text-neon-secondary mb-2">
                Your Dream * (min. 10 characters)
              </label>
              <textarea
                id="wish"
                value={wish}
                onChange={(e) => setWish(e.target.value)}
                placeholder="Write your dream or wish here..."
                rows={6}
                minLength={10}
                maxLength={1000}
                className="input-dark w-full p-4 rounded-lg font-exo2 resize-none focus:ring-2 focus:ring-neon-primary/50 disabled:opacity-50"
                disabled={isSubmitting}
                required
              />
              <div className="flex justify-between mt-2">
                <p className="text-xs text-neon-secondary/50">
                  {wish.length}/1000 characters
                </p>
                {wish.length > 0 && wish.length < 10 && (
                  <p className="text-xs text-red-400">
                    Needs {10 - wish.length} more characters
                  </p>
                )}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-red-400 font-exo2 font-semibold mb-1">Notice</p>
                    <div className="text-red-300 text-sm whitespace-pre-line">{error}</div>
                    {error.includes('payment link') && (
                      <button
                        onClick={() => window.open('https://dashboard.stripe.com/test/payments', '_blank')}
                        className="mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                      >
                        Open Stripe Dashboard
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

          

            {/* Submit Button */}
            <div className="space-y-4">
              <button
                type="submit"
                disabled={isSubmitting || wish.length < 10 || !author.trim() || !country.trim()}
                className={`
                  w-full py-4 font-bold uppercase tracking-wide transition-all 
                  flex items-center justify-center gap-2
                  ${isSubmitting || wish.length < 10 || !author.trim() || !country.trim()
                    ? "opacity-50 cursor-not-allowed bg-gray-600 text-gray-300"
                    : "neon-button hover:shadow-glow-neon"
                  }
                `}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Submit & Pay $1.00"
                )}
              </button>

              <div className="text-center">
                <p className="text-xs text-neon-secondary/70">
                  You'll be redirected to Stripe for secure payment
                </p>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}