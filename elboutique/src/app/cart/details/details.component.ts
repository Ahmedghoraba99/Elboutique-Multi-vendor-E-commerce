import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ProductDetailsService } from '../../service/product-details.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent {
  constructor(
    private productService: ProductDetailsService,
    private route: ActivatedRoute
  ) {}
  product: any = {};
  id = 0;
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = +params['id'];
      this.productService.getProduct(this.id).subscribe((product) => {
        this.product = product;
      });
    });
  }
}
