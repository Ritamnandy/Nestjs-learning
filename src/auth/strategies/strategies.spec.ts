import { Test, TestingModule } from '@nestjs/testing';
import { Strategies } from './strategies';

describe('Strategies', () => {
  let provider: Strategies;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Strategies],
    }).compile();

    provider = module.get<Strategies>(Strategies);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
