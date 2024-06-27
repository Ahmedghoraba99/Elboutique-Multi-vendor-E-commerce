import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-auth',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './not-auth.component.html',
  styleUrl: './not-auth.component.css',
})
export class NotAuthComponent {}
