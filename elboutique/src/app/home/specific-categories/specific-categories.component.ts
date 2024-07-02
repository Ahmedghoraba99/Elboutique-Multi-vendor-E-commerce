import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { HomeService } from '../../service/home.service';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-specific-categories',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink],
  templateUrl: './specific-categories.component.html',
  styleUrl: './specific-categories.component.css',
})
export class SpecificCategoriesComponent implements OnInit, OnDestroy {
  SpecificCategoriesSubscription!: Subscription;
  categories: any[] = [];
  homeService: HomeService = inject(HomeService);

  constructor() {}
  ngOnInit(): void {
    this.SpecificCategoriesSubscription = this.homeService
      .getAllCategories()
      .subscribe((data) => {
        this.categories = data.data;
      });
  }
  ngOnDestroy(): void {
    if (this.SpecificCategoriesSubscription) {
      this.SpecificCategoriesSubscription.unsubscribe();
    }
  }
}
