import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterOwnerPage } from './register-owner.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterOwnerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterOwnerPageRoutingModule {}
