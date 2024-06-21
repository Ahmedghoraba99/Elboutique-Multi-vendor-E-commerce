import { Component } from '@angular/core';
import { ProductInformationComponent } from './product-information/product-information.component';
import { DetailsComponent } from './details/details.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { SimilarproductComponent } from './similarproduct/similarproduct.component';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [ProductInformationComponent , DetailsComponent , ReviewsComponent , SimilarproductComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

}
