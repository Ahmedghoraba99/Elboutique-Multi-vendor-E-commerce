import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
})
export class SideBarComponent {
  @Input() navLinks: Array<{
    name: string;
    icon: string;
    path: string;
    primary?: boolean;
  }> = [];

  constructor(private router: Router, private logoutServise: AuthService) {}
  logout() {
    Swal.fire({
      title: 'Logout',
      text: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#270949',
      cancelButtonColor: '#f95b3d',
      confirmButtonText: 'Bye 🙋🏻‍♂️',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.logoutServise.logout();
      }
    });
  }
}
