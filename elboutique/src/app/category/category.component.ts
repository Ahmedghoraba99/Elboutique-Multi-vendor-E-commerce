import { Component } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart , faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class CategoryComponent {
  faChevronRight = faChevronRight;
  productsPerPage: number = 10; 

  constructor(private toast :ToastrService){}
  

  toggleCart(event: any) {
    if (event.target.checked) {
      this.Addtocart();
    } else {
      this.RemoveFromCart();
    }
  }
  toggleWishList(event :any){
    if (event.target.checked) {
      this.AddtoWishlist();
    } else {
      this.RemoveFromWishlist ();
    }
  }


  // cart
  Addtocart(){
    this.toast.success("Product added to cart " , "Added ")
  }
  RemoveFromCart(){
    this.toast.error("Product Removed" , "Removed")
  }


// wishlist 

  AddtoWishlist(){
    this.toast.success("Product added to WishList " , "Added ")
  }
  RemoveFromWishlist(){
    this.toast.error("Prodcut Removed" , "Removed")

  }


  // load more button 
  loadMore(){

  }

}
