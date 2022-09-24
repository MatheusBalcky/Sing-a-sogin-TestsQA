import { faker } from '@faker-js/faker';
import { CreateRecommendationData } from '../../src/services/recommendationsService';

function randomRecommendationData (): CreateRecommendationData {
  return {
    name: faker.internet.userName(),
    youtubeLink: faker.internet.url(),
  }
}


export const recommendationsFactorys = {
  randomRecommendationData
}