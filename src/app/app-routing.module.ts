import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { AuthService } from './core/services/auth.service';
import { map } from 'rxjs/operators';
import { SplashScreenComponent } from './shared/components/splash-screen/splash-screen.component';
import { Router } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: SplashScreenComponent
  },
  {
    path: 'splash',
    component: SplashScreenComponent
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register-owner',
    loadChildren: () => import('./pages/register-owner/register-owner.module').then(m => m.RegisterOwnerPageModule)
  },
  {
    path: 'owner-tabs',
    loadChildren: () => import('./pages/owner-tabs/owner-tabs.module').then(m => m.OwnerTabsPageModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['owner', 'staff'] } // Only owners and staff can access this route
  },
  {
    path: 'admin-login',
    loadChildren: () => import('./pages/admin-login/admin-login.module').then(m => m.AdminLoginPageModule)
  },
  {
    path: 'admin-dashboard',
    loadChildren: () => import('./pages/admin-dashboard/admin-dashboard.module').then(m => m.AdminDashboardPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./pages/reset-password/reset-password.module').then(m => m.ResetPasswordPageModule)
  },
  // Catch-all for undefined routes - MUST BE LAST
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
  providers: [
    {
      provide: 'redirectAfterLogin',
      useFactory: (authService: AuthService, router: Router) => () => {
        const user = authService.getCurrentUserValue();
        if (user) {
          if (user.role === 'owner') {
            router.navigateByUrl('/owner-tabs/dashboard', { replaceUrl: true });
          } else {
            router.navigateByUrl('/login', { replaceUrl: true });
          }
        } else {
          router.navigateByUrl('/login', { replaceUrl: true });
        }
      },
      deps: [AuthService, Router]
    }
  ]
})
export class AppRoutingModule { }