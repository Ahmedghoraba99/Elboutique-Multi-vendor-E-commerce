import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishListContentComponent } from './wish-list-content.component';

describe('WishListContentComponent', () => {
  let component: WishListContentComponent;
  let fixture: ComponentFixture<WishListContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishListContentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WishListContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
