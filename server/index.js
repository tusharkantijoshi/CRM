process.loadEnvFile();
import express, { json } from 'express';
import cors from 'cors';

import healthRoutes from './modules/health/health.routes.js';
import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(json());

app.use('/health', healthRoutes);
app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
