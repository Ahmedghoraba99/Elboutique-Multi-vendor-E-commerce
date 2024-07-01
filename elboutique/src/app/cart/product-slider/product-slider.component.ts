import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductDetailsService } from '../../service/product-details.service';
import { NgFor } from '@angular/common';
import Swiper from 'swiper';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';

@Component({
  selector: 'app-product-slider',
  standalone: true,
  imports: [NgFor],
  templateUrl: './product-slider.component.html',
  styleUrls: ['./product-slider.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductSliderComponent implements AfterViewInit {
  @ViewChild('mainSwiper') mainSwiperRef: ElementRef | undefined;
  @ViewChild('thumbsSwiper') thumbsSwiperRef: ElementRef | undefined;
  productImages: any[] = [];
  id: number = 0;
  mainSwiper: Swiper | undefined;
  thumbsSwiper: Swiper | undefined;

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
        this.initSwipers();
      });
    });
  }

  ngAfterViewInit(): void {
    this.initSwipers();
  }

  initSwipers() {
    if (this.thumbsSwiper) {
      this.thumbsSwiper.destroy(true, true);
    }
    if (this.mainSwiper) {
      this.mainSwiper.destroy(true, true);
    }

    this.thumbsSwiper = new Swiper(this.thumbsSwiperRef?.nativeElement, {
      spaceBetween: 10,
      slidesPerView: 3,
      direction: 'vertical',
      modules: [Navigation],
      watchSlidesProgress: true,
    });

    this.mainSwiper = new Swiper(this.mainSwiperRef?.nativeElement, {
      spaceBetween: 10,
      thumbs: {
        swiper: this.thumbsSwiper,
      },
      modules: [Pagination, Thumbs],
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
  }

  trackByImage(index: number, image: string): string {
    return image;
  }
}