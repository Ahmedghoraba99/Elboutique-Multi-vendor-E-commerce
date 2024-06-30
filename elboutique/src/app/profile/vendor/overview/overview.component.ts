import { Component, OnInit } from '@angular/core';
import {VendorReceivables} from '../../../_model/vendor-receivables';
import { ReceivablesService } from '../../../service/receivables.service';
import { CommonModule } from '@angular/common';


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


  constructor(private amountServise:ReceivablesService){
    this.customer_id = JSON.parse(localStorage.getItem('user_info') || '{}').id
  }
  ngOnInit(): void {
    this.loadVendorReceivables();
  }

  loadVendorReceivables() {
    this.amountServise.getVendorReceivables(this.customer_id).subscribe(
      (response) => {
        this.vendorReceivables = response;
      },
      (error) => {
        this.errorMessage = error.errorMessage;
      }
    );
  }



}
