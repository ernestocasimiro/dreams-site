require('dotenv').config();

const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');

const app = express();
const PORT = process.env.PORT || 3001;

/* =======================
   STRIPE CONFIG
======================= */
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY não definido!');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

/* =======================
   FRONTEND URL
======================= */
const FRONTEND_URL =
  process.env.FRONTEND_URL || 'http://localhost:8080';

/* =======================
   CORS CONFIG (ROBUSTO)
======================= */
const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:5173',
  'http://localhost:3000',
  'https://gilded-squirrel-086a27.netlify.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permite Postman, Stripe webhooks, server-to-server
      if (!origin) return callback(null, true);

      // ✅ Permite QUALQUER deploy do Vercel
      if (origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }

      // ✅ Domínios fixos permitidos
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn('🚫 CORS bloqueado:', origin);
      return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ✅ MUITO IMPORTANTE PARA CORS
app.options('*', cors());

/* =======================
   MIDDLEWARES
======================= */
app.use(express.json());

/* =======================
   ROOT
======================= */
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Dreams Backend Root',
    environment: process.env.NODE_ENV || 'development',
    time: new Date().toISOString(),
  });
});

/* =======================
   HEALTH CHECK
======================= */
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Dreams Backend is running',
    stripeConfigured: !!process.env.STRIPE_SECRET_KEY,
    frontendUrl: FRONTEND_URL,
    timestamp: new Date().toISOString(),
  });
});

/* =======================
   TEST CORS
======================= */
app.post('/test-create-session', (req, res) => {
  res.json({
    success: true,
    message: 'CORS is working correctly!',
    origin: req.headers.origin,
    time: new Date().toISOString(),
  });
});

/* =======================
   STRIPE CHECKOUT
======================= */
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { dreamId, author = 'Anonymous', country = 'Unknown' } = req.body;

    if (!dreamId) {
      return res.status(400).json({
        error: 'dreamId is required',
      });
    }

    console.log('💳 Criando checkout:', {
      dreamId,
      author,
      country,
      origin: req.headers.origin,
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: 100, // $1.00
            product_data: {
              name: 'Dream Submission',
              description: `Support dream from ${author} in ${country}`,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}&dream_id=${dreamId}`,
      cancel_url: `${FRONTEND_URL}/submit`,
      metadata: {
        dreamId,
        author,
        country,
        type: 'dream_submission',
      },
    });

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });

  } catch (error) {
    console.error('❌ Stripe error:', error);
    res.status(500).json({
      error: 'Payment failed',
      message: error.message,
    });
  }
});

/* =======================
   TEST ROUTE
======================= */
app.get('/test', (req, res) => {
  res.json({
    message: 'Backend is working!',
    origin: req.headers.origin,
    time: new Date().toISOString(),
  });
});

/* =======================
   START SERVER
======================= */
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 DREAMS BACKEND STARTED');
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌍 Frontend: ${FRONTEND_URL}`);
  console.log(`💳 Stripe OK: ${!!process.env.STRIPE_SECRET_KEY}`);
  console.log('='.repeat(50));
});
