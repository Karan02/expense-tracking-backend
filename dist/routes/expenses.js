"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = express_1.default.Router();
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
        const expense = await prisma_1.default.expense.create({
            data: {
                amount: parseFloat(amount),
                category,
                description,
                date: new Date(date),
                userId: user.id,
            },
        });
        res.status(201).json(expense);
    }
    catch (err) {
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
        const where = {};
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
            if (startDate)
                where.date.gte = new Date(startDate);
            if (endDate)
                where.date.lte = new Date(endDate);
        }
        const expenses = await prisma_1.default.expense.findMany({
            where,
            orderBy: { date: 'desc' },
        });
        res.json(expenses);
    }
    catch (err) {
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
        const updated = await prisma_1.default.expense.update({
            where: { id },
            data: { status },
        });
        res.json(updated);
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
