import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../../service/wishlist.service';

@Component({
  selector: 'app-wish-list',
  standalone: true,
  imports: [],
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.css'
})
export class WishListComponent implements OnInit{

  constructor(private serviceWishList: WishlistService) { }

  ngOnInit(): void {
    this.serviceWishList.getWishlistData().subscribe(
      (data)=>console.log("data",data)
    );
  }

}
