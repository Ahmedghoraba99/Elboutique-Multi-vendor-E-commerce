import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { HomeService } from '../../../service/home.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-select-drop',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormsModule],
  templateUrl: './select-drop.component.html',
  styleUrl: './select-drop.component.css',
})
export class SelectDropComponent implements OnInit {
  homeService: HomeService = inject(HomeService);
  categories: any[] = [];
  filteredCategories: any[] = [];
  searchTerm: string = '';
  noCategoryFound: boolean = false;
  selectedCategory: any = null;

  faChevronDown = faChevronDown;
  isDropdownOpen = false;
  selectedIndex: number | null = null;
  selectedItem: string = 'All Category';

  @Output() categorySelected = new EventEmitter<any>();
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  setIsOpen(index: number, name: string) {
    this.selectedIndex = index;
    this.selectedCategory = this.filteredCategories[index];
    this.isDropdownOpen = false;
    this.selectedItem = name;
    this.categorySelected.emit(this.selectedCategory);
  }

  filterCategories() {
    if (this.searchTerm) {
      this.filteredCategories = this.categories.filter((category) =>
        category.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      this.noCategoryFound = this.filteredCategories.length === 0;
    } else {
      this.filteredCategories = this.categories;
      this.noCategoryFound = false;
    }
  }

  handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.categorySelected.emit(this.selectedCategory);
      alert(this.selectedCategory);
    }
  }
  ngOnInit(): void {
    this.homeService.getAllCategories().subscribe((data) => {
      this.categories = data.data;
      this.filteredCategories = this.categories;
    });
  }
}
