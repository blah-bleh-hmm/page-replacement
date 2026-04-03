import request from 'supertest';
import app from '../src/app.js';

const validPayload = {
  frameSize: 3,
  pages: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2],
  algorithms: ['fifo', 'optimal'],
  save: true,
};

describe('Simulation API', () => {
  test('lists available algorithms', async () => {
    const res = await request(app).get('/api/simulations/algorithms');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.algorithms)).toBe(true);
    expect(res.body.algorithms.length).toBeGreaterThan(0);
    expect(res.body.algorithms[0]).toHaveProperty('key');
    expect(res.body.algorithms[0]).toHaveProperty('label');
  });

  test('runs simulation and returns steps', async () => {
    const res = await request(app)
      .post('/api/simulations/run')
      .send(validPayload)
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.runs)).toBe(true);
    expect(res.body.runs).toHaveLength(validPayload.algorithms.length);

    res.body.runs.forEach((run) => {
      expect(run).toHaveProperty('algorithm');
      expect(run).toHaveProperty('steps');
      expect(Array.isArray(run.steps)).toBe(true);
      expect(run.steps).toHaveLength(validPayload.pages.length);
      expect(run.summary).toHaveProperty('faults');
      expect(run.summary).toHaveProperty('hits');
    });
  });

  test('returns history when saving is enabled', async () => {
    // Run one simulation to populate in-memory history
    await request(app).post('/api/simulations/run').send(validPayload);

    const res = await request(app).get('/api/simulations/history');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
  });
});
