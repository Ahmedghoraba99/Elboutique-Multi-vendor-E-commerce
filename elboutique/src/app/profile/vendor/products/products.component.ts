import { CommonModule } from '@angular/common';
import { Component, OnInit, } from '@angular/core';
import { VendorProdcutService } from '../../../service/vendor/productdata.service';
import { VendorCatgoriesService } from '../../../service/vendor/categories.service';
import { VendorAddProductService } from '../../../service/vendor/product.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router, RouterLink } from '@angular/router';
import { AddSaleComponent } from './add-sale/add-sale.component';
import { TageProductComponent } from './tage-product/tage-product.component';
import { AuthService } from '../../../service/auth.service';
import { VendorPortofolioService } from '../../../service/vendor-portofolio.service';
import { CurrentUser } from '../../../_model/customer';


@Component({
  selector: 'app-vendor-products',
  standalone: true,
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  imports: [CommonModule, FormsModule,ReactiveFormsModule,RouterLink,AddSaleComponent,TageProductComponent],
})
export class ProductsComponent implements OnInit{
  products: any[] = [];
  categories: any[] = [];
  filteredProducts: any[] = [];
  searchTerm: string = '';
  editingIndex: number | null = null;
  userInfo: string | null = localStorage.getItem('user_info');
  user_id: number = 0;
  product_id: number = 0;
  active:boolean = false;
  currentVendor: CurrentUser={
    data:{
      active: ''
    }
  } ;
  constructor(
    private VendorProdcutService: VendorProdcutService,
    private VendorAddProductService: VendorAddProductService,
    private vendorCatgoriesService: VendorCatgoriesService,
    private router: Router,
    private currentUserService:VendorPortofolioService
  ) {
    if (this.userInfo) {
      try {
        const parsedUserInfo = JSON.parse(this.userInfo);
        this.user_id = parsedUserInfo.id;
      } catch (error) {
        console.error('Error parsing user info from local storage', error);
      }
    }

  }


  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
    this.loadCurrentVendor(this.user_id);
  }

  loadCurrentVendor(vendorId: number): void {
    this.currentUserService.getCurrentVendor(vendorId).subscribe(
      (response) => {
        this.currentVendor = response;
      },
      (error) => {
        console.error('Error fetching vendor data', error);
      }
    );
  }




  loadCategories() {
    this.vendorCatgoriesService.getCategories().subscribe(
      response => {
        this.categories = response.data;
        // console.log(this.categories);
      },
      error => {
        console.error('Error loading categories:', error);
      }
    );
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  }

  loadProducts() {
  this.VendorProdcutService.getVendorProducts(this.user_id).subscribe(
      response => {
        this.products = response.data;
        this.filteredProducts = this.products;
        // console.log(`the respnse:`);
        // console.log(this.products);
      },
      error => {
        console.error('Error loading products:', error);
      }
    );
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  async confirmDelete(index: number) {
    const result = await this.showSweetAlert();
    if (result.isConfirmed) {
      this.deleteProduct(index);
      Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
    }
  }

  async showSweetAlert(): Promise<any> {
    return Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
      reverseButtons: true,
    });
  }


  deleteProduct(index: number) {
    this.VendorAddProductService.deleteProdcutVendor(index).subscribe(
      data=>{
        console.log(data);
        this.loadProducts();
      }
    )
  }

  changeProductId(id:number){
    this.product_id = id;
    console.log(this.product_id);
  }

  navigateToAddProduct(){
    console.log(this.currentVendor.data.active);
    if(this.currentVendor.data.active === 'true'){
      this.router.navigate(['/v/products', 'add']);
    }else{
      //add Error sweet alert
      Swal.fire({
        icon: 'error',
        title: 'Inactive Vendor',
        text: 'You cannot add a new product because your account is inactive.',
        confirmButtonText: 'OK'
      });
    }
  }

  navigateToProductPage(route: string, productId: number): void{
    if (this.currentVendor.data.active === 'true') {
      this.router.navigate([route, productId]);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Inactive Vendor',
        text: 'You cannot perform this action because your account is inactive.',
        confirmButtonText: 'OK'
      });
    }
  }

}
