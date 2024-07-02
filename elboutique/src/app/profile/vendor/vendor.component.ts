import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideBarComponent } from '../../widgets/side-bar/side-bar.component';

@Component({
  selector: 'app-vendor',
  standalone: true,
  imports: [RouterOutlet, SideBarComponent],
  templateUrl: './vendor.component.html',
  styleUrl: './vendor.component.css',
})
export class VendorComponent {
  navLinks = [
    {
      path: 'overview',
      icon: '<i class="fa-solid fa-house"></i>',
      name: 'Overview',
    },
    {
      path: 'account',
      icon: '<i class="fa-solid fa-user-gear"></i>',
      name: 'My Account',
    },
    {
      path: 'products',
      icon: '<i class="fa-solid fa-boxes-stacked"></i>',
      name: 'My Products',
    },
  ];
}
