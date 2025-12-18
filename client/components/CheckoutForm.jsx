import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/create-payment-intent",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 5000 })
      }
    );

    const { clientSecret } = await response.json();

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: "Cliente"
        }
      }
    });

    if (result.error) {
      alert(result.error.message);
    } else if (result.paymentIntent.status === "succeeded") {
      alert("Pagamento efetuado com sucesso!");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Pagamento</h2>
      <CardElement />
      <button disabled={!stripe || loading}>
        {loading ? "Processando..." : "Pagar"}
      </button>
    </form>
  );
}
