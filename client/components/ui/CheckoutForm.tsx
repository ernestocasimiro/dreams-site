import {
  useStripe,
  useElements,
  CardElement
} from "@stripe/react-stripe-js";
import { FormEvent, useState } from "react";

interface CheckoutFormProps {
  amount: number;
  productId?: string;
}

export default function CheckoutForm({
  amount,
  productId
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!stripe || !elements) {
      setErrorMessage("Stripe was not loaded.");
      return;
    }

    if (!name || !email) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setErrorMessage("Error loading card details.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/create-payment-intent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount,
            productId,
            email
          })
        }
      );

      if (!response.ok) {
        throw new Error("Error initiating payment.");
      }

      const { clientSecret } = await response.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name,
            email
          }
        }
      });

      if (result.error) {
        setErrorMessage(result.error.message || "Payment failed.");
        return;
      }

      if (result.paymentIntent?.status === "succeeded") {
        window.location.href = "/success";
      }
    } catch (err: any) {
      setErrorMessage(
        err.message || "Unexpected error during payment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 420,
        margin: "60px auto",
        padding: "30px",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        borderRadius: 12,
        color: "#fff",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        border: "1px solid rgba(255, 255, 255, 0.05)"
      }}
    >
      <h2 style={{ 
        marginBottom: 24, 
        textAlign: "center",
        fontSize: "24px",
        fontWeight: "600",
        color: "#f8fafc"
      }}>
        Complete Payment
      </h2>

      {/* Full Name */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ 
          display: "block", 
          marginBottom: 8,
          fontSize: "14px",
          fontWeight: "500",
          color: "#cbd5e1"
        }}>
          Full Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: 6,
            border: "1px solid #334155",
            backgroundColor: "#1e293b",
            color: "#f1f5f9",
            fontSize: "16px",
            transition: "all 0.2s",
            outline: "none"
          }}
          onFocus={(e) => e.target.style.borderColor = "#8b5cf6"}
          onBlur={(e) => e.target.style.borderColor = "#334155"}
        />
      </div>

      {/* Email */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ 
          display: "block", 
          marginBottom: 8,
          fontSize: "14px",
          fontWeight: "500",
          color: "#cbd5e1"
        }}>
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: 6,
            border: "1px solid #334155",
            backgroundColor: "#1e293b",
            color: "#f1f5f9",
            fontSize: "16px",
            transition: "all 0.2s",
            outline: "none"
          }}
          onFocus={(e) => e.target.style.borderColor = "#8b5cf6"}
          onBlur={(e) => e.target.style.borderColor = "#334155"}
        />
      </div>

      {/* Card Details */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ 
          display: "block", 
          marginBottom: 8,
          fontSize: "14px",
          fontWeight: "500",
          color: "#cbd5e1"
        }}>
          Card Details
        </label>
        <div
          style={{
            padding: "12px 16px",
            backgroundColor: "#1e293b",
            borderRadius: 6,
            border: "1px solid #334155",
            minHeight: 44,
            transition: "all 0.2s"
          }}
          id="card-element-container"
        >
          <CardElement
            options={{
              hidePostalCode: true,
              style: {
                base: {
                  fontSize: "16px",
                  color: "#f1f5f9",
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  "::placeholder": {
                    color: "#64748b"
                  },
                  ":-webkit-autofill": {
                    color: "#f1f5f9",
                    backgroundColor: "transparent"
                  }
                },
                invalid: {
                  color: "#ef4444",
                  iconColor: "#ef4444"
                }
              }
            }}
            onChange={(event) => {
              const container = document.getElementById('card-element-container');
              if (container) {
                if (event.error) {
                  container.style.borderColor = "#ef4444";
                } else {
                  // Changed from green (#22c55e) to purple (#8b5cf6) for valid state
                  container.style.borderColor = event.empty ? "#334155" : "#8b5cf6";
                }
              }
            }}
          />
        </div>
      </div>

      {errorMessage && (
        <div style={{ 
          padding: "12px 16px",
          marginBottom: 16,
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          color: "#fca5a5",
          borderRadius: 6,
          border: "1px solid rgba(239, 68, 68, 0.3)",
          fontSize: "14px"
        }}>
           {errorMessage}
        </div>
      )}

      {/* Order Summary - Changed to purple theme */}
      <div style={{
        padding: "20px",
        marginTop: "24px",
        marginBottom: "24px",
        backgroundColor: "rgba(30, 41, 59, 0.7)",
        borderRadius: 8,
        border: "1px solid rgba(139, 92, 246, 0.3)",
        backdropFilter: "blur(10px)"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
          color: "#cbd5e1"
        }}>
          <span>Total Amount:</span>
          <span style={{ 
            fontSize: "20px", 
            fontWeight: "600",
            color: "#f8fafc"
          }}>
            ${(amount / 100).toFixed(2)}
          </span>
        </div>
        <div style={{
          fontSize: "12px",
          color: "#94a3b8",
          textAlign: "center",
          marginTop: "12px"
        }}>
          Secure payment processed by Stripe
        </div>
      </div>

      {/* Pay Button */}
      <button
        type="submit"
        disabled={!stripe || loading}
        style={{
          width: "100%",
          padding: "16px",
          background: loading 
            ? "linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)" 
            : "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: loading ? "not-allowed" : "pointer",
          fontWeight: "600",
          fontSize: "16px",
          transition: "all 0.3s",
          boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)",
          position: "relative",
          overflow: "hidden"
        }}
        onMouseEnter={(e) => {
          if (!loading) {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(139, 92, 246, 0.4)";
          }
        }}
        onMouseLeave={(e) => {
          if (!loading) {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(139, 92, 246, 0.3)";
          }
        }}
      >
        {loading ? (
          <>
            <span style={{ marginRight: "8px" }}></span>
            Processing Payment...
          </>
        ) : (
          <>
            <span style={{ marginRight: "8px" }}></span>
            Pay ${(amount / 100).toFixed(2)}
          </>
        )}
      </button>

      {/* Security Footer */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "20px",
        paddingTop: "20px",
        borderTop: "1px solid #334155",
        fontSize: "12px",
        color: "#94a3b8",
        gap: "8px"
      }}>
        <span> 100% Secure Payment</span>
        <span style={{ color: "#475569" }}>•</span>
        <span> Encrypted Data</span>
      </div>
    </form>
  );
}