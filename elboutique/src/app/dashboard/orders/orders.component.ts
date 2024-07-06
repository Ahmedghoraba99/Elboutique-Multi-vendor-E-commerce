import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { OrderService } from '../../service/admin/order.service';
import { CustomerService } from '../../service/admin/customer.service';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProgressSpinnerModule,
    TableModule,
    DropdownModule,
    ConfirmDialogModule,
    InputTextModule,
    DialogModule,
    ToolbarModule,
    NgbPaginationModule,
  ],
})
export class OrdersComponent implements OnInit, OnDestroy {
  @ViewChild('orderForm') orderForm!: any;
  @ViewChild('dt') dt!: any;
  selectedOrders = [];
  orders: any[] = [];
  customers: any[] = [];
  statuses: any[] = [
    { label: 'Midway', value: 'midway' },
    { label: 'Arrived', value: 'arrived' },
    { label: 'Returned', value: 'returned' },
  ];
  editOrder: any = { id: null, customer_id: '', status: '', total: '' };
  validationErrors: any = {};
  loading = true;
  totalItems = 0;
  page = 1;
  pageSize = 10;
  private orderSubscriptions: Subscription[] = [];
  constructor(
    private orderService: OrderService,
    private customerService: CustomerService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderSubscriptions.push(
      this.orderService.getOrders().subscribe({
        next: (response: any) => {
          this.orders = response.data.map((order: any) => {
            order.customer_name = this.getCustomerName(order.customer_id);
            return order;
          });
          this.totalItems = response.total;
          this.loading = false;
        },
        error: (error: any) => console.error('Error loading orders', error),
      })
    );
  }

  loadCustomers(): void {
    this.orderSubscriptions.push(
      this.customerService.getCustomers().subscribe({
        next: (response: any) => {
          this.customers = response;
          this.loading = false;
          this.customers = response.map((customer: any) => {
            return { name: customer.name, id: customer.id };
          });
        },
        error: (error: any) => console.error('Error loading customers', error),
      })
    );
  }

  getCustomerName(customerId: number): string {
    const customer = this.customers.find((c) => c.id == customerId);
    return customer ? customer.name : 'Unknown';
  }

  updateOrder(): void {
    this.orderSubscriptions.push(
      this.orderService
        .updateOrder(this.editOrder.id, this.editOrder)
        .subscribe({
          next: (response: any) => {
            this.loadOrders();
            this.showMessage(
              'Success',
              'Order updated successfully',
              'success'
            );
            this.closeModal();
          },
          error: (error: any) => {
            console.error('Error updating order', error);
            if (error.error.errors) {
              this.validationErrors = error.error.errors;
              this.showValidationErrors();
            } else {
              this.showMessage('Error', 'Failed to update order', 'error');
            }
          },
        })
    );
  }

  updateStatus(orderId: number, status: string): void {
    this.orderSubscriptions.push(
      this.orderService.updateStatus(orderId, status).subscribe({
        next: (response: any) => {
          this.loadOrders();
          this.showMessage(
            'Success',
            'Order status updated successfully',
            'success'
          );
        },
        error: (error: any) => {
          console.error('Error updating status', error);
          this.showMessage('Error', 'Failed to update status', 'error');
        },
      })
    );
  }

  deleteOrder(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
      customClass: {
        confirmButton: 'btn btn-success mr-2',
        cancelButton: 'btn btn-danger mx-2',
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.orderSubscriptions.push(
          this.orderService.deleteOrder(id).subscribe({
            next: (response: any) => {
              this.loadOrders();
              this.showMessage(
                'Deleted',
                'Order deleted successfully',
                'success'
              );
            },
            error: (error: any) => {
              console.error('Error deleting order', error);
              this.showMessage('Error', 'Failed to delete order', 'error');
            },
          })
        );
      }
    });
  }

  open(content: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  showMessage(title: string, text: string, icon: any): void {
    Swal.fire({
      title,
      text,
      icon,
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'btn btn-primary',
      },
      buttonsStyling: false,
    });
  }

  showValidationErrors(): void {
    let errorsText = '';
    Object.keys(this.validationErrors).forEach((key) => {
      errorsText += `${this.validationErrors[key][0]}\n`;
    });

    Swal.fire({
      title: 'Validation Error',
      text: errorsText,
      icon: 'error',
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'btn btn-primary',
      },
      buttonsStyling: false,
    });
  }

  onFilter(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.dt?.filterGlobal(inputElement.value, 'contains');
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadOrders();
  }
  ngOnDestroy(): void {
    this.orderSubscriptions.forEach((subscription) =>
      subscription.unsubscribe()
    );
  }
}
