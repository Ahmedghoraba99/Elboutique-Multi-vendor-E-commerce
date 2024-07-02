import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faShippingFast, faTags, faTruck, faBox } from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-aboutus',
  standalone: true,
  imports: [FontAwesomeModule ,RouterLink],
  templateUrl: './aboutus.component.html',
  styleUrl: './aboutus.component.css'
})
export class AboutusComponent {
  faShippingFast=faShippingFast;
  faTags=faTags;
  faTruck=faTruck;
  faBox=faBox;

}
