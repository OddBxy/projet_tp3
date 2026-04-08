import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogExplorer } from './catalog-explorer';

describe('CatalogExplorer', () => {
  let component: CatalogExplorer;
  let fixture: ComponentFixture<CatalogExplorer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogExplorer],
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogExplorer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
