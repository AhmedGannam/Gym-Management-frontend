// transactions.page.ts
import { Component, OnInit } from '@angular/core';
import { OwnerService } from 'src/app/core/services/owner.service';
import { DatePipe } from '@angular/common';
import { OwnerDashboardData } from 'src/app/core/models/gym.model';
import { LoadingController } from '@ionic/angular';
import { NotificationService } from 'src/app/core/services/notification.service';
@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
  standalone: false,
  providers: [DatePipe]
})
export class TransactionsPage implements OnInit {
  transactions: any[] = [];
  filteredTransactions: any[] = [];
  isLoading = true;
  error: string | null = null;
  filters = {
    type: 'all',
    period: 'month',
    search: ''
  };
  // Summary stats
  totalAmount = 0;
  todayAmount = 0;
  monthAmount = 0;
    dashboardData: OwnerDashboardData = {
    active_memberships: 0,
    total_revenue: 0,
    todays_revenue: 0,
    monthly_revenue: [], // Initialize as an empty array
    gym_info: {
      gym_name: '',
      unique_join_code: '',
      contact_email: '',
      contact_phone: ''
    },
    counts: {
      total_members: 0,
      active_members: 0,
      pending_members: 0,
      expired_memberships: 0, // Default for new property
      revenue_this_month: '0.00', // Default for new property,
      total_staffs: 0
    }
  };

  constructor(
    private ownerService: OwnerService,
    private datePipe: DatePipe,
    private loadingController: LoadingController,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.fetchTransactions();
    this.loadDashboardData();
  }

  async loadDashboardData() {
    // Only show full loader if we don't have gym name yet (first load)
    if (!this.dashboardData.gym_info.gym_name) {
      this.isLoading = true;
      const loading = await this.loadingController.create({
        message: 'Loading Transactions...',
        spinner: 'crescent',
        duration: 3000 // Safety duration
      });
      await loading.present();
      
      this.ownerService.getOwnerDashboard().subscribe({
        next: (data) => {
          this.dashboardData = data;
          loading.dismiss();
          this.isLoading = false;
        },
        error: async (err) => {
          loading.dismiss();
          this.isLoading = false;
          const errorMessage = this.notificationService.getFriendlyError(err);
          await this.notificationService.showAlert('Error', errorMessage);
        }
      });
    } else {
      // Silent update
      this.ownerService.getOwnerDashboard().subscribe({
        next: (data) => {
          this.dashboardData = data;
        },
        error: (err) => {
          console.error('Silent update failed', err);
        }
      });
    }
  }

  fetchTransactions() {
    this.isLoading = true;
    this.error = null;
    this.ownerService.getTransactions().subscribe({
      next: (data) => {
        this.transactions = data?.transactions || []; // <-- FIX: extract array
        this.calculateSummary();
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load transactions.';
        this.transactions = [];
        this.filteredTransactions = [];
        this.isLoading = false;
      }
    });
  }

  calculateSummary() {
    const today = new Date().toISOString().split('T')[0];
    const monthStart = new Date();
    monthStart.setDate(1);
    this.totalAmount = this.transactions.reduce((sum, t) => sum + t.amount, 0);
    this.todayAmount = this.transactions
      .filter(t => t.transaction_date.includes(today))
      .reduce((sum, t) => sum + t.amount, 0);
    this.monthAmount = this.transactions
      .filter(t => new Date(t.transaction_date) >= monthStart)
      .reduce((sum, t) => sum + t.amount, 0);
  }

  applyFilters() {
    let result = [...this.transactions];
    // Type filter
    if (this.filters.type !== 'all') {
      result = result.filter(t => t.transaction_type === this.filters.type);
    }
    // Period filter
    const now = new Date();
    switch (this.filters.period) {
      case 'today':
        const today = now.toISOString().split('T')[0];
        result = result.filter(t => t.transaction_date.includes(today));
        break;
      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        result = result.filter(t => new Date(t.transaction_date) >= monthStart);
        break;
    }
    // Search filter
    if (this.filters.search) {
      const searchTerm = this.filters.search.toLowerCase();
      result = result.filter(t =>
        (t.description && t.description.toLowerCase().includes(searchTerm)) ||
        (t.member_name && t.member_name.toLowerCase().includes(searchTerm))
      );
    }
    this.filteredTransactions = result;
  }
}