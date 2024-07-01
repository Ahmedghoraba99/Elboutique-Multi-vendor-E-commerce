import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
})
export class SideBarComponent {
  @Input() user: any = {
    name: 'John Doe',
    email: 'pKqQH@example.com',
    image:
      'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png',
  };
  @Input() navLinks: Array<{
    name: string;
    icon: string;
    path: string;
    primary?: boolean;
  }> = [];

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  constructor(private router: Router) {}
}
