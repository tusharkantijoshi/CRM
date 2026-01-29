
import * as healthService from './health.service.js';

export const getHealth = (req, res) => {
    const healthData = healthService.getHealth();
    res.json(healthData);
};
