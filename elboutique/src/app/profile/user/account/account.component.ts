import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../service/auth.service';
import {ProfileUser} from '../../../_model/customer'
import { UserProfileService } from '../../../service/user-profile.service';


@Component({
  selector: 'app-account',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
})

export class AccountComponent implements OnInit {
  @ViewChild('imageInput') imageInput!: ElementRef;

  user!:ProfileUser;
  profileForm: FormGroup = new FormGroup({});
  isEditable = false;
  profileImage: string | ArrayBuffer | null = 'https://i.pravatar.cc/300';
  imageFile: File | null = null;


  constructor(private fb: FormBuilder, private http: HttpClient,private authService:AuthService ,private profileService: UserProfileService) {
  }

  ngOnInit() {

    this.authService.getUserDataObservable().subscribe(
      (data) => {
        this.user = data;
        this.profileImage = this.user?.data?.image_url;
        // console.log(this.user);

        this.initForm();
        // console.log(this.user.data);
    });
  }


  initForm() {
    this.profileForm = this.fb.group({
      name: [
        { value: this.user?.data?.name, disabled: true },
        [Validators.required, Validators.minLength(2)],
      ],
      email: [
        { value: this.user?.data?.email, disabled: true },
        [Validators.required, Validators.email],
      ],
      ...this.user.data.phones.reduce((acc: any, phone, index) => {
        acc[`phone${index}`] = [
          { value: phone.phoneNumper, disabled: true },
          [Validators.required, Validators.pattern('^[0-9]{11}$')],
        ];
        return acc;
      }, {}),
      ...this.user.data.addresses.reduce((acc: any, address, index) => {
        acc[`governorate${index}`] = [
          { value: address.governorate, disabled: true },
        ];
        acc[`city${index}`] = [{ value: address.city, disabled: true }];
        acc[`street${index}`] = [{ value: address.street, disabled: true }];
        acc[`houseNumber${index}`] = [
          { value: address.house_number, disabled: true },
        ];
        return acc;
      }, {}),
    });
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
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveProfile() {
    if (this.profileForm.valid) {
      const formData = { ...this.profileForm.value, image: this.imageFile };
      this.profileService.updateProfile(formData,this.user.data.id).subscribe({
        next: (data) => {
          console.log(data);
          alert('Profile saved successfully');
        },
        error: (error) => {
          console.error('Error saving profile:', error);
          alert('Error saving profile: ' + error);
        },
      });
    } else {
      console.log('Form is invalid');
    }

  }

}
