import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorProfileComponent } from './vendor-profile.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

@NgModule({
  declarations: [VendorProfileComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterModule.forChild([{ path: '', component: VendorProfileComponent }]),
    NgIf,
    NgFor,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class VendorProfileModule {}
