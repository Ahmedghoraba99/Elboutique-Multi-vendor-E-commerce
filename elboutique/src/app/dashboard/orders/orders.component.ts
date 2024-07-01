import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderService } from '../../service/admin/order.service';
import { CustomerService } from '../../service/admin/customer.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

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
  ],
})
export class OrdersComponent implements OnInit {
  @ViewChild('orderForm') orderForm!: any;

  orders: any[] = [];
  customers: any[] = [];
  newOrder: any = { customer_id: '', status: 'midway', total: '' };
  editOrder: any = { id: null, customer_id: '', status: 'midway', total: '' };
  validationErrors: any = {};
  loading = true;
  constructor(
    private orderService: OrderService,
    private customerService: CustomerService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadOrders();
    this.loadCustomers();
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (response: any) => {
        this.orders = response.data;
        this.loading = false;
      },
      error: (error: any) => console.error('Error loading orders', error),
    });
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe({
      next: (response: any) => {
        this.customers = response;
        this.loading = false;
      },
      error: (error: any) => console.error('Error loading customers', error),
    });
  }

  getCustomerName(customerId: number): string {
    const customer = this.customers.find((c) => c.id === customerId);
    return customer ? customer.name : 'Unknown';
  }

  addOrder(): void {
    console.log(this.newOrder); // Check if the data is correctly filled here

    this.orderService.addOrder(this.newOrder).subscribe({
      next: (response: any) => {
        console.log('Order added', response);
        this.loadOrders();
        this.showMessage('Success', 'Order added successfully', 'success');
        this.closeModal();
      },
      error: (error: any) => {
        console.error('Error adding order', error);
        if (error.error.errors) {
          this.validationErrors = error.error.errors;
          this.showValidationErrors();
        } else {
          this.showMessage('Error', 'Failed to add order', 'error');
        }
      },
      complete: () => {
        console.log(this.newOrder); // Check again after completion
        this.newOrder = { customer_id: '', status: 'midway', total: '' };
      },
    });
  }

  updateOrder(): void {
    this.orderService.updateOrder(this.editOrder.id, this.editOrder).subscribe({
      next: (response: any) => {
        console.log('Order updated', response);
        this.loadOrders();
        this.showMessage('Success', 'Order updated successfully', 'success');
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
      complete: () => {
        this.editOrder = {
          id: null,
          customer_id: '',
          status: 'midway',
          total: '',
        };
      },
    });
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
        this.orderService.deleteOrder(id).subscribe({
          next: (response: any) => {
            console.log('Order deleted', response);
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
        });
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
}
