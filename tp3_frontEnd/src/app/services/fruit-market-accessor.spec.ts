import { TestBed } from '@angular/core/testing';

import { FruitMarketAccessor } from './fruit-market-accessor';

describe('FruitMarketAccessor', () => {
  let service: FruitMarketAccessor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FruitMarketAccessor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
