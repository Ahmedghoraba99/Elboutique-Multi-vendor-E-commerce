import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VendorService } from '../../../service/vendor/vendor.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-vendor-account',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit, OnDestroy {
  @ViewChild('imageInput') imageInput!: ElementRef;

  sub: Subscription | null = null;
  userInfo: string | null = localStorage.getItem('user_info');
  user_id: number = 0;

  profileForm: FormGroup = new FormGroup({});
  isEditable = false;
  profileImage = 'https://i.pravatar.cc/300'; 
  idImageFront: string | ArrayBuffer | null = null;
  idImageBack: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient, private vendorService: VendorService) {
    if (this.userInfo) {
      try {
        const parsedUserInfo = JSON.parse(this.userInfo);
        this.user_id = parsedUserInfo.id;
      } catch (error) {
        console.error('Error parsing user info from local storage', error);
      }
    }
  }

  ngOnInit() {
    this.initializeForm();
    if (this.user_id !== 0) {
      this.sub = this.vendorService.getVendorById(this.user_id).subscribe({
        next: (response) => {
          console.log('API Response:', response);
          this.patchFormData(response.data);
        },
        error: (error) => {
          console.error('Error fetching vendor data:', error);
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  initializeForm() {
    this.profileForm = this.fb.group({
      name: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(2)]],
      phone: [{ value: '', disabled: true }, [Validators.required, Validators.pattern('^[0-9]{10,11}$')]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
    });
  }

  patchFormData(data: any) {
    this.profileForm.patchValue({
      name: data.name,
      phone: data.phone,
      email: data.email,
    });
    this.profileImage = data.image_url || this.profileImage;
    console.log('Form patched with data:', this.profileForm.value);
  }

  toggleEdit() {
    this.isEditable = !this.isEditable;
    if (this.isEditable) {
      this.profileForm.enable();
    } else {
      this.profileForm.disable();
    }
  }

  openImageInput() {
    this.imageInput.nativeElement.click();
  }

  onImageChange(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onIdFrontChange(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.idImageFront = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onIdBackChange(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.idImageBack = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveProfile() {
    if (this.profileForm.valid) {
      const formData = new FormData();
      formData.append('name', this.profileForm.get('name')?.value);
      formData.append('phone', this.profileForm.get('phone')?.value);
      formData.append('email', this.profileForm.get('email')?.value);
      formData.append('profileImage', this.profileImage);
      if (this.idImageFront) {
        formData.append('idImageFront', this.idImageFront as string);
      }
      if (this.idImageBack) {
        formData.append('idImageBack', this.idImageBack as string);
      }

      console.log("formdata");
      console.log(formData);

      this.vendorService.updateVendor(this.user_id, formData).subscribe({
        next: (data) => {
          console.log('Profile saved successfully', data);
        },
        error: (error) => {
          console.error('Error saving profile:', error);
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
