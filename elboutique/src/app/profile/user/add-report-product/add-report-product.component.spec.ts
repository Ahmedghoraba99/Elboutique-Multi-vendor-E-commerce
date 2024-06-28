import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReportProductComponent } from './add-report-product.component';

describe('AddReportProductComponent', () => {
  let component: AddReportProductComponent;
  let fixture: ComponentFixture<AddReportProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddReportProductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddReportProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
