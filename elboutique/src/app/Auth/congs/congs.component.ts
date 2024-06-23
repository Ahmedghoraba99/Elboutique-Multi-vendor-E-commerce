import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-congs',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './congs.component.html',
  styleUrl: './congs.component.css',
})
export class CongsComponent {}
