import { faker } from '@faker-js/faker';
import { prisma } from '../../src/database';
import { CreateRecommendationData } from '../../src/services/recommendationsService';

function randomRecommendationData(): CreateRecommendationData {
  return {
    name: faker.internet.userName(),
    youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alphaNumeric(10)}`
  };
}

function randomInvalidRecommendationData() {
  return {
    name: Number(faker.random.numeric(10)),
    youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alphaNumeric(10)}`,
    noToBeHere: 'iansdçasndsaçnd'
  };
}

async function createRecommendation() {
  const recommendationData = randomRecommendationData();

  const promise = await prisma.recommendation.create({ data: recommendationData });

  return promise;
}

async function createLowScoreRecommendation() {
  const recommendationCreated = await createRecommendation();

  const promise = await prisma.recommendation.update({
    where: {
      id: recommendationCreated.id
    },
    data: {
      score: -7
    }
  });

  return promise;
}

async function populateWithRandomsRecommendations() {
  const randomRecommendations = [];
  const randomQuantity = Math.floor(Math.random() * 50 + 12);

  for (let i = 0; i < randomQuantity; i++) {
    randomRecommendations.push({
      ...randomRecommendationData(),
      score: Math.floor(Math.random() * 25)
    });
  }

  const promise = await prisma.recommendation.createMany({ data: randomRecommendations });

  return promise
}

export const recommendationsFactorys = {
  randomRecommendationData,
  randomInvalidRecommendationData,
  createRecommendation,
  createLowScoreRecommendation,
  populateWithRandomsRecommendations
};
