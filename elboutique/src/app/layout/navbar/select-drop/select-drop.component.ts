import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart , faChevronDown } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-select-drop',
  standalone: true,
  imports: [CommonModule , FontAwesomeModule],
  templateUrl: './select-drop.component.html',
  styleUrl: './select-drop.component.css'
})
export class SelectDropComponent {
  faChevronDown=faChevronDown;
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
}
