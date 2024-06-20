import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificCategoriesComponent } from './specific-categories.component';

describe('SpecificCategoriesComponent', () => {
  let component: SpecificCategoriesComponent;
  let fixture: ComponentFixture<SpecificCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecificCategoriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpecificCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
