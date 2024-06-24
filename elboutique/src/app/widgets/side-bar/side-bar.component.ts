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
  @Input() user: any;
  @Input() navLinks: Array<{
    name: string;
    icon: string;
    path: string;
    primary?: boolean;
  }> = [];

  constructor(private router: Router) {}
}
