import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OwnerService } from 'src/app/core/services/owner.service';
import { Member } from 'src/app/core/models/member.model';
import { ToastController } from '@ionic/angular';
import { SharedService } from 'src/app/core/services/shared.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PersonalTraining } from 'src/app/core/models/personal-training.model';
import { Staff } from 'src/app/core/models/staff.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { NotificationService } from 'src/app/core/services/notification.service';
import { LoaderService } from '../../core/services/loader.service';
@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.page.html',
  styleUrls: ['./member-details.page.scss'],
  standalone: false,
})
export class MemberDetailsPage implements OnInit {
  memberId!: number;
  member: any = null;
  memberships: any[] = [];
  transactions: any[] = [];
  loading = false;
  error: string | null = null;
  personalTrainingForm: FormGroup;
  showAddMembershipForm = false;
  showAddPersonalMembershipForm = false;
  addMembershipData = {
    plan_id: null,
    start_date: '',
    end_date: '',
    admission_fee: 0,
    paid_amount: 0,
    payment_method: 'cash',
    transaction_type: 'membership_payment',
    payment_status: 'due',
  };
    addPersonalMembershipData = {
    duration:'',
    price: 0 ,
    payment_method: 'cash',
  };
  membershipPlans: any[] = [];
  isMembershipActive = false;
  personalTrainings: PersonalTraining[] = [];
  staffList: Staff[] = [];
  
  private apiBaseUrl = environment.apiBaseUrl;
  defaultAvatar = '../../../assets/avatar.png';

