import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MemberDetailsPage } from './member-details.page';

const routes: Routes = [
  {
    path: '',
    component: MemberDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemberDetailsPageRoutingModule {}
