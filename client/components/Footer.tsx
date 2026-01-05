import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-dark-input/50 border-t border-neon-primary/10 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="font-orbitron font-black text-lg tracking-widest mb-2">
              <span className="bg-gradient-to-r from-neon-primary to-neon-secondary bg-clip-text text-transparent">
                ◇ DREAMS
              </span>
            </div>
            <p className="text-xs text-neon-secondary/70">
              Turn your dreams into digital monuments
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-orbitron text-sm font-bold text-neon-secondary mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-xs text-neon-secondary/70 hover:text-neon-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/gallery"
                  className="text-xs text-neon-secondary/70 hover:text-neon-primary transition-colors"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  to="/submit"
                  className="text-xs text-neon-secondary/70 hover:text-neon-primary transition-colors"
                >
                  Submit Wish
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-xs text-neon-secondary/70 hover:text-neon-primary transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-orbitron text-sm font-bold text-neon-secondary mb-4">
              Connect
            </h3>
            <div className="flex gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-neon-primary/30 flex items-center justify-center text-neon-primary hover:bg-neon-primary hover:text-dark-bg transition-all"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7a4.5 4.5 0 00-4.5-4.5z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/monumentsofdreams/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-neon-primary/30 flex items-center justify-center text-neon-primary hover:bg-neon-primary hover:text-dark-bg transition-all"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="18" cy="6" r="1" fill="currentColor" />
                </svg>
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-neon-primary/30 flex items-center justify-center text-neon-primary hover:bg-neon-primary hover:text-dark-bg transition-all"
                aria-label="Discord"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515a.074.074 0 00-.079.037c-.211.375-.445.864-.607 1.25a18.27 18.27 0 00-5.487 0c-.163-.39-.395-.875-.607-1.25a.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057a19.9 19.9 0 005.993 3.03a.08.08 0 00.087-.027c.461-.63.873-1.295 1.226-1.994a.076.076 0 00-.042-.106c-.637-.204-1.245-.455-1.823-.743a.077.077 0 01-.008-.128c.122-.092.245-.19.365-.281a.074.074 0 01.076-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.091.242.19.365.281a.077.077 0 01-.006.127c-.577.288-1.186.539-1.823.743a.077.077 0 00-.042.107c.352.699.764 1.365 1.226 1.994a.076.076 0 00.087.028a19.86 19.86 0 006.002-3.03a.077.077 0 00.032-.057c.5-4.761-.838-8.898-3.549-12.571a.061.061 0 00-.031-.028zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.974-2.419 2.157-2.419c1.183 0 2.157 1.086 2.157 2.419c0 1.334-.974 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.974-2.419 2.157-2.419c1.183 0 2.157 1.086 2.157 2.419c0 1.334-.974 2.419-2.157 2.419z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Legal & Information Pages */}
          <div>
            <h3 className="font-orbitron text-sm font-bold text-neon-secondary mb-4">
              Information
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/privacy"
                  className="text-xs text-neon-secondary/70 hover:text-neon-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-xs text-neon-secondary/70 hover:text-neon-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-xs text-neon-secondary/70 hover:text-neon-primary transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-xs text-neon-secondary/70 hover:text-neon-primary transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/support"
                  className="text-xs text-neon-secondary/70 hover:text-neon-primary transition-colors"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-neon-primary/10 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neon-secondary/50">
            <p>
              © 2025 Digital Monument of Dreams. All rights reserved.
            </p>
            <p>🔒 Payments secured by Stripe | Your wishes, your privacy</p>
          </div>
        </div>
      </div>
    </footer>
  );
}