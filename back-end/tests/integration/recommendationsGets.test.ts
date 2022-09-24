import supertest from 'supertest';
import app from '../../src/app';
import { prisma } from '../../src/database';
import { recommendationsFactorys } from '../factors/recommendationsFactory';

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
});

afterAll(async () => {
  await prisma.$disconnect();
});

const request = supertest(app);

describe(' ROUTES GET /recommendations/...', () => {
  test('Should return the latests 10 recommendations', async () => {
    await recommendationsFactorys.populateWithRandomsRecommendations();

    const promise = await request.get('/recommendations');

    expect(promise.body.length <= 10).toBe(true);
  });

  test('Should return one recommendation by ID', async () => {
    const recomendationCreated = await recommendationsFactorys.createRecommendation();

    const promise = await request.get(`/recommendations/${recomendationCreated.id}`);

    expect(promise.body).toEqual(recomendationCreated);
  });

  test('Should return 404 when id are invalid', async () => {
    const promise = await request.get(`/recommendations/000000`);

    expect(promise.status).toBe(404);
  });

  test('Should return a random recommendation', async () => {
    await recommendationsFactorys.populateWithRandomsRecommendations();

    const promise = await request.get(`/recommendations/random`);
    
    expect.objectContaining(promise.body);
  });

  test('Should return recommendations ordenated by score and the amount by parameter', async() =>{
    const { count } = await recommendationsFactorys.populateWithRandomsRecommendations();
    const randomAmount = Math.floor(Math.random() * count + 1);

    const promise = await request.get(`/recommendations/top/${randomAmount}`);

    expect.arrayContaining(promise.body);
    expect(promise.body.length === randomAmount);
  })
});
