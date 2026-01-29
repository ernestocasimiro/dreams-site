import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import supabase from "@/config/supabaseClient";

type Dream = {
  id: string;
  description?: string | null;
  author?: string | null;
  likes?: number | null;
  views?: number | null;
  created_at?: string | null;
};

export default function Index() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [recentDreams, setRecentDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  useEffect(() => {
    async function fetchRecentDreams() {
      setLoading(true);
      const { data } = await supabase
        .from("dreams")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);
      setRecentDreams(data || []);
      setLoading(false);
    }
    fetchRecentDreams();
    const interval = setInterval(fetchRecentDreams, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 50 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1,
      vy: (Math.random() - 0.5) * 1,
      radius: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    const animate = () => {
      ctx.fillStyle = "rgba(15,15,31,.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.fillStyle = `rgba(127,90,240,${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(animate);
    };

    animate();
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-dark overflow-x-hidden">
      <Header />
      <canvas
        ref={canvasRef}
        className="fixed inset-0 opacity-20 pointer-events-none"
      />

      <main className="relative z-10 text-white">
        {/* HERO */}
        <section className="min-h-screen flex flex-col justify-center items-center px-6 text-center gap-6 pt-28">
          <h1 className="font-orbitron font-bold text-4xl sm:text-5xl md:text-6xl max-w-4xl">
            Dreams{" "}
            <span className="bg-gradient-to-r from-neon-primary to-neon-secondary bg-clip-text text-transparent">
              Are True
            </span>
          </h1>

          <p className="text-neon-secondary max-w-xl text-sm sm:text-lg">
            Monument of Dreams is a digital space where people from all over the
            world share their dreams and wishes — creating a collective monument
            of human aspirations.
          </p>

          <Link to="/submit" className="neon-button px-7 py-3 text-sm sm:text-lg">
            Submit My Wish – FREE
          </Link>
        </section>

        {/* MANIFESTO */}
        <section className="relative py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.04, y: -8 }}
              whileTap={{ scale: 0.97 }}
              animate={{
                boxShadow: [
                  "0 0 25px rgba(127,90,240,0.25)",
                  "0 0 45px rgba(127,90,240,0.45)",
                  "0 0 25px rgba(127,90,240,0.25)",
                ],
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 22,
                boxShadow: {
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              className="card-dark backdrop-blur-xl border border-neon-primary/30 rounded-3xl p-10 sm:p-16"
            >
              <h2 className="font-orbitron text-2xl sm:text-4xl text-center mb-8">
                A Monument Built From Dreams
              </h2>
              <p className="text-neon-secondary/90 text-center max-w-3xl mx-auto text-base sm:text-lg">
                Dreams have always been part of human history. Monument of Dreams
                exists to preserve them — not as fleeting thoughts, but as
                digital monuments of who we are and what we aspire to become.
              </p>
            </motion.div>
          </div>
        </section>

        {/* SEO EXPLORATION */}
        <section className="py-24 px-6">
          <h2 className="font-orbitron text-3xl sm:text-4xl text-center mb-14">
            Explore the Meaning of Dreams
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {/* ABOUT DREAMS */}
            <motion.div
              whileHover={{ y: -6, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="card-dark border border-neon-primary/20 rounded-3xl p-8 sm:p-10"
            >
              <h3 className="font-orbitron text-xl mb-3">
                Dreams About Dreams
              </h3>
              <p className="text-neon-secondary/80 mb-6">
                Discover why dreams matter, their role in human history, and
                how they shape identity and purpose.
              </p>
              <Link
                to="/dreams-about-dreams"
                className="text-neon-primary hover:underline"
              >
                Explore meaning →
              </Link>
            </motion.div>

            {/* DREAMS THAT COME TRUE */}
            <motion.div
              whileHover={{ y: -6, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="card-dark border border-neon-primary/20 rounded-3xl p-8 sm:p-10"
            >
              <h3 className="font-orbitron text-xl mb-3">
                Dreams That Come True
              </h3>
              <p className="text-neon-secondary/80 mb-6">
                Explore how belief, persistence, and shared dreams can transform
                quiet thoughts into reality.
              </p>
              <Link
                to="/dreams-that-come-true"
                className="text-neon-primary hover:underline"
              >
                Read stories →
              </Link>
            </motion.div>
          </div>
        </section>

        {/* RECENT DREAMS */}
        <section className="py-20 px-6 max-w-6xl mx-auto">
          <h2 className="font-orbitron text-3xl sm:text-4xl mb-4">
            Recent Dreams
          </h2>
          <p className="text-neon-secondary/70 mb-10">
            Latest wishes from around the world
          </p>

          {loading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentDreams.map((d) => (
                <Link
                  key={d.id}
                  to={`/dream/${d.id}`}
                  className="card-dark p-6 rounded-xl hover:shadow-glow-neon transition"
                >
                  <p className="text-neon-secondary line-clamp-4 mb-4">
                    "{d.description}"
                  </p>
                  <div className="flex justify-between text-xs text-neon-secondary/60 border-t border-neon-primary/20 pt-3">
                    <span>{d.author || "Anonymous"}</span>
                    <span>{formatDate(d.created_at)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
