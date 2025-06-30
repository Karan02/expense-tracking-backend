"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/analytics.ts
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = express_1.default.Router();
router.get('/', async (req, res, next) => {
    try {
        const user = req.body.user;
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const whereClause = user.role === 'admin' ? {} : { userId: user.id };
        // Total by category
        const totalByCategory = await prisma_1.default.expense.groupBy({
            by: ['category'],
            where: whereClause,
            _sum: {
                amount: true,
            },
        });
        // Total amount spent
        const totalAmount = await prisma_1.default.expense.aggregate({
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
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
