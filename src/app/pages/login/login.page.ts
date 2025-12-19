import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit, OnDestroy, AfterViewInit {
  email!: string;
  password!: string;
  isLoading = false;
  showDemoNote = true;
  formError = '';
  private authSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    // Optional: Auto-redirect if already logged in (e.g., token still valid)
    this.authSubscription = this.authService.currentUser().subscribe(user => {
      if (user) {
        this.redirectToDashboard(user.role);
      }
    });
  }

  ngAfterViewInit() {
    this.setupInputEffects();
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  async login() {
    if (!this.email || !this.password) {
      this.notificationService.showAlert('Missing Information', 'Please enter both email and password.');
      return;
    }
    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Accessing your dashboard...',
      spinner: 'crescent'
    });
    await loading.present();
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        loading.dismiss();
        const currentUser = this.authService.getCurrentUserValue();
        if (currentUser) {
          this.redirectToDashboard(currentUser.role);
        } else {
          this.notificationService.showAlert('Login Failed', 'Could not retrieve user role after login. Please try again.');
          this.authService.logout();
        }
      },
      error: (err) => {
        loading.dismiss();
        const errorMessage = this.notificationService.getFriendlyError(err);
        this.notificationService.showAlert('Login Failed', errorMessage);
      }
    }).add(() => {
      this.isLoading = false;
      try {
        loading.dismiss();
      } catch (e) {
        // ignore
      }
    });
  }

  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  redirectToDashboard(role: 'owner' | 'member' | 'staff' | 'admin') {
    if (role === 'owner' || role === 'staff') {
      this.router.navigateByUrl('/owner-tabs/dashboard', { replaceUrl: true });
    } else if (role === 'admin') {
      this.router.navigateByUrl('/admin-dashboard', { replaceUrl: true });
    } else if (role === 'member') {
      this.router.navigateByUrl('/member-tabs/dashboard', { replaceUrl: true });
    }
  }

  // Setup input focus effects
  private setupInputEffects() {
    const inputs = document.querySelectorAll('ion-input.input-field');
    inputs.forEach(input => {
      const ionInput = input as any;

      ionInput.addEventListener('ionFocus', () => {
        input.classList.add('has-focus');
        const parent = input.parentElement;
        if (parent) {
          parent.style.transform = 'scale(1.02)';
        }
      });

      ionInput.addEventListener('ionBlur', () => {
        input.classList.remove('has-focus');
        const parent = input.parentElement;
        if (parent) {
          parent.style.transform = 'scale(1)';
        }
      });
    });
  }
}