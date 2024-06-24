import { Component ,inject ,OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart , faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { HomeService } from '../../../service/home.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-select-drop',
  standalone: true,
  imports: [CommonModule , FontAwesomeModule ,FormsModule] ,
  templateUrl: './select-drop.component.html',
  styleUrl: './select-drop.component.css'
})
export class SelectDropComponent implements OnInit {
  homeService: HomeService = inject(HomeService);
  categories: any[] = [];
  filteredCategories: any[] = [];
  searchTerm: string = '';
  noCategoryFound: boolean = false;

  faChevronDown = faChevronDown;
  isDropdownOpen = false;
  selectedIndex: number | null = null;
  selectedItem: string = 'All Category';

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  setIsOpen(index: number, item: string) {
    this.selectedIndex = index;
    this.selectedItem = item;
    this.isDropdownOpen = false;
  }

  filterCategories() {
    if (this.searchTerm) {
      this.filteredCategories = this.categories.filter(category =>
        category.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      this.noCategoryFound = this.filteredCategories.length === 0;
    } else {
      this.filteredCategories = this.categories;
      this.noCategoryFound = false;
    }
  }

  ngOnInit(): void {
    this.homeService.getAllCategories().subscribe((data) => {
      this.categories = data.data;
      this.filteredCategories = this.categories; 
    });
  }
}