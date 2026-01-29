import 'dotenv/config';
import express, { json } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectDB } from './db/connection.js';

import healthRoutes from './modules/health/health.routes.js';
import routes from './routes/index.js';

const app = express();
// Connect to database
connectDB();
const PORT = process.env.PORT || 3000;

// Security Middleware
app.use(helmet());

app.use(cors());
app.use(json());

app.use('/health', healthRoutes);
app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
