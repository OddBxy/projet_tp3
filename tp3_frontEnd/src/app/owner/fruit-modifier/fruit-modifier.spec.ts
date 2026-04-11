import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FruitModifier } from './fruit-modifier';

describe('FruitModifier', () => {
  let component: FruitModifier;
  let fixture: ComponentFixture<FruitModifier>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FruitModifier],
    }).compileComponents();

    fixture = TestBed.createComponent(FruitModifier);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
