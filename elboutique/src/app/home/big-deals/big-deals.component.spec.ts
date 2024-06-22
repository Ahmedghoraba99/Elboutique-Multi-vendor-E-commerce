import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BigDealsComponent } from './big-deals.component';

describe('BigDealsComponent', () => {
  let component: BigDealsComponent;
  let fixture: ComponentFixture<BigDealsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BigDealsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BigDealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
