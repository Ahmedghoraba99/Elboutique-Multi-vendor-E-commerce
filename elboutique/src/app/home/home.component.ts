import { Component } from '@angular/core';
import { HomeSliderComponent } from './home-slider/home-slider.component';
import { OffersComponent } from './offers/offers.component';
import { BigDealsComponent } from './big-deals/big-deals.component';
import { ShopNowComponent } from './shop-now/shop-now.component';
import { ProductsComponent } from './products/products.component';
import { CategoriesComponent } from './categories/categories.component';
import { SpecificCategoriesComponent } from './specific-categories/specific-categories.component';
import { CategoriesSectionComponent } from './categories-section/categories-section.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ HomeSliderComponent,OffersComponent ,BigDealsComponent ,CategoriesSectionComponent ,ShopNowComponent ,ProductsComponent,CategoriesComponent ,SpecificCategoriesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
