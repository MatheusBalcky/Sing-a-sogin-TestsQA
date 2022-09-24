import { recommendationService } from '../../src/services/recommendationsService';
import { recommendationsFactorys } from '../factors/reccomendationsFactory';
import { recommendationRepository } from '../../src/repositories/recommendationRepository';

beforeEach(async () => {
  jest.clearAllMocks();
});

describe('Unit tests of recommendationServices', () => {
  const recommendationData = recommendationsFactorys.randomRecommendationData();
  const randomId = Math.floor(Math.random() * 10);

  test('Should insert a new recomendation with success', async () => {
    jest
      .spyOn(recommendationRepository, 'findByName')
      .mockImplementationOnce((): any => null);
    jest
      .spyOn(recommendationRepository, 'create')
      .mockImplementationOnce((): any => null);

    await recommendationService.insert(recommendationData);

    expect(recommendationRepository.findByName).toBeCalled();
    expect(recommendationRepository.create).toBeCalled();
  });

  test('When insert should receive an error triggered by conflict recommendation name', async () => {
    jest
      .spyOn(recommendationRepository, 'findByName')
      .mockImplementationOnce((): any => {
        return true;
      });

    const promise = recommendationService.insert(recommendationData);

    expect(promise).rejects.toEqual({
      type: 'conflict',
      message: 'Recommendations names must be unique'
    });
  });

  test('Should upvote a recommendation when id is valid', async () => {
    jest
      .spyOn(recommendationRepository, 'find')
      .mockImplementationOnce((): any => true);
    jest
      .spyOn(recommendationRepository, 'updateScore')
      .mockImplementationOnce((): any => null);

    await recommendationService.upvote(randomId);

    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).toBeCalled();
  });

  test('Should not upvote a recommendation when id is invalid', async () => {
    jest
      .spyOn(recommendationRepository, 'find')
      .mockImplementationOnce((): any => false);

    const promise = recommendationService.upvote(randomId);

    expect(recommendationRepository.find).toBeCalled();
    expect(promise).rejects.toEqual({
      type: 'not_found',
      message: ''
    });
  });

  test('Should downvote a recommendation when id is valid, and do not remove it', async () => {
    jest
      .spyOn(recommendationRepository, 'find')
      .mockImplementationOnce((): any => true);

    jest
      .spyOn(recommendationRepository, 'updateScore')
      .mockImplementationOnce((): any => {
        return { score: 100 };
      });
    jest.spyOn(recommendationRepository, 'remove');

    await recommendationService.downvote(randomId);

    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).toBeCalled();
    expect(recommendationRepository.remove).not.toBeCalled();
  });

  test('Should downvote a recommendation when id is valid, and remove it', async () => {
    jest
      .spyOn(recommendationRepository, 'find')
      .mockImplementationOnce((): any => true);
    jest
      .spyOn(recommendationRepository, 'updateScore')
      .mockImplementationOnce((): any => {
        return { score: -9 };
      });
    jest
      .spyOn(recommendationRepository, 'remove')
      .mockImplementationOnce((): any => {});

    await recommendationService.downvote(randomId);

    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).toBeCalled();
    expect(recommendationRepository.remove).toBeCalled();
  });

  test('Should get all recommendations', async () => {
    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockImplementationOnce((): any => {
        return [];
      });

    const promise = await recommendationService.get();

    expect(recommendationRepository.findAll).toBeCalled();
    expect.arrayContaining(promise);
  });

  test('It should return an array of elements with the amount of the parameter passed', async () => {
    jest
      .spyOn(recommendationRepository, 'getAmountByScore')
      .mockImplementationOnce((take: number): any => {
        const result = [];
        for (let i = 0; i < amountToGet; i++) result.push(i);
        return result;
      });
    const amountToGet = Math.floor(Math.random() * 10);

    const promise = await recommendationService.getTop(amountToGet);

    expect(recommendationRepository.getAmountByScore).toBeCalled();
    expect(promise.length === amountToGet).toBe(true);
  });

  test('It should return a random recommendation', async () => {
    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockImplementationOnce((): any => {
        return [{ test: '1561651561565156' }];
      });

    const promise = await recommendationService.getRandom();

    expect(recommendationRepository.findAll).toBeCalled();
    expect.objectContaining(promise);
  });

  test('It should return an error when there is no recommendation', async () => {
    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockImplementation((): any => {
        return [];
      });

    const promise = recommendationService.getRandom();

    expect(promise).rejects.toEqual({
      type: 'not_found',
      message: ''
    });
    expect(recommendationRepository.findAll).toBeCalled();
  });

  test('It should return "gt" when random number is less than 0.7', () => {
    const randomNumber = 0.5;

    const result = recommendationService.getScoreFilter(randomNumber);

    expect(result).toBe('gt');
  });

  test('It should return "lte" when random number is 0.7 or greater', () => {
    const randomNumber = 0.7;

    const result = recommendationService.getScoreFilter(randomNumber);

    expect(result).toBe('lte');
  });
});
