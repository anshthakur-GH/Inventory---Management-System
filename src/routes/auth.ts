import { Router } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';

const router = Router();

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user) {
    return res.render('login', { error: 'Invalid username or password' });
  }
  // Plain text password check
  if (user.password !== password) {
    return res.render('login', { error: 'Invalid username or password' });
  }
  req.session.userId = user.id;
  res.redirect('/dashboard');
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// Registration form
router.get('/register', (req, res) => {
  res.render('register');
});

// Handle registration
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.render('register', { error: 'All fields are required.' });
  }
  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) {
    return res.render('register', { error: 'Username already exists.' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ username, password: hashedPassword });
  res.redirect('/login');
});

export default router; 