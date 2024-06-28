import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { VendorProdcutService } from '../../../service/vendor/productdata.service';
import { VendorCatgoriesService } from '../../../service/vendor/categories.service';
import { VendorAddProductService } from '../../../service/vendor/product.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
declare const bootstrap: any;

@Component({
  selector: 'app-vendor-products',
  standalone: true,
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: any[] = [];
  categories: any[] = [];
  editingIndex: number | null = null;
  isEditing: boolean = false;
  subscriptions: Subscription[] = [];
  userInfo: string | null = localStorage.getItem('user_info');
  user_id: number = 0;
  productForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private VendorProdcutService: VendorProdcutService,
    private VendorAddProductService: VendorAddProductService,
    private vendorCatgoriesService: VendorCatgoriesService
  ) {
    if (this.userInfo) {
      try {
        const parsedUserInfo = JSON.parse(this.userInfo);
        this.user_id = parsedUserInfo.id;
      } catch (error) {
        console.error('Error parsing user info from local storage', error);
      }
    }

    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{1,2})?$')]],
      category: ['', Validators.required],
      quantity: ['', Validators.required],
      stock: ['', Validators.required],
      material: ['', Validators.required],
      materialDescription: ['', Validators.required],
      images: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const files = event.target.files;
      this.productForm.patchValue({
        images: files
      });
    }
  }

  loadCategories() {
    const sub = this.vendorCatgoriesService.getCategories().subscribe(
      response => {
        this.categories = response.data;
        console.log(this.categories);
      },
      error => {
        console.error('Error loading categories:', error);
      }
    );
    this.subscriptions.push(sub);
  }

  loadProducts() {
    const sub = this.VendorProdcutService.getVendorProducts(this.user_id).subscribe(
      data => {
        this.products = data;
        console.log(`the respnse:`);
        console.log(this.products);
      },
      error => {
        console.error('Error loading products:', error);
      }
    );
    this.subscriptions.push(sub);
  }

  onSubmit() {
    if (this.productForm.valid) {
      const formData = new FormData();
      formData.append('name', this.productForm.get('name')?.value);
      formData.append('description', this.productForm.get('description')?.value);
      formData.append('price', this.productForm.get('price')?.value);
      formData.append('category_id', this.productForm.get('category')?.value);
      formData.append('vendor_id', this.user_id.toString());
      formData.append('stock', this.productForm.get('quantity')?.value);
      formData.append('attributes[0][name]', this.productForm.get('material')?.value);
      formData.append('attributes[0][value]', this.productForm.get('materialDescription')?.value);
  
      const images = this.productForm.get('images')?.value;
      for (let i = 0; i < images.length; i++) {
        formData.append(`images[${i}]`, images[i]);
      }
  
      if (this.isEditing && this.editingIndex !== null) {
        // Update product logic
        console.log('Edited Product Data:', formData);
        // Assume updateProductVendor is the method to call for editing products
        this.VendorAddProductService.updateProductVendor(this.products[this.editingIndex].id, formData).subscribe(
          response => {
            console.log('Product updated successfully:', response);
            this.products[this.editingIndex!] = response; // The non-null assertion operator '!' ensures that TypeScript treats this.editingIndex as non-null
            this.productForm.reset();
          },
          error => {
            console.error('Error updating product:', error);
          }
        );
      } else {
        console.log(formData);
        this.VendorAddProductService.addProductVendor(formData).subscribe(
          response => {
            console.log('Product added successfully:', response);
            this.products.push(response);
            this.productForm.reset();
          },
          error => {
            console.error('Error adding product:', error);
          }
        );
      }
  
      this.isEditing = false;
      this.editingIndex = null;
    }
  }
  
  editProduct(index: number) {
    this.editingIndex = index;
    const product = this.products[index];
    this.productForm.patchValue(product);
    this.isEditing = true;
    const modalElement = document.getElementById('addProductModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
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
    this.products.splice(index, 1);
  }
}