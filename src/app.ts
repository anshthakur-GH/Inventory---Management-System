import express from 'express';
import session from 'express-session';
import path from 'path';
import dotenv from 'dotenv';
import connectDB from './db';

// Load environment variables
dotenv.config();

connectDB();

const app = express();

// Redirect root to login
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
}));

// Import routes
import authRoutes from './routes/auth';
import dashboardRoutes from './routes/dashboard';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import stockRoutes from './routes/stock';
import reportRoutes from './routes/reports';

app.use('/', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/stock', stockRoutes);
app.use('/reports', reportRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 