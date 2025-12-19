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
     SUBMIT HANDLER
  ========================== */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearDebug();
    setError("");

    if (wish.trim().length < 10) {
      setError("Your dream must have at least 10 characters.");
      return;
    }

    if (!author.trim()) {
      setError("Please enter your name or pseudonym.");
      return;
    }

    if (!country.trim()) {
      setError("Please enter your country.");
      return;
    }

    setIsSubmitting(true);

    try {
      const dreamTitle = generateTitle(wish, author);
      addDebug(`Generated title: ${dreamTitle}`);

      // 🔑 REDIRECIONAMENTO PARA O CHECKOUT CUSTOMIZADO
      navigate("/checkout", {
        state: {
          amount: 100, // $1.00 → em centavos (ajuste se mudar moeda)
          productId: "dream_submission",
          dream: {
            title: dreamTitle,
            description: wish,
            author: author.trim(),
            country: country.trim(),
            language: language.trim() || null,
          },
        },
      });
    } catch (err: any) {
      addDebug(`Error: ${err.message}`);
      setError("Unexpected error. Please try again.");
      setIsSubmitting(false);
    }
  };

  /* =========================
     UI
  ========================== */
  return (
    <div className="min-h-screen bg-gradient-dark">
      <Header />

      <main className="pt-32 pb-20 px-4 sm:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="font-orbitron text-4xl sm:text-5xl font-bold text-white mb-4">
              Submit Your Dream
            </h1>
            <p className="text-neon-secondary">
              Share your wish and make it eternal
            </p>
          </div>

          <form onSubmit={handleSubmit} className="card-dark p-8 rounded-xl">
            <div className="mb-6">
              <label className="block text-sm text-neon-secondary mb-2">
                Name or Pseudonym *
              </label>
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                disabled={isSubmitting}
                className="input-dark w-full p-4 rounded-lg"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm text-neon-secondary mb-2">
                Country *
              </label>
              <input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                disabled={isSubmitting}
                className="input-dark w-full p-4 rounded-lg"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm text-neon-secondary mb-2">
                Language (optional)
              </label>
              <input
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={isSubmitting}
                className="input-dark w-full p-4 rounded-lg"
              />
            </div>

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
                required
              />
              <p className="text-xs text-neon-secondary/60 mt-1">
                {wish.length}/1000 characters
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 border border-red-500/40 bg-red-500/10 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 font-bold transition ${
                isSubmitting
                  ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                  : "neon-button hover:shadow-glow-neon"
              }`}
            >
              {isSubmitting ? "Redirecting to payment..." : "Submit & Pay $1.00"}
            </button>
          </form>

          {import.meta.env.DEV && debugInfo.length > 0 && (
            <div className="mt-8 text-xs text-neon-secondary/70 space-y-1">
              {debugInfo.map((d, i) => (
                <div key={i}>{d}</div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
