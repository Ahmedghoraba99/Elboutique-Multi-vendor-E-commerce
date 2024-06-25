import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../service/admin/customer.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  customers: any[] = [];
  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
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
    });
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
        });
      }
    });
  }
}
