'use strict';

const healthService = require('../services/healthService');

const getHealth = (req, res) => {
  try {
    const healthData = healthService.getHealthStatus();
    return res.status(200).json({
      success: true,
      data: healthData,
      message: 'Service is healthy',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVICE_UNAVAILABLE',
        message: 'Service is not healthy',
      },
    });
  }
};

module.exports = { getHealth };
