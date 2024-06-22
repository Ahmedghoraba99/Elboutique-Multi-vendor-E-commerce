import { Component, inject } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HomeService } from '../../service/home.service';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-big-deals',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink],
  templateUrl: './big-deals.component.html',
  styleUrl: './big-deals.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BigDealsComponent {
  homeService: HomeService = inject(HomeService);

  products: any[] = [];
  ngOnInit(): void {
    this.homeService.getOnSaleProducts().subscribe((data) => {
      this.products = data;
    });
  }

  constructor() {}
}
