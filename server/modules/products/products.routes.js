import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    console.log('Get all products request received');
    res.status(200).json({
        message: 'Get all products successful',
        products: [] // Dummy empty list
    });
});

export default router;
