"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
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
exports.default = router;
