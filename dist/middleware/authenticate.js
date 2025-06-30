"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const authenticate = (req, res, next) => {
    const user = req.headers['x-user'];
    if (!user)
        return res.status(401).json({ message: 'Unauthorized' });
    req.body.user = JSON.parse(user); // simulate auth
    next();
};
exports.authenticate = authenticate;
