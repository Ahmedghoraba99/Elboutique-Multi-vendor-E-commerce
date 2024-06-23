import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CongsComponent } from './congs.component';

describe('CongsComponent', () => {
  let component: CongsComponent;
  let fixture: ComponentFixture<CongsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CongsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CongsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
