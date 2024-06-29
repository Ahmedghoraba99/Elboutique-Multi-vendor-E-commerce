import { Component, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { ProductService } from '../../service/admin/product.service';
import { VendorService } from '../../service/admin/vendor.service';
import { CategoryService } from '../../service/admin/category.service';
import {
  NgbModal,
  ModalDismissReasons,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
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
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  @ViewChild('dt') dt: Table | undefined;

  products: any[] = [];
  categories: any[] = [];
  vendors: any[] = [];
  productDialog: boolean = false;
  selectedProducts: any[] = [];
  product: any = {};
  submitted: boolean = false;
  page = 1;
  pageSize = 10;
  totalItems = 0;
  images: File[] = [];
  statuses: any[] = [
    { label: 'INSTOCK', value: 'instock' },
    { label: 'LOWSTOCK', value: 'lowstock' },
    { label: 'OUTOFSTOCK', value: 'outofstock' },
  ];

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

    // Fetch categories
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
        categoriesLoaded = true;
        if (vendorsLoaded) {
          callback();
        }
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      },
    });

    // Fetch vendors
    this.vendorService.getVendors().subscribe({
      next: (response) => {
        this.vendors = response.data;
        vendorsLoaded = true;
        if (categoriesLoaded) {
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
        console.log(this.products);

        this.totalItems = response.total;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      },
    });
  }

  openNew() {
    this.product = {};
    this.submitted = false;
    this.productDialog = true;
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  saveProduct() {
    this.submitted = true;

    if (this.product.name.trim()) {
      if (this.product.id) {
        this.productService
          .updateProduct(this.product.id, this.product)
          .subscribe(() => {
            this.getProducts();
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Product Updated',
              life: 3000,
            });
          });
      } else {
        this.productService.addProduct(this.product).subscribe(() => {
          this.getProducts();
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Product Created',
            life: 3000,
          });
        });
      }

      this.products = [...this.products];
      this.productDialog = false;
      this.product = {};
    }
  }

  editProduct(product: any) {
    this.product = { ...product };
    this.productDialog = true;
  }

  deleteProduct(id: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this product?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productService.deleteProduct(id).subscribe(() => {
          this.getProducts();
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Product Deleted',
            life: 3000,
          });
        });
      },
    });
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let ids = this.selectedProducts.map((product) => product.id);
        this.productService.deleteProducts(ids).subscribe(() => {
          this.getProducts();
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Products Deleted',
            life: 3000,
          });
        });
        this.selectedProducts = [];
      },
    });
  }

  onFilter(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.dt?.filterGlobal(inputElement.value, 'contains');
  }
  private getCategoryName(categoryId: number): string {
    const category = this.categories.find((cat) => cat.id === categoryId);
    return category ? category.name : '-';
  }

  private getVendorName(vendorId: number): string {
    const vendor = this.vendors.find((ven) => ven.id === vendorId);
    return vendor ? vendor.name : '-';
  }

  onImageChange(event: any) {
    for (let file of event.files) {
      this.images.push(file);
    }
  }
}
