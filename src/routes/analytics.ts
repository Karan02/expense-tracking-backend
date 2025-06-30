// routes/analytics.ts
import express from 'express';
import prisma from '../lib/prisma';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const user = req.body.user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const whereClause = user.role === 'admin' ? {} : { userId: user.id };
    // Total by category
    const totalByCategory = await prisma.expense.groupBy({
      by: ['category'],
      where: whereClause,
      _sum: {
        amount: true,
      },
    });
    // Total amount spent
    const totalAmount = await prisma.expense.aggregate({
      where: whereClause,
      _sum: { amount: true },
    });
    res.json({
      amount: totalAmount._sum.amount || 0,
      category: totalByCategory.map(item => ({
        category: item.category,
        total: item._sum.amount,
      })),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
