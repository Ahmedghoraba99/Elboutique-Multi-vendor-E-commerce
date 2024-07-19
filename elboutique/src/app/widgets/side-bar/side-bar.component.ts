import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
})
export class SideBarComponent implements OnDestroy {
  private navBarSubscriptions: Subscription = new Subscription();
  @Input() navLinks: Array<{
    name: string;
    icon: string;
    path: string;
    primary?: boolean;
  }> = [];

  constructor(private router: Router, private authService: AuthService) {}
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
        this.navBarSubscriptions = this.authService.logout().subscribe(() => {
          localStorage.removeItem('user_info');
          this.authService.updateAuthStatus(false);
          this.router.navigate(['/login']);
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.navBarSubscriptions.unsubscribe();
  }
}
