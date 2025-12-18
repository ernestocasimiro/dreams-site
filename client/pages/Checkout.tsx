import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../lib/stripe";
import CheckoutForm from "../components/CheckoutForm";


export default function Checkout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
