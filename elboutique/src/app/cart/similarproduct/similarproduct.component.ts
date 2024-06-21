import { Component } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-similarproduct',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './similarproduct.component.html',
  styleUrl: './similarproduct.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class SimilarproductComponent {
  faHeart=faHeart;
}
