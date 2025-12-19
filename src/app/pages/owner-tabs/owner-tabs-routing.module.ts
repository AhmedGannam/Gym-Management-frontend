import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OwnerTabsPage } from './owner-tabs.page';

const routes: Routes = [
  {
    path: '', // Path relative to '/owner-tabs'
    component: OwnerTabsPage,
    children: [
      {
        path: 'dashboard', // e.g., /owner-tabs/dashboard
        loadChildren: () => import('../owner-dashboard/owner-dashboard.module').then(m => m.OwnerDashboardPageModule)
      },
      {
        path: 'members', // e.g., /owner-tabs/members
        loadChildren: () => import('../members/members.module').then(m => m.MembersPageModule) // Assuming 'members' page exists
      },
      {
        path: 'settings',
        loadChildren: () => import('../settings/settings.module').then( m => m.SettingsPageModule),
      },
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: '', // Default child route for owner-tabs
        redirectTo: '/owner-tabs/dashboard',
        pathMatch: 'full'
      },
      
      {
        path: 'transactions',
        loadChildren: () => import('../transactions/transactions.module').then(m => m.TransactionsPageModule)
      },
      {
          path: 'add-member',
    loadChildren: () => import('../add-member/add-member.module').then(m => m.AddMemberPageModule)
  },
  {
    path: 'add-membership-plan',
    loadChildren: () => import('../add-membership-plan/add-membership-plan.module').then(m => m.AddMembershipPlanPageModule)
  },
  {
    path: 'add-staff',
    loadChildren: () => import('../add-staff/add-staff.module').then(m => m.AddStaffPageModule)
  },
  {
    path: 'staff-list',
    loadChildren: () => import('../staff-list/staff-list.module').then(m => m.StaffListPageModule)
  }

    ]
  },
  {
    path: '',
    redirectTo: '/owner-tabs/dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OwnerTabsPageRoutingModule {}