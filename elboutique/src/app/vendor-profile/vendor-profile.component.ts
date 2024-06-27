import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { faEnvelope , faPhone  , faLocationDot} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-vendor-profile',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './vendor-profile.component.html',
  styleUrl: './vendor-profile.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class VendorProfileComponent {
  faLocationDot=faLocationDot;
  faPhone=faPhone;
  faEnvelope=faEnvelope;

}
