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
      path: 'report-products',
      icon: '<i class="fa-solid fa-flag"></i>',
      name: 'Report Product',
    },
    {
      path: 'reviews',
      icon: '<i class="fa-solid fa-comment-dots"></i>',
      name: 'My Reviews',
    },
    {
      path: 'address',
      icon: '<i class="fa-solid fa-location-dot"></i>',
      name: 'My Address',
    },
  ];
}
