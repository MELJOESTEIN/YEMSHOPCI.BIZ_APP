import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DetailsPage } from './details.page';
import {NgCircleProgressModule} from 'ng-circle-progress';

const routes: Routes = [
  {
    path: '',
    component: DetailsPage
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        NgCircleProgressModule
    ],
  declarations: [DetailsPage]
})
export class DetailsPageModule {}
