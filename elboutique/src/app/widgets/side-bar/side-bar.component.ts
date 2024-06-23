import { CommonModule } from '@angular/common';
import { Component, Input, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
})
export class SideBarComponent implements OnInit {
  isCollapsed = false;

  ngOnInit() {
    this.checkScreenSize();
  }
  @Input() user: any;
  @Input() navLinks: Array<{
    name: string;
    icon: string;
    path: string;
    primary?: boolean;
  }> = [];
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }

  constructor(private router: Router) {}
  checkScreenSize() {
    const screenWidth = window.innerWidth;
    if (screenWidth > 768) {
      this.isCollapsed = false;
    } else {
      this.isCollapsed = true;
    }
  }
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
  logout() {
    console.log('Logout clicked');
    this.router.navigateByUrl('/login');
  }
}
