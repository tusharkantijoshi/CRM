import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    console.log('Get all users request received');
    res.status(200).json({
        message: 'Get all users successful',
        users: [] // Dummy empty list
    });
});

export default router;
