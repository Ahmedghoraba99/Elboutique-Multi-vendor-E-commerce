import { Component } from '@angular/core';
import { SelectDropComponent } from './select-drop/select-drop.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faSearch,
  faShoppingCart,
  faArrowRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FontAwesomeModule, RouterLink, SelectDropComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  selectedCategory: any = null;
  constructor(private router: Router) {}

  onCategorySelected(category: any) {
    this.selectedCategory = category;
  }
  performSearch(searchTerm: string) {
    const categoryId = this.selectedCategory ? this.selectedCategory.id : 'all';
    this.router.navigate([`/categories/${categoryId}`], {
      queryParams: { name: searchTerm },
    });
  }

  handleKeyPress(event: KeyboardEvent, searchTerm: string) {
    if (event.key === 'Enter') {
      this.performSearch(searchTerm);
    }
  }
  faSearch = faSearch;
  faShoppingCart = faShoppingCart;
  faHeart = faHeart;
  faArrowRightFromBracket = faArrowRightFromBracket;

  user_id = localStorage.getItem('id');
  logout():void{
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
