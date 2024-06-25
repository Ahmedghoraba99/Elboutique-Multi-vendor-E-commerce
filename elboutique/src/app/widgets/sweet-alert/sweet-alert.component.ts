import { Component } from '@angular/core';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-sweet-alert',
  standalone: true,
  imports: [],
  templateUrl: './sweet-alert.component.html',
  styleUrl: './sweet-alert.component.css',
})
export class SweetAlertComponent {
  showSweetAlert(): Promise<any> {
    return new Promise((resolve) => {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success mr-2',
          cancelButton: 'btn btn-danger mx-2',
        },
        buttonsStyling: false,
      });

      swalWithBootstrapButtons
        .fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'No, cancel!',
          reverseButtons: true,
        })
        .then((result) => {
          resolve(result);
        });
    });
  }
}
