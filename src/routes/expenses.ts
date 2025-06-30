import express from 'express';
import prisma from '../lib/prisma';
import { stat } from 'fs';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { amount, category, description, date } = req.body;
    const user = req.body.user;
    if (!user?.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!amount || !category || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const expense = await prisma.expense.create({
      data: {
        amount: parseFloat(amount),
        category,
        description,
        date: new Date(date),
        userId: user.id,
      },
    });

    res.status(201).json(expense);
  } catch (err) {
    next(err);
  }
});

// router.get('/', async (req, res, next) => {
//   try {
//     const user = req.user;

//     const whereClause = user?.role === 'admin' ? {} : { userId: user?.id };

//     const expenses = await prisma.expense.findMany({
//       where: whereClause,
//       orderBy: { date: 'desc' },
//     });

//     res.json(expenses);
//   } catch (err) {
//     next(err);
//   }
// });

router.get('/', async (req, res, next) => {
  try {
    const user = req.user;

    const { startDate, endDate, category } = req.query;

    const where: any = {};

    // Role-based filtering
    if (user?.role !== 'admin') {
      where.userId = user?.id;
    }

    // Optional filters
    if (category && typeof category === 'string') {
      where.category = category;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate as string);
      if (endDate) where.date.lte = new Date(endDate as string);
    }

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    res.json(expenses);
  } catch (err) {
    next(err);
  }
});


router.patch('/:id', async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    const user = req.body.user;
    
    if (user?.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updated = await prisma.expense.update({
      where: { id },
      data: { status },
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

export default router;
