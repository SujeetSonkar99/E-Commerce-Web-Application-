// 1. Load Environment Variables FIRST
const dotenv = require('dotenv');
dotenv.config();

// 2. Load Core Libraries
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

// 3. Load Configs
const connectDB = require('./config/db');
const swaggerSetup = require('./config/swagger');
const { initData } = require('./config/initData');

// 4. Route imports
const authRoutes = require('./routes/auth.routes');
const categoryRoutes = require('./routes/category.routes');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const addressRoutes = require('./routes/address.routes');
const analyticsRoutes = require('./routes/analytics.routes');

const app = express();
const PORT = process.env.PORT || 8080;

// Connect to MongoDB
connectDB().then(() => initData());

// Middleware
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files (images)
const imagePath = path.join(process.cwd(), 'images');
app.use('/images', express.static(imagePath));

// Swagger docs
swaggerSetup(app);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', cartRoutes);
app.use('/api', orderRoutes);
app.use('/api', addressRoutes);
app.use('/api', analyticsRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("🚨 GLOBAL ERROR HANDLER CAUGHT:", err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    status: false,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
});

module.exports = app;
