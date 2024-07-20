import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomerAddressService } from '../../../service/customer-address.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  addressForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private customerAddressService: CustomerAddressService,
    private router: Router
  ) {}

  ngOnInit() {
    this.addressForm = this.fb.group({
      governorate: ['', [Validators.required, Validators.minLength(3)]],
      city: ['', [Validators.required, Validators.minLength(3)]],
      street: ['', [Validators.required, Validators.minLength(3)]],
      houseNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
    });
  }

  onSubmit() {
    if (this.addressForm.valid) {
      this.customerAddressService.addAddress(this.addressForm.value).subscribe({
        next: (response) => {
          Swal.fire({
            title: 'Success',
            text: 'Address added successfully',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              this.addressForm.reset();
              this.router.navigate(['/u/account']);
            }
          });
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: 'Failed to add address',
            icon: 'error',
            confirmButtonText: 'OK'
          });
          console.error('Error adding address', error);
        }
      });
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Please fill out the form correctly',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }
}
