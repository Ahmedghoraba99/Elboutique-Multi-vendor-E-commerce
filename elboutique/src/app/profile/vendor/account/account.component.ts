import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-vendor-account',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  @ViewChild('imageInput') imageInput!: ElementRef;

  profileForm: FormGroup = new FormGroup({});
  isEditable = false;
  profileImage = 'https://i.pravatar.cc/300';
  idImageFront: string | ArrayBuffer | null = null;
  idImageBack: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    this.profileForm = this.fb.group({
      name: [
        { value: 'John Doe', disabled: true },
        [Validators.required, Validators.minLength(2)],
      ],
      phone: [
        { value: '1234567890', disabled: true },
        [Validators.required, Validators.pattern('^[0-9]{10}$')],
      ],
      email: [
        { value: 'john.doe@example.com', disabled: true },
        [Validators.required, Validators.email],
      ],
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
      const formData = {
        ...this.profileForm.value,
        profileImage: this.profileImage,
        idImageFront: this.idImageFront,
        idImageBack: this.idImageBack,
      };
      console.log(formData);

      // Uncomment and modify the URL to save the profile data to the server
      // this.http.post('http://127.0.0.1:8000/id', formData).subscribe({
      //   next: (data) => {
      //     console.log('Profile saved successfully', data);
      //   },
      //   error: (error) => {
      //     console.error('Error saving profile:', error);
      //   },
      // });
    } else {
      console.log('Form is invalid');
    }
  }
}
