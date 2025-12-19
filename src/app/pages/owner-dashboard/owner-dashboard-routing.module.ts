import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OwnerDashboardPage } from './owner-dashboard.page';
import { SharedModule } from 'src/app/shared/shared.module';
const routes: Routes = [
  {
    path: '',
    component: OwnerDashboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
})
export class OwnerDashboardPageRoutingModule {}
