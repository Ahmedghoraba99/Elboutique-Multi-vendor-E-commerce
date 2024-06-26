import { Component } from '@angular/core';
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
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbPaginationModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  products: any[] = [];
  categories: any[] = [];
  vendors: any[] = [];
  page = 1;
  pageSize = 10;
  totalItems = 0;
  paginationLinks: any[] = [];

  selectedProduct: any = {};
  images: File[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private vendorService: VendorService,
    private modalService: NgbModal
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
        this.totalItems = response.total;
        this.paginationLinks = response.links;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      },
    });
  }

  deleteProduct(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(id).subscribe({
          next: () => {
            this.getProducts();
            Swal.fire('Deleted!', 'Product has been deleted.', 'success');
          },
          error: () => {
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

  open(content: any, product: any = null): void {
    if (product) {
      this.selectedProduct = { ...product };
    } else {
      this.selectedProduct = {};
    }

    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          console.log(`Closed with: ${result}`);
        },
        (reason) => {
          console.log(`Dismissed ${this.getDismissReason(reason)}`);
        }
      );
  }

  saveProduct(): void {
    const formData = new FormData();
    formData.append('name', this.selectedProduct.name);
    formData.append('description', this.selectedProduct.description);
    formData.append('price', this.selectedProduct.price);
    formData.append('stock', this.selectedProduct.stock);
    formData.append('category_id', this.selectedProduct.category_id);
    formData.append('vendor_id', this.selectedProduct.vendor_id);
    formData.append('is_featured', this.selectedProduct.is_featured);
    formData.append('sale', this.selectedProduct.sale);
    formData.append('deleted_at', this.selectedProduct.deleted_at);
    formData.append('created_at', this.selectedProduct.created_at);
    formData.append('updated_at', this.selectedProduct.updated_at);

    for (const image of this.images) {
      formData.append('images[]', image);
    }

    if (this.selectedProduct.id) {
      this.productService
        .updateProduct(this.selectedProduct.id, formData)
        .subscribe({
          next: () => {
            this.getProducts();
            this.modalService.dismissAll();
            Swal.fire('Updated!', 'Product has been updated.', 'success');
          },
          error: (error) => {
            console.error('Error updating product:', error);
            Swal.fire(
              'Error!',
              'There was an error updating the product.',
              'error'
            );
          },
        });
    } else {
      this.productService.addProduct(formData).subscribe({
        next: () => {
          this.getProducts();
          this.modalService.dismissAll();
          Swal.fire('Added!', 'Product has been added.', 'success');
        },
        error: (error) => {
          console.error('Error adding product:', error);
          Swal.fire(
            'Error!',
            'There was an error adding the product.',
            'error'
          );
        },
      });
    }
  }

  onImageChange(event: any): void {
    const files = event.target.files;
    this.images = [];
    for (const file of files) {
      this.images.push(file);
    }
  }

  loadPage(page: number): void {
    this.page = page;
    this.getProducts();
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  private getCategoryName(categoryId: number): string {
    const category = this.categories.find((cat) => cat.id === categoryId);
    return category ? category.name : '-';
  }

  private getVendorName(vendorId: number): string {
    const vendor = this.vendors.find((ven) => ven.id === vendorId);
    return vendor ? vendor.name : '-';
  }
}
