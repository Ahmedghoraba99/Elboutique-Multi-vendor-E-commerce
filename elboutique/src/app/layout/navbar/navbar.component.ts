import { Component } from '@angular/core';
import { SelectDropComponent } from './select-drop/select-drop.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch , faShoppingCart ,faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faHeart  } from '@fortawesome/free-regular-svg-icons';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FontAwesomeModule ,SelectDropComponent] ,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  faSearch=faSearch;
  faShoppingCart=faShoppingCart;
  faHeart=faHeart;
  faArrowRightFromBracket=faArrowRightFromBracket;
}
