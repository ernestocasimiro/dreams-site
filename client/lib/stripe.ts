// src/lib/stripe.ts
import { loadStripe } from "@stripe/stripe-js";

// Sua chave pública do Stripe (começa com pk_)
// Armazene-a em uma variável de ambiente: VITE_STRIPE_PUBLISHABLE_KEY
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ""
);

export { stripePromise };