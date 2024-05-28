import 'reflect-metadata';
import express from 'express';
import { connectDatabase } from './database';
import userRoutes from './routes/user';
import { startScheduler } from './scheduler';

const app = express();
app.use(express.json());
app.use('/api', userRoutes);

const startServer = async () => {
  await connectDatabase();
  startScheduler();
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
};

startServer().catch(error => console.error('Failed to start server:', error));

