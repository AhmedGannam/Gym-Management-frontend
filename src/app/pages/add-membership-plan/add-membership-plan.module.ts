import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddMembershipPlanPageRoutingModule } from './add-membership-plan-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

import { AddMembershipPlanPage } from './add-membership-plan.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddMembershipPlanPageRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [AddMembershipPlanPage]
})
export class AddMembershipPlanPageModule {}
