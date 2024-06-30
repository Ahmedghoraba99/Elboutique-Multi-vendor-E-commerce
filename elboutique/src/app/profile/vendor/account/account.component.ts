import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VendorService } from '../../../service/vendor/vendor.service';
import { Subscription } from 'rxjs';
import { Customer } from '../../../_model/customer';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-vendor-account',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit, OnDestroy {
  @ViewChild('imageInput') imageInput!: ElementRef;

  private subscription: Subscription | null = null;
  private userInfo: string | null = localStorage.getItem('user_info');
  userId: number = 0;
  customer!: Customer;

  profileForm: FormGroup;
  isEditable = false;
  profileImage = 'https://i.pravatar.cc/300';
  imageFile: File | null = null;

  constructor(private fb: FormBuilder, private vendorService: VendorService) {
    this.userId = this.extractUserId();
    this.profileForm = this.createProfileForm();
  }

  ngOnInit() {
    if (this.userId !== 0) {
      this.fetchVendorData();
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  private extractUserId(): number {
    if (this.userInfo) {
      try {
        const parsedUserInfo = JSON.parse(this.userInfo);
        return parsedUserInfo.id;
      } catch (error) {
        console.error('Error parsing user info from local storage', error);
      }
    }
    return 0;
  }

  private createProfileForm(): FormGroup {
    return this.fb.group({
      name: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(2)]],
      phone: [{ value: '', disabled: true }, [Validators.required, Validators.pattern('^[0-9]{10,11}$')]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
    });
  }

  private fetchVendorData() {
    this.subscription = this.vendorService.getVendorById(this.userId).subscribe({
      next: (response) => this.patchFormData(response.data),
      error: (error) => console.error('Error fetching vendor data:', error)
    });
  }

  private patchFormData(data: any) {
    this.profileForm.patchValue({
      name: data.name,
      phone: data.phone,
      email: data.email,
    });
    this.profileImage = data.image_url || this.profileImage;
  }

  toggleEdit() {
    this.isEditable = !this.isEditable;
    this.isEditable ? this.profileForm.enable() : this.profileForm.disable();
  }

  openImageInput() {
    this.imageInput.nativeElement.click();
  }

  onImageChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result as string;
        this.imageFile = file;
      };
      reader.readAsDataURL(file);
    }
  }

  saveProfile() {
    if (this.profileForm.valid) {
      const formData = this.createFormData();
      this.vendorService.updateVendor(this.userId, formData).subscribe({
        next: (data) => {
          Swal.fire({
            title: 'Success!',
            text: 'Profile updated successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        },
        error: (error) => {
          Swal.fire({
            title: 'Error!',
            text: 'An error occurred while updating the profile. '+ error.message,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
    } else {
      console.log('Form is invalid');
    }
    this.toggleEdit()
  }

  private createFormData(): FormData {
    const formData = new FormData();
    Object.keys(this.profileForm.value).forEach(key => {
      formData.append(key, this.profileForm.value[key]);
    });
    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }
    formData.append('_method', 'PUT');
    return formData;
  }
}
