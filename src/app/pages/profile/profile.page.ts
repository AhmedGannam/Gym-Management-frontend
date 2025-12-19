import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { OwnerService } from 'src/app/core/services/owner.service';
import { Validators } from '@angular/forms';
import { Router} from '@angular/router';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  userProfile: any = null;
  loading = false;
  editForm!: FormGroup;
  isEditModalOpen = false;
  editingField: string | null = null;
  gymInfo: any = null;
  user: any = { name: 'Owner', email: 'owner@gymapp.com', avatar: '' };

  constructor(
    private ownerService: OwnerService,
    private authService: AuthService, 
    private notificationService: NotificationService,
    private fb: FormBuilder,
   private router: Router) { 
   }
    

  ngOnInit() {
    this.loadProfile();
    this.loadGymInfo();
  }

  async loadProfile() {
    this.loading = true;
    try {
      this.userProfile = await this.authService.getProfile().toPromise();
    } catch (e) {
      this.notificationService.showToast('Failed to load profile', 'error');
    }
    this.loading = false;
  }
    async loadGymInfo() {
    this.loading = true;
    try {
      this.gymInfo = await this.ownerService.getGymInfo().toPromise();
    } catch (e) {
      this.notificationService.showToast('Could not load gym info', 'error');
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
  async uploadPhoto(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('photo', file);
    this.loading = true;
    try {
      const res = await this.authService.uploadProfilePhoto(formData).toPromise();
      this.userProfile.photo = res.photo;
      this.notificationService.showToast('Photo updated!', 'success');
    } catch (e) {
      this.notificationService.showToast('Photo upload failed', 'error');
    }
    this.loading = false;
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
    logout() {
    this.notificationService.showToast('Logged out!', 'success');
    this.authService.logout()
  }
  settings(){
    this.router.navigate(['owner-tabs/settings'])
  }

}
