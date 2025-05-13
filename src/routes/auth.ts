import { Router } from 'express';
const router = Router();

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  // TODO: Authenticate user
  res.redirect('/dashboard');
});

router.get('/logout', (req, res) => {
  // TODO: Destroy session
  res.redirect('/login');
});

export default router; 