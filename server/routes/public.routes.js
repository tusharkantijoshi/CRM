import { Router } from 'express';

const router = Router();

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password });
    res.status(200).json({ message: 'Login successful' });
});

export default router;
