import { Component, OnInit } from '@angular/core';
import { OwnerService } from 'src/app/core/services/owner.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NotificationService } from 'src/app/core/services/notification.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false
})
export class SettingsPage implements OnInit {
  gymInfo: any = null;
  user: any = { name: 'Owner', email: 'owner@gymapp.com', avatar: '' };
  loading = false;
  // unused forms removed
  editForm!: FormGroup;
  isEditModalOpen = false;
  editingField: string | null = null;
  darkMode = false;
  currentPasswordValid: boolean | null = null;
  passwordsMatch: boolean = true;

  // New for password change
  isChangePasswordModalOpen = false;
  changePasswordForm!: FormGroup;



  constructor(
    private ownerService: OwnerService,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.loadGymInfo();
    this.loadUserProfile();
    const stored = localStorage.getItem('darkMode');
    this.darkMode = stored === 'true';
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
    this.changePasswordForm.get('confirmPassword')?.valueChanges.subscribe(val => {
      this.passwordsMatch = val === this.changePasswordForm.get('newPassword')?.value;
    });
    this.changePasswordForm.get('newPassword')?.valueChanges.subscribe(val => {
      this.passwordsMatch = val === this.changePasswordForm.get('confirmPassword')?.value;
    });

    // WhatsApp integration removed
  }

  async loadGymInfo() {
    // Silent update if we already have data
    if (!this.gymInfo) {
      this.loading = true;
    }
    try {
      this.gymInfo = await this.ownerService.getGymInfo().toPromise();
    } catch (e) {
      this.notificationService.showToast('Could not load gym info', 'error');
    } finally {
      this.loading = false;
    }
  }

  async validateCurrentPassword() {
    const currentPassword = this.changePasswordForm.get('currentPassword')?.value;
    if (!currentPassword) {
      this.currentPasswordValid = null;
      return;
    }
    try {
      // Try to change password with a dummy new password to check validity
      await this.authService.changePassword(currentPassword, '___dummy___').toPromise();
      // If it succeeds, that's a problem (should not allow dummy password)
      this.currentPasswordValid = false;
    } catch (e: any) {
      // If error is "Current password is incorrect", set invalid
      if (e?.error?.error === 'Current password is incorrect.') {
        this.currentPasswordValid = false;
      } else if (e?.error?.error === 'New password must be at least 6 characters.') {
        // This means current password is correct, but new password is too short (dummy)
        this.currentPasswordValid = true;
      } else {
        this.currentPasswordValid = null;
      }
    }
  }

  async changePassword() {
    if (this.changePasswordForm.invalid || !this.passwordsMatch) return;
    const { currentPassword, newPassword } = this.changePasswordForm.value;
    this.loading = true;
    try {
      await this.authService.changePassword(currentPassword, newPassword).toPromise();
      this.notificationService.showToast('Password changed successfully!', 'success');
      this.isChangePasswordModalOpen = false;
      this.changePasswordForm.reset();
      this.currentPasswordValid = null;
      this.passwordsMatch = true;
    } catch (e: any) {
      this.notificationService.showToast(e?.error?.error || 'Password change failed', 'error');
    } finally {
      this.loading = false;
    }
  }

  async loadUserProfile() {
    try {
      const user = await this.authService.getProfile().toPromise();
      this.user = {
        name: user.first_name + ' ' + (user.last_name || ''),
        email: user.email,
        avatar: user.photo,
        role: user.role
      };
    } catch (e) {
      this.user = { name: 'Owner', email: 'owner@gymapp.com', avatar: '', role: 'owner' };
    }
  }

  openEditModal(field: string) {
    this.editingField = field;
    this.editForm = this.fb.group({
      value: [this.gymInfo[field], [Validators.required]]
    });
    this.isEditModalOpen = true;
  }

  async saveEdit() {
    if (!this.editingField) return;
    try {
      await this.ownerService.updateGymInfo({ [this.editingField]: this.editForm.value.value }).toPromise();
      this.notificationService.showToast('Updated successfully', 'success');
      this.isEditModalOpen = false;
      this.loadGymInfo();
    } catch (e) {
      this.notificationService.showToast('Update failed', 'error');
    }
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.editingField = null;
  }

  copyJoinCode() {
    navigator.clipboard.writeText(this.gymInfo.unique_join_code);
    this.notificationService.showToast('Join code copied!', 'success');
  }

  toggleDarkMode(event: any) {
    this.darkMode = event.detail.checked;
    document.body.classList.toggle('dark', this.darkMode);
    localStorage.setItem('darkMode', this.darkMode ? 'true' : 'false');
  }

  // New: Edit avatar
  editAvatar() {
    this.notificationService.showToast('Avatar editing coming soon!', 'info');
  }

  // New: Password change modal
  openChangePasswordModal() {
    this.isChangePasswordModalOpen = true;
  }
  closeChangePasswordModal() {
    this.isChangePasswordModalOpen = false;
  }

  logout() {
    this.notificationService.showToast('Logged out!', 'success');
    this.authService.logout()
  }



  // WhatsApp integration logic removed
}