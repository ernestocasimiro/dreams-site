import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SubmitWish() {
  const navigate = useNavigate();

  const [wish, setWish] = useState("");
  const [author, setAuthor] = useState("");
  const [country, setCountry] = useState("");
  const [language, setLanguage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  
  // Novo estado para controlar o modal de confirmação
  const [showConfirmation, setShowConfirmation] = useState(false);
  // Estado para armazenar os dados temporários antes da confirmação
  const [pendingDreamData, setPendingDreamData] = useState<{
    title: string;
    description: string;
    author: string;
    country: string;
    language: string | null;
  } | null>(null);

  // Funções para gerenciar erros personalizados
  const getErrorMessage = (field: string, value: string): string => {
    switch (field) {
      case "wish":
        if (!value.trim()) return " Your dream cannot be empty. The universe awaits your words.";
        if (value.trim().length < 10) return " Your dream needs at least 10 characters to shine brightly.";
        if (value.length > 1000) return " Your dream is too long (max 1000 characters).";
        return "";
      
      case "author":
        if (!value.trim()) return " Please share your name or a creative pseudonym.";
        if (value.length > 100) return " Name is too long (max 100 characters).";
        if (/[<>{}[\]\\]/.test(value)) return " Invalid characters in name.";
        return "";
      
      case "country":
        if (!value.trim()) return " Which corner of the world do you dream from?";
        if (value.length > 60) return " Country name is too long (max 60 characters).";
        return "";
      
      case "language":
        if (value.length > 50) return " Language name is too long (max 50 characters).";
        return "";
      
      default:
        return "";
    }
  };

  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Validar cada campo
    const wishError = getErrorMessage("wish", wish);
    const authorError = getErrorMessage("author", author);
    const countryError = getErrorMessage("country", country);
    const languageError = getErrorMessage("language", language);
    
    if (wishError) errors.push(wishError);
    if (authorError) errors.push(authorError);
    if (countryError) errors.push(countryError);
    if (languageError) errors.push(languageError);
    
    // Verificar se há conteúdo muito genérico no sonho
    if (wish.trim().length > 0) {
      const commonPhrases = ["I want", "I wish", "I hope", "test", "hello"];
      const hasCommonPhrase = commonPhrases.some(phrase => 
        wish.toLowerCase().includes(phrase.toLowerCase())
      );
      
      if (hasCommonPhrase && wish.trim().length < 50) {
        errors.push(" Make your dream more unique! Share specific details.");
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const generateTitle = (description: string, authorName: string): string => {
    if (!description.trim()) return `Dream from ${authorName}`;
    const words = description.trim().split(/\s+/);
    if (words.length <= 5) return description.slice(0, 60);
    return words.slice(0, 4).join(" ") + "...";
  };

  const addDebug = (message: string) => {
    console.log("🔍", message);
    setDebugInfo((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()} — ${message}`,
    ]);
  };

  const clearDebug = () => setDebugInfo([]);

  /* =========================
     SUBMIT HANDLER - PRIMEIRA FASE (VALIDAÇÃO)
  ========================== */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearDebug();
    setError("");

    // Validar formulário
    const validation = validateForm();
    
    if (!validation.isValid) {
      // Mostrar apenas o primeiro erro para não sobrecarregar o usuário
      setError(validation.errors[0]);
      
      // Para debug, mostra todos os erros
      if (import.meta.env.DEV) {
        validation.errors.forEach(err => addDebug(`Validation error: ${err}`));
      }
      return;
    }

    setIsSubmitting(true);
    
    try {
      const dreamTitle = generateTitle(wish, author);
      addDebug(`Generated title: ${dreamTitle}`);
      
      // Preparar dados do sonho para confirmação
      const dreamData = {
        title: dreamTitle,
        description: wish,
        author: author.trim(),
        country: country.trim(),
        language: language.trim() || null,
      };
      
      setPendingDreamData(dreamData);
      setShowConfirmation(true);
      
    } catch (err: any) {
      addDebug(`Error: ${err.message}`);
      setError(" An unexpected cosmic glitch occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================
     CONFIRMAÇÃO DO SONHO - SEGUNDA FASE
  ========================== */
  const handleConfirmSubmission = () => {
    if (!pendingDreamData) return;
    
    setIsSubmitting(true);
    addDebug("User confirmed submission, redirecting to payment...");
    
    // 🔑 REDIRECIONAMENTO PARA O CHECKOUT CUSTOMIZADO
    navigate("/checkout", {
      state: {
        amount: 100, // $1.00 → em centavos (ajuste se mudar moeda)
        productId: "dream_submission",
        dream: pendingDreamData,
      },
    });
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
    setPendingDreamData(null);
    addDebug("User canceled confirmation");
  };

  /* =========================
     RENDERIZAÇÃO DOS ERROS EM TEMPO REAL
  ========================== */
  const renderFieldError = (field: string, value: string) => {
    const error = getErrorMessage(field, value);
    if (!error) return null;
    
    return (
      <div className="mt-1 text-xs text-red-400 animate-pulse">
         {error}
      </div>
    );
  };

  /* =========================
     UI
  ========================== */
  return (
    <div className="min-h-screen bg-gradient-dark">
      <Header />

      {/* MODAL DE CONFIRMAÇÃO */}
      {showConfirmation && pendingDreamData && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="card-dark p-8 rounded-xl max-w-md w-full border border-neon-pink/30 animate-slideUp">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4"></div>
              <h2 className="font-orbitron text-2xl text-white mb-2">
                Final Check Before Launch
              </h2>
              <p className="text-neon-secondary">
                Please review your dream carefully
              </p>
            </div>

            <div className="mb-6 p-4 bg-black/30 rounded-lg border border-neon-blue/20">
              <div className="space-y-3">
                <div>
                  <span className="text-neon-secondary text-sm">From:</span>
                  <p className="text-white">{pendingDreamData.author}</p>
                </div>
                <div>
                  <span className="text-neon-secondary text-sm">Country:</span>
                  <p className="text-white">{pendingDreamData.country}</p>
                </div>
                {pendingDreamData.language && (
                  <div>
                    <span className="text-neon-secondary text-sm">Language:</span>
                    <p className="text-white">{pendingDreamData.language}</p>
                  </div>
                )}
                <div>
                  <span className="text-neon-secondary text-sm">Your Dream:</span>
                  <p className="text-white mt-1 italic line-clamp-4">
                    "{pendingDreamData.description.slice(0, 200)}..."
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
              <div className="flex items-start">
                <span className="text-yellow-400 mr-2">⚠️</span>
                <div className="text-sm text-yellow-300">
                  <strong>Important:</strong> If you go back from the payment screen, 
                  <span className="font-bold text-white"> all entered data will be lost</span>. 
                  Make sure everything is correct!
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleCancelConfirmation}
                className="flex-1 py-3 border border-neon-secondary/30 text-neon-secondary rounded-lg hover:bg-neon-secondary/10 transition"
              >
                Review Again
              </button>
              <button
                onClick={handleConfirmSubmission}
                disabled={isSubmitting}
                className="flex-1 py-3 neon-button hover:shadow-glow-neon disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Launching..." : "Yes, Proceed to Payment"}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="pt-32 pb-20 px-4 sm:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="font-orbitron text-4xl sm:text-5xl font-bold text-white mb-4">
              Submit Your Dream
            </h1>
            <p className="text-neon-secondary">
              Share your wish and make it eternal
            </p>
            
            {/* AVISO GERAL NO TOPO */}
            <div className="mt-6 max-w-lg mx-auto p-4 bg-blue-900/20 border border-neon-blue/30 rounded-lg">
              <div className="flex items-center text-sm text-neon-blue">
                <span className="mr-2">💡</span>
                <span>
                  <strong>Tip:</strong> Review your dream before proceeding. 
                  Data cannot be recovered if you leave the payment page.
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="card-dark p-8 rounded-xl">
            {/* CAMPO NOME */}
            <div className="mb-6">
              <label className="block text-sm text-neon-secondary mb-2">
                Name or Pseudonym *
              </label>
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                disabled={isSubmitting}
                className="input-dark w-full p-4 rounded-lg"
                placeholder="How should we call you?"
                required
              />
              {renderFieldError("author", author)}
            </div>

            {/* CAMPO PAÍS */}
            <div className="mb-6">
              <label className="block text-sm text-neon-secondary mb-2">
                Country *
              </label>
              <input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                disabled={isSubmitting}
                className="input-dark w-full p-4 rounded-lg"
                placeholder="Where are you dreaming from?"
                required
              />
              {renderFieldError("country", country)}
            </div>

            {/* CAMPO IDIOMA */}
            <div className="mb-6">
              <label className="block text-sm text-neon-secondary mb-2">
                Language (optional)
              </label>
              <input
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={isSubmitting}
                className="input-dark w-full p-4 rounded-lg"
                placeholder="In which language do you dream?"
              />
              {renderFieldError("language", language)}
            </div>

            {/* CAMPO SONHO */}
            <div className="mb-6">
              <label className="block text-sm text-neon-secondary mb-2">
                Your Dream *
              </label>
              <textarea
                rows={6}
                value={wish}
                onChange={(e) => setWish(e.target.value)}
                disabled={isSubmitting}
                minLength={10}
                maxLength={1000}
                className="input-dark w-full p-4 rounded-lg resize-none"
                placeholder="Describe your dream in detail. What makes it special? What do you hope for?"
                required
              />
              <div className="flex justify-between mt-1">
                <div className="text-xs text-neon-secondary/60">
                  {wish.length}/1000 characters
                </div>
                {wish.length > 0 && wish.length < 10 && (
                  <div className="text-xs text-red-400 animate-pulse">
                    Need {10 - wish.length} more characters
                  </div>
                )}
              </div>
              {renderFieldError("wish", wish)}
            </div>

            {/* MENSAGEM DE ERRO PRINCIPAL */}
            {error && (
              <div className="mb-6 p-4 border border-red-500/40 bg-red-900/20 rounded-lg animate-shake">
                <div className="flex items-center">
                  <span className="text-red-400 mr-2">❌</span>
                  <span className="text-red-300">{error}</span>
                </div>
              </div>
            )}

            {/* BOTÃO DE ENVIO */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 font-bold rounded-lg transition-all ${
                isSubmitting
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "neon-button hover:shadow-glow-neon hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin mr-2">⟳</span>
                  Validating your dream...
                </span>
              ) : (
                "Submit & Pay $1.00"
              )}
            </button>

            {/* AVISO NO RODAPÉ DO FORMULÁRIO */}
            <div className="mt-6 pt-4 border-t border-neon-secondary/20">
              <div className="flex items-start text-xs text-neon-secondary/70">
                <span className="mr-2 mt-0.5">🔒</span>
                <span>
                  <strong>Remember:</strong> After clicking submit, you'll have one chance to complete the payment. 
                  Returning will reset the form. Make sure your dream is perfect!
                </span>
              </div>
            </div>
          </form>

          {/* DEBUG INFO (APENAS DESENVOLVIMENTO) */}
          {import.meta.env.DEV && debugInfo.length > 0 && (
            <div className="mt-8 p-4 bg-black/50 rounded-lg border border-neon-pink/20">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-neon-pink">Debug Console</span>
                <button
                  onClick={clearDebug}
                  className="text-xs text-neon-secondary hover:text-white"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {debugInfo.map((d, i) => (
                  <div key={i} className="text-xs text-neon-secondary/70 font-mono">
                    {d}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}