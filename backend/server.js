require('dotenv').config();

const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// ===== Configuração CORS =====
const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:5173',
  'http://localhost:3000',
  'https://gilded-squirrel-086a27.netlify.app',
  'https://monumentofdreams-hyahgnxz6-ernestomiguelito-gmailcoms-projects.vercel.app'
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = `CORS policy does not allow access from this origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin']
}));

app.options('*', cors());

// ===== ROTA RAIZ PARA EVITAR "Cannot GET /" =====
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Dreams Backend Root',
    version: '1.0.0',
    time: new Date().toISOString()
  });
});

app.use(express.json());

// ===== ROTAS =====

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Dreams Backend is running',
    stripeConfigured: !!process.env.STRIPE_SECRET_KEY,
    frontendUrl: process.env.FRONTEND_URL,
    timestamp: new Date().toISOString(),
    allowedOrigins
  });
});

// Teste CORS
app.post('/test-create-session', (req, res) => {
  res.json({
    success: true,
    test: true,
    message: 'CORS is working correctly!',
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

// Criar sessão de checkout Stripe
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { dreamId, author = 'Anonymous', country = 'Unknown' } = req.body;

    if (!dreamId) {
      return res.status(400).json({ 
        error: 'dreamId is required',
        received: req.body 
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Dream Submission',
              description: `Support dream from ${author} in ${country}`,
            },
            unit_amount: 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}&dream_id=${dreamId}`,
      cancel_url: `${process.env.FRONTEND_URL}/submit`,
      metadata: {
        dreamId,
        author,
        country,
        type: 'dream_submission'
      },
    });

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url,
      dreamId
    });

  } catch (error) {
    res.status(500).json({
      error: 'Payment failed',
      message: error.message,
      type: error.type
    });
  }
});

// Test route
app.get('/test', (req, res) => {
  res.json({
    message: 'Backend is working!',
    origin: req.headers.origin,
    time: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
