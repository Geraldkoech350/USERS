"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permit = void 0;
const permit = (req, res, next) => {
    const token = req.headers['token'];
    if (!token) {
        return res.json({ error: 'Not permitted to access this route, no token found' });
    }
    if (token !== 'secret') {
        return res.json({ error: 'Invalid token' });
    }
    next();
};
exports.permit = permit;
