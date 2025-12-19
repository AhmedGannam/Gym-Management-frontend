import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterOwnerPageRoutingModule } from './register-owner-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterOwnerPage } from './register-owner.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterOwnerPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [RegisterOwnerPage]
})
export class RegisterOwnerPageModule {}