  constructor(
    private route: ActivatedRoute,
    private OwnerService: OwnerService,
    private toastController: ToastController,
    private sharedService: SharedService,
    private http: HttpClient, // Injected HttpClient for photo upload
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private loader: LoaderService
  ) { 
    this.personalTrainingForm = this.fb.group({
      duration_months: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(1)]],
      staff_id: [null],
      payment_method: ['cash', Validators.required],
      notes: ['']
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.memberId = +id;
        this.fetchMemberDetails();
        this.loadMembershipPlans();
        this.loadStaffList();
      }
    });
  }

  loadStaffList() {
    this.OwnerService.getStaffList(1, 1000).subscribe({
      next: (response: any) => this.staffList = response.staff,
      error: () => this.staffList = []
    });
  }

  fetchMemberDetails() {
    // Only show loader if we don't have member data or if we are loading a different member
    const isDifferentMember = !this.member || this.member.member_id !== this.memberId;
    if (isDifferentMember) {
      this.loader.show('Loading member details...');
    }

    this.OwnerService.getMemberDetails(this.memberId).subscribe({
      next: (data) => {
        this.member = data.member;
        this.memberships = data.memberships;
        this.transactions = data.transactions;
        this.personalTrainings = data.personal_trainings || [];
        this.member.current_membership = this.memberships.find(m => m.status === 'active')
        || this.memberships[0]
        || null;
        this.isMembershipActive = this.checkActiveMembership();
        this.loader.hide();
      },
      error: (err) => {
        this.error = 'Failed to load member details.';
        this.loader.hide();
      }
    });
  }

  async onAddPersonalTraining() {
    if (this.personalTrainingForm.invalid) return;
    const data = this.personalTrainingForm.value;
    try {
      await this.OwnerService.addPersonalTrainingToMember(this.member.member_id, data).toPromise();
      this.personalTrainingForm.reset({ payment_method: 'cash', duration_months: 1, price: 0 });
      this.fetchMemberDetails();
      this.notificationService.showToast('Personal training added successfully!', 'success');
    } catch (err: any) {
      this.notificationService.showToast(this.notificationService.getFriendlyError(err), 'error');
    }
  }

  loadMembershipPlans() {
    this.OwnerService.getMembershipPlans(1, 1000).subscribe({
      next: (response: any) => this.membershipPlans = response.plans,
      error: () => this.membershipPlans = []
    });
  }

  checkActiveMembership(): boolean {
    const now = new Date();
    return this.memberships.some(m => {
      if (!m.end_date) return false;
      const end = new Date(m.end_date);
      return end >= now && (m.status === 'active' || m.status === 'paid');
    });
  }

  get isPersonalTrainingActive(): boolean {
    return this.personalTrainings.some(pt => pt.status === 'active');
  }

  getPhotoUrl(photo: string | null): string {
    if (!photo) return this.defaultAvatar;
    // If photo is already a full URL, use it directly
    if (photo.startsWith('http://') || photo.startsWith('https://')) return photo;
    // Otherwise, prepend apiBaseUrl
    return this.apiBaseUrl + photo;
  }

  async showMembershipActiveToast() {
    this.notificationService.showToast('This member already has an active membership.', 'info');
  }

  toggleAddMembershipForm() {
    if (this.isMembershipActive) {
      this.showMembershipActiveToast();
      return;
    }
    this.showAddMembershipForm = !this.showAddMembershipForm;
    if (!this.showAddMembershipForm) {
      this.resetAddMembershipForm();
    }
  }
   async showPersonalMembershipActiveToast() {
    this.notificationService.showToast('This member already has an active Personal membership.', 'info');
  }
  toggleAddPersonalMembershipForm() {
    if (this.isPersonalTrainingActive) {
      this.showPersonalMembershipActiveToast();
      return;
    }
    this.showAddPersonalMembershipForm = !this.showAddPersonalMembershipForm;
    if (!this.showAddPersonalMembershipForm) {
      this.resetAddPersonalMembershipForm();
    }
  }

  onPlanChange() {
    // Ensure membershipPlans is an array before trying to find a plan
    if (!Array.isArray(this.membershipPlans)) {
      console.warn('membershipPlans is not an array.');
      return;
    }
    const plan = this.membershipPlans.find((p: any) => p.plan_id === this.addMembershipData.plan_id);
    if (plan) {
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + plan.duration_months);
      this.addMembershipData.start_date = startDate.toISOString().slice(0, 10);
      this.addMembershipData.end_date = endDate.toISOString().slice(0, 10);
      this.addMembershipData.paid_amount = plan.price;
      this.addMembershipData.payment_status = 'paid';
    } else {
      this.addMembershipData.paid_amount = 0;
      this.addMembershipData.payment_status = 'due';
      this.addMembershipData.start_date = '';
      this.addMembershipData.end_date = '';
    }
  }

  onPaidAmountChange() {
    // Ensure membershipPlans is an array before trying to find a plan
    if (!Array.isArray(this.membershipPlans)) {
      console.warn('membershipPlans is not an array.');
      return;
    }
    const plan = this.membershipPlans.find((p: any) => p.plan_id === this.addMembershipData.plan_id);
    if (plan) {
      const paid = Number(this.addMembershipData.paid_amount);
      if (paid >= plan.price) {
        this.addMembershipData.payment_status = 'paid';
        this.addMembershipData.paid_amount = plan.price;
      } else if (paid > 0) {
        this.addMembershipData.payment_status = 'partially_paid';
      } else {
        this.addMembershipData.payment_status = 'due';
      }
    }
  }

  async addMembership() {
    if (!this.addMembershipData.plan_id || !this.addMembershipData.start_date || !this.addMembershipData.end_date) {
      this.error = 'Please fill all required fields for membership.';
      return;
    }
    this.loading = true;
    try {
      const payload = {
        plan_id: this.addMembershipData.plan_id,
        gym_id: this.member?.gym_id,
        start_date: this.addMembershipData.start_date,
        end_date: this.addMembershipData.end_date,
        payments: [
          {
            amount: this.addMembershipData.paid_amount,
            method: this.addMembershipData.payment_method,
            type: this.addMembershipData.transaction_type,
            description: 'Membership payment',
            transaction_date: new Date().toISOString()
          }
        ],
        admission_fee: this.addMembershipData.admission_fee
      };
      if (this.addMembershipData.admission_fee && this.addMembershipData.admission_fee > 0) {
        payload.payments.push({
          amount: this.addMembershipData.admission_fee,
          method: this.addMembershipData.payment_method,
          type: 'admission_fee',
          description: 'Admission fee',
          transaction_date: new Date().toISOString()
        });
      }
      await this.OwnerService.addMembershipToMember(this.memberId, payload).toPromise();
      this.showAddMembershipForm = false;
      this.resetAddMembershipForm();
      this.fetchMemberDetails();
      this.sharedService.triggerRefresh('members');
      this.sharedService.triggerRefresh('transactions');
      this.sharedService.triggerRefresh('dashboard');
      await this.notificationService.showToast('Membership added successfully.', 'success');
    } catch (error) {
      this.error = 'Failed to add membership.';
      await this.notificationService.showToast('Failed to add membership.', 'error');
    }
    this.loading = false;
  }

  async takePhoto(member: any) {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });
      if (image && image.dataUrl) {
        const blob = await (await fetch(image.dataUrl)).blob();
        const formData = new FormData();
        formData.append('photo', blob, 'photo.jpg');
        this.loading = true;
        try {
          const response = await this.http.put<any>(
            `${this.apiBaseUrl}/owner/members/${member.member_id}/photo`,
            formData
          ).toPromise();
          member.photo = response.photo;
          this.notificationService.showToast('Photo updated successfully!', 'success');
        } catch (err) {
          this.notificationService.showToast('Photo upload failed. Please try again.', 'error');
        } finally {
          this.loading = false;
        }
      }
    } catch (err) {
      this.notificationService.showToast('Camera cancelled or failed.', 'info');
    }
  }
  
  async uploadPhoto(member: Member, event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('photo', file);
    this.loading = true;
    try {
      const response = await this.http.put<any>(
        `${this.apiBaseUrl}/owner/members/${member.member_id}/photo`,
        formData
      ).toPromise();
      member.photo = response.photo;
      this.notificationService.showToast('Photo updated successfully!', 'success');
    } catch (err) {
      this.notificationService.showToast('Photo upload failed. Please try again.', 'error');
    } finally {
      this.loading = false;
    }
  }

  resetAddMembershipForm() {
    this.addMembershipData = {
      plan_id: null,
      start_date: '',
      end_date: '',
      admission_fee: 0,
      paid_amount: 0,
      payment_method: 'cash',
      transaction_type: 'membership_payment',
      payment_status: 'due',
    };
  }
   resetAddPersonalMembershipForm() {
    this.    addPersonalMembershipData = {
    duration:'',
    price: 0 ,
    payment_method: 'cash',
  };
  }

  get selectedPlan() {
    return this.membershipPlans?.find((p: any) => p.plan_id === this.addMembershipData.plan_id) || null;
  }

  get selectedPlanPrice() {
    return this.selectedPlan ? this.selectedPlan.price : null;
  }
}
