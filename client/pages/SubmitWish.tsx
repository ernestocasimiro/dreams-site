import { useState } from "react";
import supabase from "@/config/supabaseClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/* =========================
   BACKEND URL (BLINDADO)
========================= */
const RAW_BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "https://dreams-site.onrender.com";

// 🔒 Remove barra final se existir
const BACKEND_URL = RAW_BACKEND_URL.replace(/\/$/, "");

export default function SubmitWish() {
  const [wish, setWish] = useState("");
  const [author, setAuthor] = useState("");
  const [country, setCountry] = useState("");
  const [language, setLanguage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  /* =========================
     HELPERS
  ========================= */
  const addDebug = (msg: string) => {
    console.log(`🔍 ${msg}`);
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);
  };

  const clearDebug = () => setDebugInfo([]);

  const generateTitle = (description: string, authorName: string) => {
    if (!description.trim()) return `Dream from ${authorName}`;
    return description.split(/\s+/).slice(0, 4).join(" ") + "...";
  };

  /* =========================
     CREATE DREAM
  ========================= */
  const createDream = async (title: string): Promise<string> => {
    addDebug("Creating dream in database...");

    const { data, error } = await supabase
      .from("dreams")
      .insert([
        {
          title,
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

    if (error) {
      addDebug(`❌ DB error: ${error.message}`);
      throw new Error(error.message);
    }

    addDebug(`✅ Dream created with ID: ${data.id}`);
    return data.id;
  };

  /* =========================
     CREATE CHECKOUT SESSION
  ========================= */
  const createCheckoutSession = async (dreamId: string) => {
    addDebug("Creating Stripe checkout session...");
    addDebug(`POST → ${BACKEND_URL}/create-checkout-session`);

    const response = await fetch(
      `${BACKEND_URL}/create-checkout-session`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dreamId,
          author: author.trim(),
          country: country.trim(),
        }),
      }
    );

    const text = await response.text();
    addDebug(`Backend response: ${response.status}`);

    if (!response.ok) {
      addDebug(`❌ Raw error: ${text}`);
      throw new Error(`Payment error (${response.status})`);
    }

    const data = JSON.parse(text);

    if (!data.url) {
      throw new Error("Invalid checkout response");
    }

    addDebug(`✅ Checkout session created`);
    return data.url;
  };

  /* =========================
     SUBMIT HANDLER
  ========================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearDebug();
    setError("");
    setIsSubmitting(true);

    try {
      const title = generateTitle(wish, author);
      const dreamId = await createDream(title);
      const checkoutUrl = await createCheckoutSession(dreamId);

      addDebug("Redirecting to Stripe...");
      window.location.href = checkoutUrl;
    } catch (err: any) {
      addDebug("❌ SUBMISSION FAILED");
      addDebug(err.message);
      setError("Payment failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="min-h-screen bg-gradient-dark">
      <Header />

      <main className="pt-32 pb-20 px-4">
        <form onSubmit={handleSubmit} className="card-dark p-8 max-w-xl mx-auto">
          <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Name" required />
          <input value={country} onChange={e => setCountry(e.target.value)} placeholder="Country" required />
          <textarea value={wish} onChange={e => setWish(e.target.value)} minLength={10} required />

          {error && <p className="text-red-400">{error}</p>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Submit & Pay $1.00"}
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
