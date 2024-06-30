import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Product, Category } from '../../../../_model/category';
import { ProductDetailsService } from '../../../../service/product-details.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { VendorCatgoriesService } from '../../../../service/vendor/categories.service';
import { VendorAddProductService } from '../../../../service/vendor/product.service';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css'],
})
export class UpdateProductComponent implements OnInit {
  productForm: FormGroup;
  selectedFiles: File[] = [];
  imagePreviews: string[] = [];
  product!: Product;
  categories!: Category[];
  private productId!: number;

  constructor(
    private fb: FormBuilder,
    private productDetailsService: ProductDetailsService,
    private router: ActivatedRoute,
    private vendorAddProductService: VendorAddProductService,
    private vendorCategoriesService: VendorCatgoriesService,
    private route: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      stock: ['', Validators.required],
      attributes: this.fb.array([]),
    });
  }

  get attributes(): FormArray {
    return this.productForm.get('attributes') as FormArray;
  }

  createAttributeGroup(attribute?: any): FormGroup {
    return this.fb.group({
      name: [attribute ? attribute.name : '', Validators.required],
      value: [attribute ? attribute.value : '', Validators.required],
    });
  }

  addAttribute(attribute?: any): void {
    this.attributes.push(this.createAttributeGroup(attribute));
  }

  removeAttribute(index: number): void {
    this.attributes.removeAt(index);
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files);
      this.imagePreviews = [];

      this.selectedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });

      this.productForm.patchValue({
        images: this.selectedFiles,
      });
    }
  }

  async showSuccessAlert(): Promise<any> {
    return Swal.fire({
      title: 'Success!',
      text: 'Product has been updated successfully.',
      icon: 'success',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Go to Products',
    });
  }

  async showErrorAlert(): Promise<any> {
    return Swal.fire({
      title: 'Error!',
      text: 'Failed to update product. Please try again later.',
      icon: 'error',
      confirmButtonColor: '#d33',
      confirmButtonText: 'OK',
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.router.params.subscribe((params) => {
      const id = +params['id'];
      this.productDetailsService.getProduct(id).subscribe((product) => {
        console.log(product);
        this.product = product;
        this.productId = product.id;
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category_id,
          stock: product.stock,
        });

        this.imagePreviews = product.images.map((img: any) => img.image_url);
        this.selectedFiles = product.images.length;
        product.attributes.forEach((attribute: any) => {
          this.addAttribute(attribute);
        });
      });
    });
  }

  loadCategories() {
    this.vendorCategoriesService.getCategories().subscribe(
      (response) => {
        this.categories = response.data;
      },
      (error) => {
        console.error('Error loading categories:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const formData = new FormData();
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
      if (Array.isArray(this.selectedFiles) && this.selectedFiles.length > 0) {
        this.selectedFiles.forEach((file, index) => {
          formData.append(`images[${index}]`, file);
        });
      }

      this.vendorAddProductService
        .updateProductVendor(this.productId, formData)
        .subscribe(
          async (response) => {
            const result = await this.showSuccessAlert();
            if (result.isConfirmed) {
              const isAdmin =
                JSON.parse(localStorage.getItem('user_info') || '{}').role ==
                'admin';
              if (isAdmin) {
                this.route.navigate([`/dashboard/products`]);
              } else {
                this.route.navigate(['/v/products']);
              }
            }
          },
          async (error) => {
            console.error('Error updating product:', error);
            await this.showErrorAlert();
          }
        );
    }
  }
}
