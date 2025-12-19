import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const expectedRoles = route.data['roles'] as Array<'owner' | 'member' | 'staff' | 'admin'>;

    return this.authService.currentUser().pipe(
      map(user => {
        if (user && expectedRoles.includes(user.role)) {
          return true; // User has the required role
        } else {
          // Redirect based on role or to a generic access denied page
          if (user) {
            if (user.role === 'owner' || user.role === 'staff') {
              return this.router.createUrlTree(['/owner-tabs/dashboard']);
            } else if (user.role === 'admin') {
              return this.router.createUrlTree(['/admin-dashboard']);
            } else if (user.role === 'member') {
              return this.router.createUrlTree(['/member-tabs/dashboard']);
            }
          }
          // If no user or unexpected role, go to login
          return this.router.createUrlTree(['/login']);
        }
      })
    );
  }
}