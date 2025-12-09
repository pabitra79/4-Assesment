import express, { Application, Request, Response, NextFunction } from 'express';
import path from 'path';
import session from 'express-session';
import flash from 'connect-flash';
import dotenv from 'dotenv';
import { connectionDb } from './app/config/db.config';
import adminRouter from './app/router/admin.router';
import customerRouter from './app/router/customer.router';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Database connection
connectionDb();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware - MUST BE IN THIS ORDER
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session MUST come before flash
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-this-in-production',
  resave: false,
  saveUninitialized: true, // MUST be true for flash to work
  cookie: { 
    maxAge: 60000 * 60,
    httpOnly: true,
    secure: false
  }
}));

// Flash MUST come after session
app.use(flash());

// Global flash message middleware - MUST come before routes
app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Routes - MUST come after all middleware
app.use('/admin', adminRouter);
app.use('/', customerRouter);

// 404 Handler - MUST be last
app.use((req: Request, res: Response) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;