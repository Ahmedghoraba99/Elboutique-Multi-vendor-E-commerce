import { Component , inject } from '@angular/core';
import { HomeService } from '../../service/home.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  categories: any[] = [];
  homeService: HomeService = inject(HomeService);

  constructor() {}
  ngOnInit(): void {
    this.homeService.getAllCategories().subscribe((data) => {
      this.categories = data.data;
      console.log(data.data)
    });
  }
}
