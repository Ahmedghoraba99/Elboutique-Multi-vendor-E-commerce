import { Component } from '@angular/core';
import { ProductSliderComponent } from '../product-slider/product-slider.component';
@Component({
  selector: 'app-product-information',
  standalone: true,
  imports: [ProductSliderComponent],
  templateUrl: './product-information.component.html',
  styleUrl: './product-information.component.css'
})
export class ProductInformationComponent {

}
