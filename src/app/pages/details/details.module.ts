import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DetailsPage } from './details.page';
import {NgCircleProgressModule} from 'ng-circle-progress';
import {ExpandableComponent} from '../components/expandable/expandable.component';
import {StarRatingModule} from 'ionic4-star-rating';
import {ComponentsModule} from '../components/components.module';

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
        ComponentsModule,
        RouterModule.forChild(routes),
        NgCircleProgressModule,
        StarRatingModule
    ],
    declarations: [DetailsPage]
})
export class DetailsPageModule {}
