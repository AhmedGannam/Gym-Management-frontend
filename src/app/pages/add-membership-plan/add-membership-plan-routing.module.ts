import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddMembershipPlanPage } from './add-membership-plan.page';

const routes: Routes = [
  {
    path: '',
    component: AddMembershipPlanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddMembershipPlanPageRoutingModule {}
