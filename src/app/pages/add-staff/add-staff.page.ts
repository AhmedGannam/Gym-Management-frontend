import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OwnerService } from 'src/app/core/services/owner.service';
import { NavController } from '@ionic/angular';
import { NotificationService } from 'src/app/core/services/notification.service';
import { LoaderService } from '../../core/services/loader.service';

@Component({
  selector: 'app-add-staff',
  templateUrl: './add-staff.page.html',
  styleUrls: ['./add-staff.page.scss'],
  standalone: false,
})
export class AddStaffPage implements OnInit {
  staffForm: FormGroup;
  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private ownerService: OwnerService,
    private navCtrl: NavController,
    private notificationService: NotificationService,
    private loader: LoaderService
  ) {
    this.staffForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      staff_role: [''],
      notes: ['']
    });
  }

  ngOnInit() {}

  async onSubmit() {
    if (this.staffForm.invalid) return;
    this.loader.show('Adding staff...');
    this.errorMessage = null;
    this.successMessage = null;
    try {
      await this.ownerService.addStaff(this.staffForm.value).toPromise();
      this.successMessage = 'Staff added successfully!';
      this.staffForm.reset();
      this.staffForm.markAsPristine();
      this.staffForm.markAsUntouched();
      this.notificationService.showToast(this.successMessage, 'success');
      this.navCtrl.navigateRoot('/owner-tabs/dashboard');
    } catch (err: any) {
      this.errorMessage = this.notificationService.getFriendlyError(err);
      this.notificationService.showToast(this.errorMessage ?? 'An error occurred while adding staff.', 'error');
    } finally {
      this.loader.hide();
    }
  }
}