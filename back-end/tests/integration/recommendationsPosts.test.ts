import { prisma } from '../../src/database';
import supertest from 'supertest';
import app from '../../src/app';
import { recommendationsFactorys } from '../factors/recommendationsFactory';

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
});

afterAll(async () => {
  await prisma.$disconnect();
});

const request = supertest(app);

describe('POSTS AT ROUTE "/recommendations/..." ', () => {
  test('Should insert a new recommendation with success (201)', async () => {
    const randomRecommendationData = recommendationsFactorys.randomRecommendationData();

    const promise = await request.post('/recommendations').send(randomRecommendationData);

    expect(promise.status).toBe(201);
  });

  test('Should return status 422 when recommendation data entity are invalid', async () => {
    const randomRecommendationData = recommendationsFactorys.randomInvalidRecommendationData();

    const promise = await request.post('/recommendations').send(randomRecommendationData);

    expect(promise.status).toBe(422);
  });

  test('At /recommendations/:id/upvote, should plus one score in the recommendation by ID', async () => {
    const recommendationCreated = await recommendationsFactorys.createRecommendation();

    const promise = await request.post(`/recommendations/${recommendationCreated.id}/upvote`);

    expect(promise.status).toBe(200);
  });

  test('At /recommendations/:id/upvote, should return 404, when id is invalid ', async () => {
    const promise = await request.post('/recommendations/00000000/upvote');

    expect(promise.status).toBe(404);
  });

  test('At /recommendations/:id/downvote, should down vote one score in the recommendation by ID', async () => {
    const recommendationCreated = await recommendationsFactorys.createRecommendation();

    const promise = await request.post(`/recommendations/${recommendationCreated.id}/downvote`);

    expect(promise.status).toBe(200);
  });

  test('At /recommendations/:id/downvote, should return 404, when id is invalid', async () => {
    const promise = await request.post('/recommendations/0000000/downvote');

    expect(promise.status).toBe(404);
  });

  test('At /recommendations/:id/downvote, When down vote, should remove recommendation when score are (score < -5)', async () => {
    const recommendationLowScore = await recommendationsFactorys.createLowScoreRecommendation();
    
    const promise = await request.post(`/recommendations/${recommendationLowScore.id}/downvote`);

    const getRecommendation = await request.get(`/recommendations/${recommendationLowScore.id}`);

    expect(getRecommendation.status).toBe(404);
    expect(promise.status).toBe(200);
  });
});
