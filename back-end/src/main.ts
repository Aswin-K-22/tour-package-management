// src/main.ts
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { composeApp } from './app.composer';

dotenv.config();



const app = express();
app.use(morgan('[:date[iso]] :method :url :status :response-time ms'));
app.use(cors({
  origin: process.env.ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(cookieParser());




app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const { countryRoutes, authRoutes, cityRoutes, packageRoutes } = composeApp();

app.use('/country', countryRoutes.router);
app.use('/auth', authRoutes.router);
app.use('/city', cityRoutes.router);
app.use('/tour-package', packageRoutes.router);



// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Global error:', err.stack);
  res.status(500).json({ message: 'Something went wrong on the server', error: err.message });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { app};