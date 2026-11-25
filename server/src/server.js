
import 'dotenv/config';
import app from './app.js';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 5001;

async function startServer() {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB connected successfully');
    } else {
      console.log(
        'MONGODB_URI not configured. Starting API without database.'
      );
    }

    app.listen(PORT, () => {
      console.log(`NutriVibe API running at http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start NutriVibe:', error.message);
    process.exit(1);
  }
}

startServer();
