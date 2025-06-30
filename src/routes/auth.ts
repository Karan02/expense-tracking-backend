import express from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';

const router = express.Router();

router.post('/login', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email required' });

  const mockUser = { id: '1', name: 'John', email, role: 'admin' };
  res.json({ token: JSON.stringify(mockUser) }); // fake token
});


router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, role = 'employee' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    res.status(201).json({ id: user.id, email: user.email, role: user.role });
  } catch (err) {
    next(err);
  }
});

export default router;
