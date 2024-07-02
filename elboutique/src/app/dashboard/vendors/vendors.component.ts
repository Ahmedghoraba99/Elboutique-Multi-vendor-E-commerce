import { Component, ViewChild } from '@angular/core';
import { VendorService } from '../../service/admin/vendor.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Table, TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
@Component({
  selector: 'app-vendors',
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
  templateUrl: './vendors.component.html',
  styleUrl: './vendors.component.css',
})
export class VendorsComponent {
  @ViewChild('dt') dt: Table | undefined;

  vendors: any[] = [];
  selectedVendor: any = null;
  loading = true;
  totalItems: number = 0;
  pageSize: number = 10;
  page: number = 1;

  constructor(private vendorService: VendorService) {}
  ngOnInit(): void {
    this.loadVendors();
  }

  loadVendors() {
    this.loading = true;
    this.vendorService.getVendors().subscribe({
      next: (response) => {
        this.vendors = response.data;
        this.totalItems = response.total;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
  onFilter(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.dt?.filterGlobal(inputElement.value, 'contains');
  }
  viewVendor(vendor: any): void {
    this.selectedVendor = vendor;
  }
  closeModal(): void {
    this.selectedVendor = null;
  }
  deleteVendor(id: number): void {
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
        this.vendorService.deleteVendor(id).subscribe({
          next: () => {
            this.vendors = this.vendors.filter((vendor) => vendor.id !== id);
            Swal.fire('Deleted!', 'Vendor has been deleted.', 'success');
          },
          error: () => {
            Swal.fire(
              'Error!',
              'There was an error deleting the vendor.',
              'error'
            );
          },
        });
      }
    });
  }

  activateVendor(vendor: any): void {
    this.vendorService.activateVendor(vendor.id).subscribe({
      next: (response) => {
        if (vendor.active == 'true') {
          vendor.active = 'false';
        } else {
          vendor.active = 'true';
        }
        Swal.fire(
          'Success!',
          `Vendor has been ${
            vendor.active == 'true' ? 'activated' : 'deactivated'
          }.`,
          'success'
        );
      },
      error: () => {
        Swal.fire(
          'Error!',
          `There was an error ${
            vendor.active ? 'activating' : 'deactivating'
          } the vendor.`,
          'error'
        );
      },
    });
  }

  banVendor(vendor: any): void {
    this.vendorService.banVendor(vendor.id, !vendor.banned).subscribe({
      next: () => {
        if (vendor.banned == 'true') {
          vendor.banned = 'false';
        } else {
          vendor.banned = 'true';
        }

        Swal.fire(
          'Success!',
          `Vendor has been ${vendor.banned == 'true' ? 'banned' : 'unbanned'}.`,
          'success'
        );
      },
      error: () => {
        Swal.fire(
          'Error!',
          `There was an error ${
            vendor.banned ? 'banning' : 'unbanning'
          } the vendor.`,
          'error'
        );
      },
    });
  }
}
