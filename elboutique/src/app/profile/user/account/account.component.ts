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
  selector: 'app-account',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
})
export class AccountComponent implements OnInit {
  @ViewChild('imageInput') imageInput!: ElementRef;

  profileForm: FormGroup = new FormGroup({});
  isEditable = false;
  profileImage = 'https://i.pravatar.cc/300';
  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    this.profileForm = this.fb.group({
      fname: [
        { value: 'John', disabled: true },
        [Validators.required, Validators.minLength(2)],
      ],
      midname: [{ value: 'A.', disabled: true }],
      lname: [
        { value: 'Doe', disabled: true },
        [Validators.required, Validators.minLength(2)],
      ],
      dob: [{ value: '1990-01-01', disabled: true }, [Validators.required]],
      gender: [{ value: 'Male', disabled: true }, [Validators.required]],
      phone: [
        { value: '1234567890', disabled: true },
        [Validators.required, Validators.pattern('^[0-9]{10}$')],
      ],
      email: [
        { value: 'john.doe@example.com', disabled: true },
        [Validators.required, Validators.email],
      ],
      governorate: [{ value: 'Governorate', disabled: true }],
      city: [{ value: 'City', disabled: true }],
      street: [{ value: '123 Street', disabled: true }],
      houseNumber: [{ value: '456', disabled: true }],
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
  saveProfile() {
    if (this.profileForm.valid) {
      const formData = this.profileForm.value;
      formData.profileImage = this.profileImage;
      console.log(formData);

      // this.http.post('http://127.0.0.1:8000/id', formData).subscribe({
      //   next: (data) => {
      //     console.log(data);

      //     console.log('Profile saved successfully');
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
