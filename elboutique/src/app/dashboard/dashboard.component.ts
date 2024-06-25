import { Component } from '@angular/core';
import { SideBarComponent } from '../widgets/side-bar/side-bar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [SideBarComponent, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  navLinks = [
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
