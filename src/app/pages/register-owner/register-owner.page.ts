import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LoadingController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-register-owner',
  templateUrl: './register-owner.page.html',
  styleUrls: ['./register-owner.page.scss'],
  standalone: false
})
export class RegisterOwnerPage implements OnInit {
  ownerForm: FormGroup;
  isLoading = false;
  @ViewChild('formElement') formElement!: ElementRef;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.ownerForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      gym_name: ['', Validators.required],
      contact_email: ['', Validators.email],
      contact_phone: [''],
      address: [''],
      city: [''],
      state: [''],
      termsAccepted: [false, Validators.requiredTrue]
    });
  }

  ngOnInit() {
    // Add scroll adjustments for mobile keyboards
    const inputs = document.querySelectorAll('ion-input');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        setTimeout(() => {
          input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      });
    });
  }

  async registerOwner() {
    if (this.ownerForm.invalid) {
      this.ownerForm.markAllAsTouched();
      this.notificationService.showAlert('Validation Error', 'Please fill in all required fields correctly.');
      return;
    }
    
    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Creating account...',
      spinner: 'crescent'
    });
    
    await loading.present();
    
    this.authService.registerOwner({ ...this.ownerForm.value }).subscribe({
      next: async (res) => {
        await loading.dismiss();
        this.isLoading = false;
        await this.notificationService.showAlert(
          'Registration Successful', 
          `Gym '${this.ownerForm.value.gym_name}' registered! Your join code is: ${res.gym_join_code}. Please login now.`
        );
        this.router.navigate(['/login']);
      },
      error: async (err) => {
        await loading.dismiss();
        this.isLoading = false;
        const errorMessage = this.notificationService.getFriendlyError(err);
        await this.notificationService.showAlert('Registration Failed', errorMessage);
      }
    });
  }

  // Navigation for terms links
  openTerms() {
    // Implement your terms navigation
    console.log('Open terms');
    // this.router.navigate(['/terms']);
  }

  openPrivacy() {
    // Implement your privacy policy navigation
    console.log('Open privacy policy');
    // this.router.navigate(['/privacy']);
  }

  get f() { return this.ownerForm.controls; }
}