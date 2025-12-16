require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");

const app = express();
const PORT = process.env.PORT || 3001;

/* =======================
   STRIPE CONFIG
======================= */
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("❌ STRIPE_SECRET_KEY não definido!");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

/* =======================
   FRONTEND URL
======================= */
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:8080";

/* =======================
   CORS CONFIG
======================= */
const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:5173",
  "http://localhost:3000",
  "https://monumentofdreams-hyahgnxz6-ernestomiguelito-gmailcoms-projects.vercel.app",
  "https://gilded-squirrel-086a27.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Postman ou server-to-server

      // Domínios fixos
      if (allowedOrigins.includes(origin)) return callback(null, true);

      // Permitir todos subdomínios Vercel/Netlify
      if (origin?.endsWith(".vercel.app")) return callback(null, true);
      if (origin?.endsWith(".netlify.app")) return callback(null, true);

      console.warn("🚫 CORS bloqueado:", origin);
      return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Preflight handler (deve vir logo após o CORS)
app.options("*", cors());

/* =======================
   MIDDLEWARES
======================= */
app.use(express.json({ limit: "1mb" }));

/* =======================
   ROOT
======================= */
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Dreams Backend Root",
    environment: process.env.NODE_ENV || "development",
    time: new Date().toISOString(),
  });
});

/* =======================
   HEALTH CHECK
======================= */
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    stripeConfigured: !!process.env.STRIPE_SECRET_KEY,
    frontendUrl: FRONTEND_URL,
    timestamp: new Date().toISOString(),
  });
});

/* =======================
   STRIPE WEBHOOK
======================= */
app.post(
  "/webhook/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("✅ Pagamento confirmado:", session.id);

      const metadata = session.metadata;
      if (!metadata || !metadata.dream_title) {
        console.warn("⚠️ Metadata ausente, ignorando");
        return res.status(200).json({ received: true });
      }

      try {
        const { createClient } = require("@supabase/supabase-js");
        const supabase = createClient(
          process.env.SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        // Proteção contra duplicação
        const { data: existing } = await supabase
          .from("dreams")
          .select("id")
          .eq("stripe_session_id", session.id)
          .single();

        if (existing) {
          console.log("⚠️ Sonho já salvo anteriormente");
          return res.status(200).json({ received: true });
        }

        // Salva sonho pago
        const { error } = await supabase.from("dreams").insert([
          {
            title: metadata.dream_title,
            description: metadata.dream_description,
            author: metadata.dream_author,
            country: metadata.dream_country,
            language: metadata.dream_language || null,
            likes: 0,
            views: 0,
            paid: true,
            stripe_session_id: session.id,
            created_at: new Date().toISOString(),
          },
        ]);

        if (error) {
          console.error("❌ Supabase insert error:", error);
          return res.status(500).send("Database error");
        }

        console.log("🎉 Sonho salvo com sucesso (PAGO)");
      } catch (dbError) {
        console.error("❌ Webhook DB error:", dbError);
        return res.status(500).send("Internal error");
      }
    }

    res.json({ received: true });
  }
);

/* =======================
   STRIPE CHECKOUT SESSION
======================= */
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { dream } = req.body;

    // Validação
    if (
      !dream ||
      typeof dream !== "object" ||
      !dream.title ||
      !dream.description ||
      !dream.author ||
      !dream.country
    ) {
      return res.status(400).json({ error: "Invalid dream data" });
    }

    console.log("💳 Criando checkout (SEM salvar no DB)", {
      author: dream.author,
      country: dream.country,
      origin: req.headers.origin,
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: 100,
            product_data: {
              name: "Dream Submission",
              description: `Support a dream from ${dream.author} (${dream.country})`,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/submit`,
      metadata: {
        dream_title: dream.title,
        dream_description: dream.description,
        dream_author: dream.author,
        dream_country: dream.country,
        dream_language: dream.language || "",
      },
    });

    return res.json({ success: true, sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("❌ Stripe error:", error);
    return res.status(500).json({ error: "Payment failed", message: error.message });
  }
});

/* =======================
   METHOD GUARD
======================= */
app.get("/create-checkout-session", (req, res) => {
  res.status(405).json({ error: "Method Not Allowed", message: "Use POST" });
});

/* =======================
   START SERVER
======================= */
app.listen(PORT, () => {
  console.log("=".repeat(50));
  console.log("🚀 DREAMS BACKEND STARTED");
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌍 Frontend: ${FRONTEND_URL}`);
  console.log(`💳 Stripe OK: ${!!process.env.STRIPE_SECRET_KEY}`);
  console.log("=".repeat(50));
});
