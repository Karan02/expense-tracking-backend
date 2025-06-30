"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = express_1.default.Router();
router.post('/login', (req, res) => {
    const { email } = req.body;
    if (!email)
        return res.status(400).json({ message: 'Email required' });
    const mockUser = { id: '1', name: 'John', email, role: 'admin' };
    res.json({ token: JSON.stringify(mockUser) }); // fake token
});
router.post('/register', async (req, res, next) => {
    try {
        const { name, email, password, role = 'employee' } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const existingUser = await prisma_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already registered' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma_1.default.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            },
        });
        res.status(201).json({ id: user.id, email: user.email, role: user.role });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
