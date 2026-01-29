process.loadEnvFile();
import express, { json } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(json());

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
