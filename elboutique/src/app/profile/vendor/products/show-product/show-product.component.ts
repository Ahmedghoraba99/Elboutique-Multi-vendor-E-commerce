import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category,Product  } from '../../../../_model/category';
import { ITag } from '../../../../_model/tag';
import { VendorCatgoriesService } from '../../../../service/vendor/categories.service';
import {ProductDetailsService} from '../../../../service/product-details.service';
import { TagesService } from '../../../../service/tages.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-show-product',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './show-product.component.html',
  styleUrl: './show-product.component.css'
})
export class ShowProductComponent implements OnInit{

  categories: Category[] = [];
  product: Product = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    category: { id: 0, name: '' },
    images: [],
    attributes: [],
    tages: [],
    stock: 0,
    sale:0
  };
  tages:ITag[] = [];
  errorMessage: string = '';


  constructor(
    private router: ActivatedRoute,
    private route: Router,
    private categoryService: VendorCatgoriesService,
    private productService: ProductDetailsService,
    private tageSevice:TagesService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProductById();
    this.loadTages();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(
      (response) => {
        this.categories = response.data;
      },
      (error) => {
        this.errorMessage = error.errorMessage;
      }
    );
  }

  loadProductById(){
    this.router.params.subscribe((params) => {
      const id = +params['id'];
      this.productService.getProduct(id).subscribe(
        (response) => {
          this.product = response;
        },
        (error) => {
          alert(error.errorMessage);
        }
      )
    });
  }

  loadTages(){
    this.router.params.subscribe(
      (params)=>{
        const id = +params['id'];
        this.tageSevice.getTagesByProductId(id).subscribe
        (
          (response)=>{
            this.tages = response;
          },
          (error)=>{
            alert( error.errorMessage);
          }
        )
      }
    )
  }

}
