import { Test, TestingModule } from '@nestjs/testing';
import { Guard } from './guard';

describe('Guard', () => {
  let provider: Guard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Guard],
    }).compile();

    provider = module.get<Guard>(Guard);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
