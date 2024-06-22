import { Component } from '@angular/core';
import { WishListContentComponent } from './wish-list-content/wish-list-content.component';
@Component({
  selector: 'app-wish-list',
  standalone: true,
  imports: [WishListContentComponent],
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.css'
})
export class WishListComponent {

}
