import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { CategoryService } from '../../service/admin/category.service';
import {
  NgbModal,
  ModalDismissReasons,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbPaginationModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
})
export class CategoryComponent {
  categories: any[] = [];
  page = 1;
  pageSize = 10;
  totalItems = 0;
  paginationLinks: any[] = [];
  selectedCategory: any = {};
  loading = true;

  constructor(
    private categoryService: CategoryService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(): void {
    this.categoryService.getCategories(this.page, this.pageSize).subscribe({
      next: (response) => {
        this.categories = response.data;
        this.totalItems = response.total;
        this.paginationLinks = response.links;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;

        console.error('Error fetching categories:', error);
      },
    });
  }

  deleteCategory(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteCategory(id).subscribe({
          next: () => {
            this.getCategories();
            Swal.fire('Deleted!', 'Category has been deleted.', 'success');
          },
          error: () => {
            Swal.fire(
              'Error!',
              'There was an error deleting the category.',
              'error'
            );
          },
        });
      }
    });
  }

  open(content: any, category: any = null): void {
    if (category) {
      this.selectedCategory = { ...category };
    } else {
      this.selectedCategory = {};
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

  saveCategory(): void {
    if (this.selectedCategory.id) {
      this.categoryService.editCategory(this.selectedCategory).subscribe({
        next: () => {
          this.getCategories();
          this.modalService.dismissAll();
        },
        error: (error) => {
          console.error('Error editing category:', error);
        },
      });
    } else {
      this.categoryService.addCategory(this.selectedCategory).subscribe({
        next: () => {
          this.getCategories();
          this.modalService.dismissAll();
        },
        error: (error) => {
          console.error('Error adding category:', error);
        },
      });
    }
  }

  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedCategory.image = input.files[0];
    }
  }

  loadPage(page: number): void {
    this.page = page;
    this.getCategories();
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
}
