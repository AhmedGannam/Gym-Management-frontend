import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OwnerService } from 'src/app/core/services/owner.service';
import { AuthService } from '../../core/services/auth.service';
import { NavController } from '@ionic/angular';
import { SharedService } from 'src/app/core/services/shared.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { LoaderService } from '../../core/services/loader.service';

// Import the new centralized models
import { MembershipPlan } from 'src/app/core/models/membership-plan.model';
import { AddMemberPayload } from 'src/app/core/models/member.model'; // AddMemberPayload is now in member.model.ts
import { ApiSuccessResponse } from 'src/app/core/models/common.model'; // Generic success response

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.page.html',
  styleUrls: ['./add-member.page.scss'],
  standalone: false
})
export class AddMemberPage implements OnInit {
  addMemberForm!: FormGroup;
  membershipPlans: MembershipPlan[] = [];
  loading = false;
  errorMessage: string | null = null;

  // Define payment methods and transaction types based on your backend enums
  paymentMethods = ['cash', 'upi', 'card', 'bank_transfer', 'online_gateway'];
  transactionTypes = ['membership_payment', 'admission_fee', 'merchandise', 'personal_training', 'other_fee'];
  memberPaymentStatus = ['paid', 'due', 'partially_paid', 'refunded'];

  constructor(
    private fb: FormBuilder,
    private ownerService: OwnerService,
    private authService: AuthService,
    private navCtrl: NavController,
    private sharedService: SharedService,
    private notificationService: NotificationService,
    private loader: LoaderService
  ) { }

  ngOnInit() {
    this.initForm();
    this.loadMembershipPlans();

    // Subscribe to changes in selected_plan_id to auto-populate fields
    this.addMemberForm.get('selected_plan_id')?.valueChanges.subscribe(planId => {
      this.onPlanChange(planId);
    });

    // Subscribe to changes in paid_amount to update payment_status
    this.addMemberForm.get('paid_amount')?.valueChanges.subscribe(paidAmount => {
      this.updatePaymentStatus();
    });

    this.togglePaymentFieldValidators();
  }

