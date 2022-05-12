import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  const mockData = {
    status: 200,
    result: 'postocodes',
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root.', () => {
    it('should return "https://postcodes.io"', () => {
      expect(appController.getHello()).toBe('https://postcodes.io');
    });
  });

  describe('Testing 1', () => {
    it('should return 1', () => {
      expect(1).toBe(1);
    });
  });

  describe('Testing 2', () => {
    it('should return mockData', () => {
      expect(mockData).toStrictEqual({
        status: 200,
        result: 'postocodes',
      });
    });
  });
});
