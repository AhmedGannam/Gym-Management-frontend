import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { ChartsModule } from 'ng2-charts';
import { IonicModule } from '@ionic/angular';
import { BaseChartDirective } from 'ng2-charts';
import { OwnerDashboardPageRoutingModule } from './owner-dashboard-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { OwnerDashboardPage } from './owner-dashboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OwnerDashboardPageRoutingModule,
    BaseChartDirective,
    SharedModule
  ],
  declarations: [OwnerDashboardPage]
})
export class OwnerDashboardPageModule {}
