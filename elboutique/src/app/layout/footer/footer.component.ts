import { Component, inject } from '@angular/core';
import { HomeService } from '../../service/home.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  categories: any[] = [];
  homeService: HomeService = inject(HomeService);
  categorySubscription: any;

  constructor() {}
  ngOnInit(): void {
    this.categorySubscription = this.homeService
      .getAllCategories()
      .subscribe((data) => {
        this.categories = data.data;
      });
  }
  ngOnDestroy(): void {
    this.categorySubscription.unsubscribe();
  }
}
