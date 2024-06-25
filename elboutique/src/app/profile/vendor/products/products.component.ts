import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';
declare const bootstrap: any;

@Component({
  selector: 'app-vendor-products',
  standalone: true,
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  categories: string[] = ['Electronics', 'Clothing', 'Home Appliances'];
  editingIndex: number | null = null;
  isEditing: boolean = false;

  productForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: [
        '',
        [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{1,2})?$')],
      ],
      category: ['', Validators.required],
      quantity: ['', Validators.required],
      stock: ['', Validators.required],
    });
  }
  ngOnInit() {
    this.products = [
      {
        name: 'Product 1',
        price: 299.99,
        category: 'Electronics',
        quantity: 50,
        stock: 'In Stock',
      },
      {
        name: 'Product 2',
        price: 49.99,
        category: 'Clothing',
        quantity: 200,
        stock: 'Out of Stock',
      },
      {
        name: 'Product 3',
        price: 199.99,
        category: 'Home Appliances',
        quantity: 30,
        stock: 'In Stock',
      },
    ];
  }
  onSubmit() {
    if (this.productForm.valid) {
      const formData = this.productForm.value;
      if (this.isEditing && this.editingIndex !== null) {
        console.log('Edited Product Data:', formData);
        // post edited product data here
        this.products[this.editingIndex] = formData;
      } else {
        console.log('New Product Data:', formData);
        // post new product data here
        this.products.push(formData);
      }
      this.productForm.reset();
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
