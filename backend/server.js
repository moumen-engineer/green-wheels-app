const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const cors = require('cors');
const helmet = require('helmet');

const db = require('./config/db');
const User = require('./models/User');
const Subscription = require('./models/Subscription');
const errorHandler = require('./middleware/errorHandler');
const { verifyMailTransport } = require('./config/mail');
const Payment = require('./models/Payment');

// ─── Routes ───────────────────────────────────────────────────────────────
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const stationRoutes = require('./routes/stationRoutes');
const paymentRoutes = require('./routes/payments');
const vehicleRoutes = require('./routes/vehicles');
const rideRoutes = require('./routes/rides');
const app = express();

// ─── Security & parsing ───────────────────────────────────────────────────
app.use(helmet());

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Session store (MySQL) ────────────────────────────────────────────────
const DB_PORT = Number(process.env.DB_PORT) || 3308 || 3306;

const sessionStore = new MySQLStore({
  host: process.env.DB_HOST || '127.0.0.1',
  port: DB_PORT,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'greenwheels',
});

app.use(session({
  name: 'gw_session',
  secret: process.env.SESSION_SECRET || 'change_this_secret',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
}));

// ─── Routes mounting ───────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stations', stationRoutes);
app.use('/api/payments', paymentRoutes);
app.use("/uploads", express.static("uploads"));
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/rides', rideRoutes);
// ─── Health check ──────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ─── Global error handler ──────────────────────────────────────────────────
app.use(errorHandler);

// ─── Boot server ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    // Test DB connection
    const conn = await db.getConnection();
    conn.release();
    console.log(`MySQL connected (port ${DB_PORT})`);

    // Auto-create tables
    await User.migrate();
    console.log('Users table ready');
    
    await Subscription.migrate();
    console.log('Subscriptions table ready');
    
    // Create payments table
    await Payment.migrate();
    console.log('Payments table ready');

    // SMTP check (optional)
    if (process.env.EMAIL_SKIP_VERIFY !== 'true') {
      try {
        const v = await verifyMailTransport();
        if (v.skip) {
          console.log('Email: SMTP not configured');
        } else {
          console.log('Email: SMTP OK');
        }
      } catch (smtpErr) {
        console.error('Email SMTP error:', smtpErr.message);
      }
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`http://localhost:${PORT}/api/health`);
    });

  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
})();