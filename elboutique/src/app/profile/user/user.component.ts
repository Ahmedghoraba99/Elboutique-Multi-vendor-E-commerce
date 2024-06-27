import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideBarComponent } from '../../widgets/side-bar/side-bar.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [SideBarComponent, RouterOutlet],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
  currentUser = {
    name: 'John Doe',
    email: 'qfWp3@example.com',
    image: 'https://i.pravatar.cc/300',
  };
  navLinks = [
    {
      path: 'account',
      icon: '<i class="fa-solid fa-user-gear"></i>',
      name: 'My Account',
    },
    {
      path: 'orders',
      icon: '<i class="fa-solid fa-receipt"></i>',
      name: 'My Orders',
    },
    {
      path: 'wishlist',
      icon: '<i class="fa-solid fa-heart"></i>',
      name: 'My Wishlist',
    },
    {
      path: 'reviews',
      icon: '<i class="fa-solid fa-comment-dots"></i>',
      name: 'My Reviews',
    },
    {
      path: 'payment',
      icon: '<i class="fa-solid fa-credit-card"></i>',
      name: 'My Payment',
    },
    {
      path: 'account/change-password',
      icon: '<i class="fa-solid fa-lock"></i>',
      name: 'Change Password',
    },
  ];
}
