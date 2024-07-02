import { Component, OnInit } from '@angular/core';
import {VendorReceivables} from '../../../_model/vendor-receivables';
import { ReceivablesService } from '../../../service/receivables.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../service/auth.service';


@Component({
  selector: 'app-vendor-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css',
})
export class OverviewComponent implements OnInit{

  vendorReceivables: VendorReceivables | null = null;
  errorMessage: string = '';
  customer_id: number = 0;
  totoalProductSale:number = 0;
  totalReviewProduct:number = 0;
  totalReportsProduct:number = 0;

  constructor(private amountServise:ReceivablesService ,private logoutServise:AuthService){
    this.customer_id = JSON.parse(localStorage.getItem('user_info') || '{}').id
  }
  ngOnInit(): void {
    this.loadVendorReceivables();
  }

  loadVendorReceivables() {
    this.amountServise.getVendorReceivables(this.customer_id).subscribe(
      (response) => {
        this.vendorReceivables = response;
        this.totoalProductSale = this.vendorReceivables.vendor_products.filter(product => product.sale > 0).length;
        this.totalReviewProduct = this.vendorReceivables.vendor_products.filter(product => product.reviews.length > 0).length;
        this.totalReportsProduct = this.vendorReceivables.vendor_products.filter(product => product.reportProducts.length > 0).length;
      },
      (error) => {
        this.errorMessage = error.errorMessage;
      }
    );
  }

  logout(){
    this.logoutServise.logout();
  }


}
