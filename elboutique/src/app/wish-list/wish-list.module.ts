import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WishListComponent } from './wish-list.component';
import { WishListContentComponent } from './wish-list-content/wish-list-content.component';

@NgModule({
  declarations: [WishListComponent, WishListContentComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: WishListComponent }]),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WishListModule {}
