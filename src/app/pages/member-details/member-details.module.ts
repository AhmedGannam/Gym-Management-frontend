import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MemberDetailsPageRoutingModule } from './member-details-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MemberDetailsPage } from './member-details.page';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SharedModule,
    MemberDetailsPageRoutingModule,
  ],
  declarations: [MemberDetailsPage]
})
export class MemberDetailsPageModule {}
