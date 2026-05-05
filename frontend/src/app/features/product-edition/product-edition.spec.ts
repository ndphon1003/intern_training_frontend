import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductEdition } from './product-edition';

describe('ProductEdition', () => {
  let component: ProductEdition;
  let fixture: ComponentFixture<ProductEdition>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductEdition],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductEdition);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
