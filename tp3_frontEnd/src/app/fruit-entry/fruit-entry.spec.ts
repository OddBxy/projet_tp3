import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FruitEntry } from './fruit-entry';

describe('FruitEntry', () => {
  let component: FruitEntry;
  let fixture: ComponentFixture<FruitEntry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FruitEntry],
    }).compileComponents();

    fixture = TestBed.createComponent(FruitEntry);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
