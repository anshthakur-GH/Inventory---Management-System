"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./db"));
// Load environment variables
dotenv_1.default.config();
(0, db_1.default)();
const app = (0, express_1.default)();
// Redirect root to login
app.get('/', (req, res) => {
    res.redirect('/login');
});
// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, 'views'));
// Serve static files
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use(express_1.default.urlencoded({ extended: true }));
// Session middleware
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
}));
// Import routes
const auth_1 = __importDefault(require("./routes/auth"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const products_1 = __importDefault(require("./routes/products"));
const orders_1 = __importDefault(require("./routes/orders"));
const stock_1 = __importDefault(require("./routes/stock"));
const reports_1 = __importDefault(require("./routes/reports"));
app.use('/', auth_1.default);
app.use('/dashboard', dashboard_1.default);
app.use('/products', products_1.default);
app.use('/orders', orders_1.default);
app.use('/stock', stock_1.default);
app.use('/reports', reports_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
