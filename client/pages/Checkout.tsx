import { Elements } from "@stripe/react-stripe-js";
import { useLocation, Navigate } from "react-router-dom";

import { stripePromise } from "@/lib/stripe";
import CheckoutForm from "@/components/ui/CheckoutForm";

interface CheckoutState {
  amount: number;
  productId?: string;
}

export default function Checkout() {
  const location = useLocation();
  const state = location.state as CheckoutState | null;

  // Proteção básica: impede acesso direto à rota
  if (!state || !state.amount) {
    return <Navigate to="/" replace />;
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        amount={state.amount}
        productId={state.productId}
      />
    </Elements>
  );
}
