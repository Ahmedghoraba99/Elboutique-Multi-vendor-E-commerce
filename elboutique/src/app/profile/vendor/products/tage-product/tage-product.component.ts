import { Component,Input, OnChanges, SimpleChanges } from '@angular/core';
import { Tag } from '../../../../_model/tag';
import { TagesService } from '../../../../service/tages.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-tage-product',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './tage-product.component.html',
  styleUrl: './tage-product.component.css'
})


export class TageProductComponent implements OnChanges{

  @Input() product_id = 0;
  tags!:Tag;
  


  constructor(private tagService:TagesService){}


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product_id']) {
      this.fetchTags();
    }
  }

  fetchTags(){
    this.tagService.getTagesProduct(this.product_id).subscribe(
      async(response)=>{
        this.tags = response;
      },
      async(error)=>{
        this.showErrorAlert(error);
      }
    )
  }

  async showSuccessAlert(message: string): Promise<any> {
    return Swal.fire({
      title: 'Success!',
      text: message,
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

  submitTags(){
    const selectedTagIds = this.tags.data.filter(tag => tag.selected).map(tag => tag.id);
    const payload = {
      product_id: this.product_id,
      tag_ids: selectedTagIds
    };

    this.tagService.updateProductTags(payload).subscribe(
      async (response) => {
        if (response.success) {
          await this.showSuccessAlert(response.message);
        } else {
          await this.showErrorAlert(response.errors);
        }
      },
      async (error) => {
        await this.showErrorAlert(error.error.message);
      }
    );
  }
}
