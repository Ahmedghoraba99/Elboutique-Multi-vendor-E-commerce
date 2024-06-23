import { Component } from '@angular/core';
import { SideBarComponent } from '../widgets/side-bar/side-bar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SideBarComponent, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  currentUser = {
    name: 'John Doe',
    email: 'qfWp3@example.com',
    image: 'https://i.pravatar.cc/300',
  };
  navLinks = [
    {
      path: 'overview',
      icon: '<i class="fas fa-home"></i>',
      name: 'Overview',
    },
    {
      path: 'users',
      icon: '<i class="fas fa-users"></i>',
      name: 'Users',
    },
    {
      path: 'vendors',
      icon: '<i class="fas fa-store"></i>',
      name: 'Vendors',
    },
    {
      path: 'products',
      icon: '<i class="fas fa-shopping-cart"></i>',
      name: 'Products',
    },
    {
      path: 'orders',
      icon: '<i class="fa-solid fa-receipt"></i>',
      name: 'Orders',
    },
  ];
}
