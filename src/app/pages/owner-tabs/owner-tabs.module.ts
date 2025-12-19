import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OwnerTabsPageRoutingModule } from './owner-tabs-routing.module'; // Import routing module
import { OwnerTabsPage } from './owner-tabs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OwnerTabsPageRoutingModule // Add this here
  ],
  declarations: [OwnerTabsPage]
})
export class OwnerTabsPageModule {}