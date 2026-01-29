import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-dark-input/50 border-t border-neon-primary/10 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div>
            <div className="font-orbitron font-black text-lg tracking-widest mb-3">
              <span className="bg-gradient-to-r from-neon-primary to-neon-secondary bg-clip-text text-transparent">
                ◇ DREAMS
              </span>
            </div>
            <p className="text-sm text-neon-secondary/70 leading-relaxed">
              Monument of Dreams is a digital space dedicated to preserving
              human aspirations as timeless digital monuments.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-orbitron text-sm font-bold text-neon-secondary mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/gallery" className="footer-link">Gallery</Link></li>
              <li><Link to="/submit" className="footer-link">Submit Wish</Link></li>
            </ul>
          </div>

          {/* EDITORIAL – EXPLORE DREAMS */}
          <div>
            <h3 className="font-orbitron text-sm font-bold text-neon-secondary mb-4">
              Explore Dreams
            </h3>

            <p className="text-sm text-neon-secondary/70 mb-4 leading-relaxed">
              Discover the meaning behind dreams and how they shape identity,
              purpose, and transformation.
            </p>

            <ul className="space-y-3">
              <li>
                <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/dreams-about-dreams"
                    className="text-sm text-neon-secondary hover:text-neon-primary transition"
                  >
                    About Dreams →
                  </Link>
                </motion.div>
              </li>

              <li>
                <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/dreams-that-come-true"
                    className="text-sm text-neon-secondary hover:text-neon-primary transition"
                  >
                    Dreams That Come True →
                  </Link>
                </motion.div>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="font-orbitron text-sm font-bold text-neon-secondary mb-4">
              Information
            </h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
              <li><Link to="/terms" className="footer-link">Terms of Service</Link></li>
              <li><Link to="/contact" className="footer-link">Contact Us</Link></li>
              <li><Link to="/faq" className="footer-link">FAQ</Link></li>
              <li><Link to="/support" className="footer-link">Support</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-neon-primary/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neon-secondary/50">
          <p>© 2026 Digital Monument of Dreams. All rights reserved.</p>
          {/* <p>🔒 Payments secured by Stripe · Your wishes, your privacy</p> */}
        </div>
      </div>
    </footer>
  );
}
