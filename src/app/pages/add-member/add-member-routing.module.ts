import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddMemberPage } from './add-member.page';

const routes: Routes = [
  {
    path: '',
    component: AddMemberPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddMemberPageRoutingModule {}
