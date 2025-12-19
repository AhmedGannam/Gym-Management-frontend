import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: false
})
export class ForgotPasswordPage implements OnInit {
  forgotForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private navCtrl: NavController
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    if (this.forgotForm.invalid) return;

    this.isLoading = true;
    const { email } = this.forgotForm.value;

    this.authService.forgotPassword(email).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.notificationService.showAlert('Email Sent', res.message || 'If a user with that email exists, a reset link has been sent.', ['OK']);
        this.navCtrl.back();
      },
      error: (err) => {
        this.isLoading = false;
        const msg = this.notificationService.getFriendlyError(err);
        this.notificationService.showToast(msg, 'error');
      }
    });
  }
}
