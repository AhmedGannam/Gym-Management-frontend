import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StaffListPageRoutingModule } from './staff-list-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { StaffListPage } from './staff-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StaffListPageRoutingModule,
    SharedModule
  ],
  declarations: [StaffListPage]
})
export class StaffListPageModule {}
