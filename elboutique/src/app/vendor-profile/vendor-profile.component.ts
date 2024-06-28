import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  faEnvelope,
  faPhone,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons';
import { VendorPortofolioService } from '../service/vendor-portofolio.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
@Component({
  selector: 'app-vendor-profile',
  standalone: true,
  imports: [FontAwesomeModule, RouterLink, NgIf, NgFor],
  templateUrl: './vendor-profile.component.html',
  styleUrl: './vendor-profile.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class VendorProfileComponent {
  productGroups: any = [];
  vendor: any = {};
  constructor(
    private vendorPortofolio: VendorPortofolioService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.vendorPortofolio
        .getVendorProducts(params['id'])
        .subscribe((data: any) => {
          this.productGroups.push(data.data);
          if (data.data) {
            this.vendor = this.productGroups[0][0].vendor;
          }
        });
    });
  }
  faLocationDot = faLocationDot;
  faPhone = faPhone;
  faEnvelope = faEnvelope;
}
