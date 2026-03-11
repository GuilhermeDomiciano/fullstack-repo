'use strict';

const pkg = require('../../../package.json');

const getHealthStatus = () => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: pkg.version,
    environment: process.env.NODE_ENV || 'development',
  };
};

module.exports = { getHealthStatus };
