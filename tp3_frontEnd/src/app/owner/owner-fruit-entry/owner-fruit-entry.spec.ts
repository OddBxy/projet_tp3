import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerFruitEntry } from './owner-fruit-entry';

describe('OwnerFruitEntry', () => {
  let component: OwnerFruitEntry;
  let fixture: ComponentFixture<OwnerFruitEntry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerFruitEntry],
    }).compileComponents();

    fixture = TestBed.createComponent(OwnerFruitEntry);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
