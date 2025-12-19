import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";

export default function CheckoutForm({ amount, productId }) {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Criar PaymentIntent no backend
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/create-payment-intent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount,
            productId
          })
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao iniciar pagamento");
      }

      const { clientSecret } = await response.json();

      // 2️⃣ Confirmar pagamento com Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: "Cliente"
          }
        }
      });

      if (result.error) {
        setErrorMessage(result.error.message);
        return;
      }

      if (
        result.paymentIntent &&
        result.paymentIntent.status === "succeeded"
      ) {
        // Redirecionamento pós-pagamento
        window.location.href = "/success";
        return;
      }
    } catch (error) {
      setErrorMessage(error.message || "Erro inesperado no pagamento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Pagamento</h2>

      <CardElement />

      {errorMessage && (
        <p style={{ color: "red", marginTop: "8px" }}>
          {errorMessage}
        </p>
      )}

      <button type="submit" disabled={!stripe || loading}>
        {loading ? "Processando..." : `Pagar ${(amount / 100).toFixed(2)}`}
      </button>
    </form>
  );
}
