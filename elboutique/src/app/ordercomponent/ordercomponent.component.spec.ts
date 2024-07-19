import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdercomponentComponent } from './ordercomponent.component';

describe('OrdercomponentComponent', () => {
  let component: OrdercomponentComponent;
  let fixture: ComponentFixture<OrdercomponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdercomponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrdercomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
