import { Component, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { ProductService } from '../../service/admin/product.service';
import { VendorService } from '../../service/admin/vendor.service';
import { CategoryService } from '../../service/admin/category.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbPaginationModule,
    FileUploadModule,
    TableModule,
    ToastModule,
    ToolbarModule,
    DialogModule,
    DropdownModule,
    ConfirmDialogModule,
    InputTextModule,
    ProgressSpinnerModule,
    RouterLink,
    RouterOutlet,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  @ViewChild('dt') dt: Table | undefined;

  loading: boolean = false;
  products: any[] = [];
  categories: any[] = [];
  vendors: any[] = [];
  product: any = {};
  selectedProducts: any[] = [];
  page = 1;
  pageSize = 16;
  totalItems = 0;
  paginationLinks: any[] = [];
  selectedProduct: any;
  displayDialog = false;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private vendorService: VendorService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getCategoriesAndVendors(() => {
      this.getProducts();
    });
  }
  getCategoriesAndVendors(callback: () => void): void {
    let categoriesLoaded = false;
    let vendorsLoaded = false;
    this.loading = true;

    // Fetch categories
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
        categoriesLoaded = true;
        if (vendorsLoaded) {
          this.loading = false;
          callback();
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Error fetching categories:', error);
      },
    });

    // Fetch vendors
    this.vendorService.getVendors().subscribe({
      next: (response) => {
        this.vendors = response.data;
        vendorsLoaded = true;
        if (categoriesLoaded) {
          this.loading = false;
          callback();
        }
      },
      error: (error) => {
        console.error('Error fetching vendors:', error);
      },
    });
  }

  getProducts(): void {
    this.productService.getProducts(this.page, this.pageSize).subscribe({
      next: (response) => {
        this.products = response.data.map((product: any) => ({
          ...product,
          categoryName: this.getCategoryName(product.category_id),
          vendorName: this.getVendorName(product.vendor_id),
        }));
        this.totalItems = response.total;
        this.paginationLinks = response.links;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      },
    });
  }
  getProduct(id: number): void {
    this.productService.getProduct(id).subscribe((product) => {
      this.selectedProduct = product;
      this.displayDialog = true;
    });
  }
  showProductDialog(product: any): void {
    this.selectedProduct = this.getProduct(product.id);
    console.log(this.selectedProduct);
  }
  deleteProduct(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this product?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(id).subscribe({
          next: () => {
            this.getProducts();
            Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
          },
          error: (error) => {
            console.error('Error deleting product:', error);
            Swal.fire(
              'Error!',
              'There was an error deleting the product.',
              'error'
            );
          },
        });
      }
    });
  }

  onFilter(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.dt?.filterGlobal(inputElement.value, 'contains');
  }
  getCategoryName(categoryId: number): string {
    const category = this.categories.find((cat) => cat.id === categoryId);
    return category ? category.name : '-';
  }

  private getVendorName(vendorId: number): string {
    const vendor = this.vendors.find((ven) => ven.id === vendorId);
    return vendor ? vendor.name : '-';
  }

  loadPage(page: number): void {
    this.page = page;
    this.getProducts();
  }
}
