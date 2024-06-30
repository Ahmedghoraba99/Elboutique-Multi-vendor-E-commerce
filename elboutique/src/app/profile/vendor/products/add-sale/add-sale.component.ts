import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VendorAddProductService } from '../../../../service/vendor/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-sale',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-sale.component.html',
  styleUrls: ['./add-sale.component.css']
})
export class AddSaleComponent {

  sale: number = 0;
  isValid: boolean = false;
  errorMessage: string = '';
  @Input() productId: number = 0;

  constructor(private productService: VendorAddProductService) { }

  onChangeEvent() {
    if (this.sale > 0) {
      this.isValid = true;
      this.errorMessage = '';
    } else {
      this.isValid = false;
      this.errorMessage = 'The sale must be greater than 0';
    }
  }

  onSubmit() {
    if (this.isValid || this.sale > 0) {
      if (this.productId > 0) {
        const formData = new FormData();
        formData.append('sale', this.sale.toString());
        formData.append('_method', 'PUT');
        this.productService.addSale(this.productId, formData).subscribe(
          async (response) => {
            await this.showSuccessAlert();
          },
          async (error) => {
            await this.showErrorAlert(error.error.message);
          }
        );
      }
      this.sale = 0;
      this.isValid = false;
      this.errorMessage = '';
    } else {
      console.log(this.isValid);
    }
  }

  async showSuccessAlert(): Promise<any> {
    return Swal.fire({
      title: 'Success!',
      text: 'Product has been added successfully.',
      icon: 'success',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Go to Products'
    });
  }

  async showErrorAlert(error: string): Promise<any> {
    return Swal.fire({
      title: 'Error!',
      text: error,
      icon: 'error',
      confirmButtonColor: '#d33',
      confirmButtonText: 'OK'
    });
  }
}
