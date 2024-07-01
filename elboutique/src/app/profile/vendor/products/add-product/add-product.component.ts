import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { VendorAddProductService } from '../../../../service/vendor/product.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { VendorCatgoriesService } from '../../../../service/vendor/categories.service';
import { Category } from '../../../../_model/category';


@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;
  selectedFiles: File[] = [];
  errorMessage: string = '';
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private vendorAddProductService: VendorAddProductService,
    private router: Router,
    private categoryService: VendorCatgoriesService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      stock: ['', Validators.required],
      // image: [null, Validators.required],
      attributes: this.fb.array([this.createAttributeGroup()]),
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  get attributes(): FormArray {
    return this.productForm.get('attributes') as FormArray;
  }

  createAttributeGroup(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      value: ['', Validators.required],
    });
  }

  addAttribute(): void {
    this.attributes.push(this.createAttributeGroup());
  }

  removeAttribute(index: number): void {
    this.attributes.removeAt(index);
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files);
      this.productForm.patchValue({
        images: this.selectedFiles,
      });
    }
  }

  async showSuccessAlert(): Promise<any> {
    return Swal.fire({
      title: 'Success!',
      text: 'Product has been added successfully.',
      icon: 'success',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Go to Products',
    });
  }

  async showErrorAlert(error: string): Promise<any> {
    return Swal.fire({
      title: 'Error!',
      text: error,
      icon: 'error',
      confirmButtonColor: '#d33',
      confirmButtonText: 'OK',
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(
      (response) => {
        this.categories = response.data;
        console.log(this.categories);
      },
      (error) => {
        this.errorMessage = error.errorMessage;
      }
    );
  }

  onSubmit() {
    if (this.selectedFiles.length < 0) {
      this.errorMessage = 'you must upload image for product';
      return;
    }
    if (this.productForm.valid) {
      const formData: FormData = new FormData();

      formData.append('name', this.productForm.get('name')?.value);
      formData.append(
        'description',
        this.productForm.get('description')?.value
      );
      formData.append('price', this.productForm.get('price')?.value);
      formData.append('category_id', this.productForm.get('category')?.value);
      formData.append(
        'vendor_id',
        JSON.parse(localStorage.getItem('user_info') || '{}').id
      );
      formData.append('stock', this.productForm.get('stock')?.value);

      // Append attributes
      const attributesArray = this.productForm.get('attributes') as FormArray;
      attributesArray.controls.forEach((group, index) => {
        formData.append(`attributes[${index}][name]`, group.get('name')?.value);
        formData.append(
          `attributes[${index}][value]`,
          group.get('value')?.value
        );
      });

      // Append images
      this.selectedFiles.forEach((file, index) => {
        formData.append(`images[${index}]`, file);
      });

      this.vendorAddProductService.addProductVendor(formData).subscribe(
        async (response) => {
          console.log('Product added successfully:', response);
          this.productForm.reset();
          this.selectedFiles = [];
          const result = await this.showSuccessAlert();
          if (result.isConfirmed) {
            const isAdmin =
              JSON.parse(localStorage.getItem('user_info') || '{}').role ==
              'admin';
            if (isAdmin) {
              this.router.navigate([`/dashboard/products`]);
            } else {
              this.router.navigate([`/v/products`]);
            }
          }
        },
        async (error) => {
          this.errorMessage = error.errorMessage;
          await this.showErrorAlert(this.errorMessage);
        }
      );
    }
  }
}
