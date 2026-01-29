// client/src/pages/Success.tsx
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Success() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");
  const dreamId = searchParams.get("dream_id");

  useEffect(() => {
    // Aqui você pode verificar o pagamento com o backend
    if (sessionId) {
      console.log("Payment successful for session:", sessionId);
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Header />
      
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-900/20 border border-green-500 rounded-xl p-8 mb-8">
            <div className="text-green-400 text-6xl mb-4">✓</div>
            <h1 className="font-orbitron text-3xl font-bold text-white mb-4">
              Your Dream Is Now Part of the Monument
            </h1>
            <p className="text-neon-secondary mb-6">
              Thank you for your contribution. Your dream has been submitted to the gallery.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/gallery")}
              className="px-6 py-3 bg-neon-primary text-dark-bg font-bold rounded-lg"
            >
              View Gallery
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-dark-card border border-neon-primary text-neon-primary font-bold rounded-lg"
            >
              Back to Home
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}