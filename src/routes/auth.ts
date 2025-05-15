import { Router } from 'express';
import { User } from '../models/User';
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

export default router; 