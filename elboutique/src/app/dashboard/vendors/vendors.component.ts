import { Component } from '@angular/core';
import { VendorService } from '../../service/admin/vendor.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vendors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendors.component.html',
  styleUrl: './vendors.component.css',
})
export class VendorsComponent {
  vendors: any[] = [];
  selectedVendor: any = null;

  constructor(private vendorService: VendorService) {}
  ngOnInit(): void {
    this.vendorService.getVendors().subscribe((data) => {
      this.vendors = data.data.map((vendor: any) => ({
        ...vendor,
        image: vendor.image_url,
      }));
      console.log(this.vendors);
    });
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
    console.log(vendor);

    this.vendorService.activateVendor(vendor.id, !vendor.active).subscribe({
      next: () => {
        vendor.active = !vendor.active;
        console.log(vendor.active);

        Swal.fire(
          'Success!',
          `Vendor has been ${vendor.active ? 'activated' : 'deactivated'}.`,
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
        vendor.banned = !vendor.banned;
        Swal.fire(
          'Success!',
          `Vendor has been ${vendor.banned ? 'banned' : 'unbanned'}.`,
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
