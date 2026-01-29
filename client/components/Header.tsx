import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  // Fecha o dropdown ao mudar de rota
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed top-0 w-full z-50 bg-gradient-to-b from-dark-bg/95 to-dark-bg/50 backdrop-blur-sm border-b border-neon-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="group">
          <div className="font-orbitron font-black text-2xl tracking-wider group-hover:scale-110 transition-transform duration-300">
            <span className="bg-gradient-to-r from-neon-primary via-neon-secondary to-neon-primary bg-clip-text text-transparent drop-shadow-lg">
              ◇ DREAMS
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-4 sm:gap-8 relative">
          <Link
            to="/gallery"
            className={`font-exo2 text-sm sm:text-base transition-all duration-300 ${
              isActive("/gallery")
                ? "text-neon-primary"
                : "text-neon-secondary hover:text-neon-primary"
            }`}
          >
            Gallery
          </Link>

          <Link
            to="/submit"
            className={`font-exo2 text-sm sm:text-base transition-all duration-300 ${
              isActive("/submit")
                ? "text-neon-primary"
                : "text-neon-secondary hover:text-neon-primary"
            }`}
          >
            Submit Wish
          </Link>

          {/* DROPDOWN – EXPLORE DREAMS */}
          <div
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <button
              onClick={() => setOpen((v) => !v)}
              className={`font-exo2 text-sm sm:text-base transition-all duration-300 ${
                location.pathname.startsWith("/dreams-")
                  ? "text-neon-primary"
                  : "text-neon-secondary hover:text-neon-primary"
              }`}
            >
              Explore Dreams
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full mt-3 right-0 w-56 rounded-2xl bg-dark-bg/95 backdrop-blur-xl border border-neon-primary/20 shadow-glow-neon overflow-hidden"
                >
                  <Link
                    to="/dreams-about-dreams"
                    className="block px-5 py-3 text-sm text-neon-secondary hover:text-neon-primary hover:bg-neon-primary/5 transition"
                  >
                    About Dreams
                  </Link>

                  <Link
                    to="/dreams-that-come-true"
                    className="block px-5 py-3 text-sm text-neon-secondary hover:text-neon-primary hover:bg-neon-primary/5 transition"
                  >
                    Dreams That Come True
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CTA */}
          <Link to="/submit" className="hidden sm:inline neon-button text-sm">
            Submit – FREE
          </Link>
        </nav>
      </div>
    </header>
  );
}
