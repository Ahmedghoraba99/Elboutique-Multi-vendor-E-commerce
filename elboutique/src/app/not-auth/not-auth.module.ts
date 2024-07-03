import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotAuthComponent } from './not-auth.component';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path: '',
    component: NotAuthComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotAuthModule {}