  initForm() {
    this.addMemberForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      selected_plan_id: [null], // Optional
      admission_fee: [0, [Validators.min(0)]], // Default to 0, min 0
      paid_amount: [0, [Validators.min(0)]], // Default to 0, min 0
      payment_method: ['cash'], // No Validators.required initially
      transaction_type: ['membership_payment'], // No Validators.required initially
      payment_status: ['due'], // No Validators.required initially
      start_date: [''], // Will be set on plan selection
      end_date: [''],   // Will be set on plan selection
    });
  }

    togglePaymentFieldValidators() {
    const paymentMethodControl = this.addMemberForm.get('payment_method');
    const transactionTypeControl = this.addMemberForm.get('transaction_type');
    const paymentStatusControl = this.addMemberForm.get('payment_status');

    if (this.showPaymentFields()) {
      paymentMethodControl?.setValidators(Validators.required);
      transactionTypeControl?.setValidators(Validators.required);
      paymentStatusControl?.setValidators(Validators.required);
    } else {
      paymentMethodControl?.clearValidators();
      transactionTypeControl?.clearValidators();
      paymentStatusControl?.clearValidators();
    }
    // Update validity for these controls to re-run validators
    paymentMethodControl?.updateValueAndValidity();
    transactionTypeControl?.updateValueAndValidity();
    paymentStatusControl?.updateValueAndValidity();
  }

  async loadMembershipPlans() {
    this.loader.show('Loading membership plans...');
    try {
      const response = await this.ownerService.getMembershipPlans().toPromise();
      this.membershipPlans = response?.plans || [];
    } catch (error) {
      this.notificationService.showToast('Could not load membership plans. Please check your connection.', 'error');
    } finally {
      this.loader.hide();
    }
  }

  onPlanChange(planId: number | null) { // Ensure this method accepts an argument
    const paidAmountControl = this.addMemberForm.get('paid_amount');
    const transactionTypeControl = this.addMemberForm.get('transaction_type');
    const startDateControl = this.addMemberForm.get('start_date');
    const endDateControl = this.addMemberForm.get('end_date');

    if (planId) {
      const plan = this.membershipPlans.find(p => p.plan_id === planId);
      if (plan) {
        paidAmountControl?.setValue(plan.price, { emitEvent: false }); // Use emitEvent: false
        transactionTypeControl?.setValue('membership_payment', { emitEvent: false }); // Use emitEvent: false

        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + plan.duration_months);

        startDateControl?.setValue(startDate.toISOString().slice(0, 10), { emitEvent: false });
        endDateControl?.setValue(endDate.toISOString().slice(0, 10), { emitEvent: false });
      }
    } else {
      // If no plan selected, reset related fields
      paidAmountControl?.setValue(0, { emitEvent: false });
      startDateControl?.setValue('', { emitEvent: false });
      endDateControl?.setValue('', { emitEvent: false });
      
      // Determine transaction type based on admission fee if no plan
      const admissionFee = this.addMemberForm.get('admission_fee')?.value || 0;
      if (admissionFee > 0) {
          transactionTypeControl?.setValue('admission_fee', { emitEvent: false });
      } else {
          transactionTypeControl?.setValue('other_fee', { emitEvent: false }); // Fallback
      }
    }
    this.updatePaymentStatus(); // Recalculate payment status after changes
  }

  updatePaymentStatus() {
    // ... (no changes needed here, already correct) ...
    const selectedPlanId = this.addMemberForm.get('selected_plan_id')?.value;
    const admissionFee = parseFloat(this.addMemberForm.get('admission_fee')?.value) || 0;
    const paidAmount = parseFloat(this.addMemberForm.get('paid_amount')?.value) || 0;

    let totalExpectedAmount = admissionFee;
    if (selectedPlanId) {
      const plan = this.membershipPlans.find(p => p.plan_id === selectedPlanId);
      if (plan) {
        totalExpectedAmount += plan.price;
      }
    }

    if (paidAmount >= totalExpectedAmount) {
      this.addMemberForm.get('payment_status')?.setValue('paid');
    } else if (paidAmount > 0) {
      this.addMemberForm.get('payment_status')?.setValue('partially_paid');
    } else {
      this.addMemberForm.get('payment_status')?.setValue('due');
    }
  }

  async onSubmit() {
    this.togglePaymentFieldValidators();
    if (this.addMemberForm.invalid) {
      this.addMemberForm.markAllAsTouched();
      this.notificationService.showToast('Please fill in all required fields correctly.', 'error');
      return;
    }
    this.loader.show('Adding member...');
    this.errorMessage = null;
    try {
      const gym_id = this.authService.getGymId();
      if (gym_id === null) {
        this.errorMessage = 'Gym ID not found. Please log in again.';
        this.notificationService.showToast(this.errorMessage, 'error');
        this.loader.hide();
        return;
      }
      const formData: AddMemberPayload = {
        ...this.addMemberForm.value,
        gym_id: gym_id,
      };
      if (formData.selected_plan_id === null) {
        delete formData.selected_plan_id;
        delete formData.start_date;
        delete formData.end_date;
      }
      if (formData.admission_fee === 0) {
        delete formData.admission_fee;
      }
      if (formData.paid_amount === 0) {
        delete formData.paid_amount;
      }
      const response = await this.ownerService.addMember(formData).toPromise() as { message: string };
      this.notificationService.showToast(response?.message ?? 'Member added successfully!', 'success');
      this.addMemberForm.reset();
      this.initForm();
      this.sharedService.triggerRefresh('members');
      this.navCtrl.navigateRoot('/owner-tabs/members');
    } catch (error: any) {
      this.errorMessage = this.notificationService.getFriendlyError(error);
      this.notificationService.showToast(this.errorMessage ?? 'An error occurred while adding member.', 'error');
    } finally {
      this.loader.hide();
    }
  }

  showPaymentFields(): boolean {
    const planSelected = !!this.addMemberForm.get('selected_plan_id')?.value;
    const admissionFeeEntered = (this.addMemberForm.get('admission_fee')?.value || 0) > 0;
    return planSelected || admissionFeeEntered;
  }  
}