import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductDetailsService } from '../../service/product-details.service';
import { NgFor } from '@angular/common';
import Swiper from 'swiper';

@Component({
  selector: 'app-product-slider',
  standalone: true,
  imports: [NgFor],
  templateUrl: './product-slider.component.html',
  styleUrls: ['./product-slider.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductSliderComponent implements AfterViewInit {
  @ViewChild('swiperContainer') swiperContainer: ElementRef | undefined;

  productImages: any[] = [];
  id: number = 0;
  swiper: Swiper | undefined;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductDetailsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = +params['id'];
      this.productService.getProduct(this.id).subscribe((product) => {
        this.productImages = product.images.map(
          (image: { image: string }) =>
            'http://localhost:8000/storage/' + image.image
        );
        console.log(this.productImages);
        this.initSwiper();
      });
    });
  }

  ngAfterViewInit(): void {
    this.initSwiper();
  }

  initSwiper() {
    if (this.swiper) {
      this.swiper.destroy(true, true);
    }
    this.swiper = new Swiper(this.swiperContainer?.nativeElement, {
      spaceBetween: 20,
      slidesPerView: 3,
      direction: 'vertical',
    });
  }

  trackByImage(index: number, image: string): string {
    return image;
  }
}
