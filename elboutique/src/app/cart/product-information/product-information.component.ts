import { Component, Inject } from '@angular/core';
import { ProductSliderComponent } from '../product-slider/product-slider.component';
import { ProductDetailsService } from '../../service/product-details.service';
import { ActivatedRoute } from '@angular/router';
import { NgClass, NgFor, NgIf } from '@angular/common';
@Component({
  selector: 'app-product-information',
  standalone: true,
  imports: [ProductSliderComponent, NgIf, NgClass, NgFor],
  templateUrl: './product-information.component.html',
  styleUrl: './product-information.component.css',
})
export class ProductInformationComponent {
  constructor(
    private route: ActivatedRoute,
    private productService: ProductDetailsService // Inject the service in the constructor
  ) {}
  product: any = {};
  id: number = 0;
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = +params['id']; // Convert the id to a number
      this.productService.getProduct(this.id).subscribe((product) => {
        this.product = product;
      });
    });
  }
}
