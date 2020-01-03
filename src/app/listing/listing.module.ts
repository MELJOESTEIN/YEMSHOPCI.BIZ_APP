import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListingPage } from './listing.page';
import {ImageCropperModule} from 'ngx-image-cropper';



const routes: Routes = [
  {
    path: '',
    component: ListingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImageCropperModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ListingPage]
})
export class ListingPageModule {}
