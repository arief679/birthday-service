import request from 'supertest';
import express from 'express';
import { createConnection, getConnection } from 'typeorm';
import userRoutes from '../routes/user';
import { User } from '../entity/User';

const app = express();
app.use(express.json());
app.use('/api', userRoutes);

beforeAll(async () => {
  await createConnection({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [User],
    synchronize: true,
    logging: false,
  });
});

afterAll(async () => {
  const conn = getConnection();
  await conn.close();
});

describe('User API', () => {
  it('should create a new user', async () => {
    const res = await request(app)
      .post('/api/user')
      .send({
        firstName: 'Digital1',
        lastName: 'Envision1',
        email: 'test@digitalenvision.com.au',
        birthday: '1990-01-01',
        timeZone: 'America/Kuala_Lumpur',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.firstName).toBe('Digital1');
  });

  it('should update a user', async () => {
    const user = await request(app)
      .post('/api/user')
      .send({
        firstName: 'Digital2',
        lastName: 'Envision2',
        email: 'test@digitalenvision.com.au',
        birthday: '1990-12-12',
        timeZone: 'Asia/Jakarta',
      });

    const res = await request(app)
      .put(`/api/user/${user.body.id}`)
      .send({
        firstName: 'Digital',
        lastName: 'Envision',
      });

    expect(res.status).toBe(200);
    expect(res.body.firstName).toBe('Digital');
  });

  it('should delete a user', async () => {
    const user = await request(app)
      .post('/api/user')
      .send({
        firstName: 'Digital',
        lastName: 'Envision',
        email: 'test@digitalenvision.com.au',
        birthday: '1990-12-31',
        timeZone: 'America/Jakarta',
      });

    const res = await request(app).delete(`/api/user/${user.body.id}`);

    expect(res.status).toBe(204);
  });
});

