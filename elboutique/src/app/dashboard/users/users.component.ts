import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CustomerService } from '../../service/admin/customer.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    ProgressSpinnerModule,
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

  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit, OnDestroy {
  @ViewChild('dt') dt: Table | undefined;

  customers: any[] = [];
  pageSize: number = 10;
  totalItems: number = 0;
  selectedCustomers: any[] = [];
  page: number = 1;
  loading = true;
  private customerSubscriptions: Subscription[] = [];
  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.loadCustomers();
  }
  loadCustomers() {
    this.loading = true;
    this.customerSubscriptions.push(
      this.customerService.getCustomers().subscribe((data) => {
        this.customers = data.map((customer) => ({
          ...customer,
          phone:
            customer.phones.length > 0 ? customer.phones[0].phoneNumper : null,
          addresses: customer.addresses
            .map(
              (address: any) =>
                `${address.street}, ${address.city}, ${address.governorate}`
            )
            .join(', '),
        }));
        this.totalItems = data.length;
        this.loading = false;
      })
    );
  }
  onFilter(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.dt?.filterGlobal(inputElement.value, 'contains');
  }
  deleteCustomer(id: number): void {
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
        this.customerSubscriptions.push(
          this.customerService.deleteCustomer(id).subscribe({
            next: () => {
              this.customers = this.customers.filter(
                (customer) => customer.id !== id
              );
              Swal.fire('Deleted!', 'Customer has been deleted.', 'success');
            },
            error: () => {
              Swal.fire(
                'Error!',
                'There was an error deleting the customer.',
                'error'
              );
            },
          })
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.customerSubscriptions.forEach((sub) => sub.unsubscribe());
  }
}
