import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HomeService } from '../../service/home.service';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-shop-now',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './shop-now.component.html',
  styleUrl: './shop-now.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ShopNowComponent implements OnInit, OnDestroy {
  categories: any[] = [];
  sub: Subscription | null = null;
  constructor(private HomeService: HomeService) {}

  ngOnInit(): void {
    this.sub = this.HomeService.getAllCategories().subscribe((items) => {
      this.categories = items.data;
    });
  }
  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
