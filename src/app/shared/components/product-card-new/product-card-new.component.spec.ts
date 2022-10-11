import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCardNewComponent } from './product-card-new.component';

describe('ProductCardNewComponent', () => {
  let component: ProductCardNewComponent;
  let fixture: ComponentFixture<ProductCardNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCardNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCardNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
