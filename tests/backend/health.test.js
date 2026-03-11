'use strict';

const request = require('supertest');
const app = require('../../src/backend/index');
const pkg = require('../../package.json');

describe('GET /api/health', () => {
  it('should return 200 with the correct response envelope', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Service is healthy');
  });

  it('should return data.status as "ok"', async () => {
    const res = await request(app).get('/api/health');

    expect(res.body.data.status).toBe('ok');
  });

  it('should return data.timestamp as a valid ISO 8601 UTC string', async () => {
    const res = await request(app).get('/api/health');

    const timestamp = res.body.data.timestamp;
    expect(typeof timestamp).toBe('string');
    expect(new Date(timestamp).toISOString()).toBe(timestamp);
  });

  it('should return data.version matching package.json version', async () => {
    const res = await request(app).get('/api/health');

    expect(res.body.data.version).toBe(pkg.version);
  });

  it('should return data.environment reflecting NODE_ENV', async () => {
    const res = await request(app).get('/api/health');

    const expectedEnv = process.env.NODE_ENV || 'development';
    expect(res.body.data.environment).toBe(expectedEnv);
  });

  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/unknown-route');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});
