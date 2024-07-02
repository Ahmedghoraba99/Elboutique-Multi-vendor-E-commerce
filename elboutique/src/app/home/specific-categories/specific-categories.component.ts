import { NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HomeService } from '../../service/home.service';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-specific-categories',
  standalone: true,
  imports: [NgFor, NgIf ,RouterLink],
  templateUrl: './specific-categories.component.html',
  styleUrl: './specific-categories.component.css',
})
export class SpecificCategoriesComponent {
  categories: any[] = [];
  homeService: HomeService = inject(HomeService);

  constructor() {}
  ngOnInit(): void {
    this.homeService.getAllCategories().subscribe((data) => {
      this.categories = data.data;
    });
  }
}
