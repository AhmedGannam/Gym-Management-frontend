import { Component, OnInit } from '@angular/core';
import { OwnerService } from '../../core/services/owner.service';
import { OwnerDashboardData } from '../../core/models/gym.model';
import { AuthService } from '../../core/services/auth.service'; // For logout
import { Router } from '@angular/router';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';
import { SharedService } from 'src/app/core/services/shared.service';
import { ChartConfiguration, ChartOptions, ChartTypeRegistry } from 'chart.js';
// import { WebSocketService } from 'src/app/core/services/websocket.service';
import { ViewWillEnter } from '@ionic/angular';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { LoaderService } from '../../core/services/loader.service';
@Component({
  selector: 'app-owner-dashboard',
  templateUrl: './owner-dashboard.page.html',
  styleUrls: ['./owner-dashboard.page.scss'],
  standalone: false,
})
export class OwnerDashboardPage implements OnInit, ViewWillEnter {

  // Use a string literal type directly for the chart type
  public monthlyRevenueChartType: 'line' = 'line'; // 

  // And ensure data and options also use this specific 'line' type
  public monthlyRevenueChartData: ChartConfiguration<'line'>['data'];
  public monthlyRevenueChartOptions: ChartOptions<'line'>;
  // Initialize dashboardData with a default structure
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
      total_staffs: 0, // Initialize total_staffs
      revenue_this_month: '0.00' // Default for new property
    }
  };
  isLoading = true;
  transactionSummary: any = null;
  recentTransactions: any[] = [];

  constructor(
    private ownerService: OwnerService,
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private sharedService: SharedService,
    private toastController: ToastController,
    private actionSheetCtrl: ActionSheetController,
    private loader: LoaderService,
    // private webSocketService: WebSocketService
  ) {
        this.monthlyRevenueChartData = {
      labels: [],
      datasets: [{ data: [], label: 'Monthly Revenue' }]
    };

    this.monthlyRevenueChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#999',
            font: {
              family: "'Roboto', sans-serif"
            }
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#999',
            font: {
              family: "'Roboto', sans-serif"
            }
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          titleColor: '#fff',
          bodyColor: '#fff',
          padding: 12,
          cornerRadius: 4,
          displayColors: false,
          callbacks: {
            label: (context) => {
              return `₹${context.parsed.y.toLocaleString('en-IN')}`;
            }
          }
        }
      },
      elements: {
        line: {
          tension: 0.4,
          borderWidth: 3
        },
        point: {
          radius: 5,
          hoverRadius: 8
        }
      }
    };
  }

  ngOnInit() {
    this.loadDashboardData();
    this.loadTransactionSummary();
    this.sharedService.refresh$.subscribe(async (type) => {
      if (type === 'dashboard' || type === 'transactions') {
        this.loadDashboardData();
        this.loadTransactionSummary();
        await this.presentToast('Dashboard updated.', 'success');
      }
    });

      // this.setupWebSocketNotifications(); // <--- Call this
  }

  ionViewWillEnter() {
    // Only show full loader if we have no data at all
    if (!this.dashboardData || this.dashboardData.total_revenue === 0) {
      this.isLoading = true;
    }
    
    // Always refresh data, but if we already have data, isLoading=false allows the UI to stay visible
    this.loadDashboardData(false); 
    this.loadTransactionSummary();
  }

  async loadDashboardData(showLoading = true) {
    if (showLoading) {
      this.isLoading = true;
    }
    // this.loader.show('Loading dashboard...');
    this.ownerService.getOwnerDashboard().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.loader.hide();
        this.isLoading = false;
        const lastSixMonths = this.dashboardData.monthly_revenue.slice(-6);

    this.monthlyRevenueChartData = {
      labels: lastSixMonths.map(m => m.month),
      datasets: [
        {
          data: lastSixMonths.map(m => m.revenue),
          label: 'Monthly Revenue',
          borderColor: '#4DBD74',
          backgroundColor: 'rgba(77, 189, 116, 0.1)',
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#4DBD74',
          pointHoverBackgroundColor: '#4DBD74',
          fill: true
        }
      ]
    };

    this.monthlyRevenueChartOptions = {
      ...this.monthlyRevenueChartOptions,
      plugins: {
        ...this.monthlyRevenueChartOptions.plugins,
        title: {
          display: true,
          text: 'Last 6 Months Revenue',
          color: '#fff',
          font: {
            size: 16,
            family: "'Roboto', sans-serif"
          }
        }
      }
    };
      },
      error: async (err) => {
        this.loader.hide();
        this.isLoading = false;
        console.error('Error loading owner dashboard:', err);
        const errorMessage = err.error?.error || 'Failed to load dashboard data.';
        await this.presentAlert('Error', errorMessage);
        // Optional: if critical error, maybe logout or redirect
        if (err.status === 401 || err.status === 403) {
            this.authService.logout(); // Token expired or unauthorized
        }
      }
    });
  }

  
  getCollectionPercentage(): number {
    if (!this.transactionSummary || this.transactionSummary.total_collected + this.transactionSummary.total_due === 0) {
      return 0;
    }
    
    const total = this.transactionSummary.total_collected + this.transactionSummary.total_due;
    return Math.round((this.transactionSummary.total_collected / total) * 100);
  }

  loadTransactionSummary() {
    // this.loader.show('Loading transactions...');
    this.ownerService.getTransactionSummary().subscribe({
      next: (data) => {
        this.transactionSummary = data.summary;
        this.recentTransactions = data.recent;
        this.loader.hide();
      },
      error: () => {
        this.loader.hide();
      }
    });
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Logout',
      message: 'Are you sure you want to log out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Logout',
          handler: () => {
            this.authService.logout();
          }
        }
      ]
    });
    await alert.present();
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  // You will later implement methods for adding members, viewing members etc.
  // For now, this just fetches the dashboard data.
  navigateToAddMember() {
    this.router.navigate(['/add-member']);
    // Or you can create a dedicated 'add-member' page and navigate there:
    // this.router.navigate(['/owner-tabs/add-member']);
  }

  navigateToAddMembershipPlan() {
    this.router.navigate(['/add-membership-plan']);
  }

  navigateToAddStaff() {
    this.router.navigate(['/add-staff']);
  }

  navigateToTransactions() {
  this.router.navigate(['/owner-tabs/transactions']);
}

  navigateToExpiredMembers() {
    this.router.navigate(['/owner-tabs/members'], { queryParams: { filter: 'expired' } });
  }
  
  navigateToStaffList() {
    this.router.navigate(['/owner-tabs/staff-list']);
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'bottom',
    });
    toast.present();
  }

    async openQuickActions() {
    if (this.authService.getRole() !== 'owner') return;
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Quick Actions',
      cssClass: 'custom-action-sheet',
      buttons: [
        {
          text: 'Add Member',
          icon: 'person-add-outline',
          cssClass: 'action-sheet-add-member',
          handler: () => this.router.navigate(['owner-tabs/add-member'])
        },
        {
          text: 'Add Membership Plan',
          icon: 'add-circle-outline',
          handler: () => this.router.navigate(['owner-tabs/add-membership-plan'])
        },
        {
          text: 'Add Staff',
          icon: 'people-outline',
          cssClass: 'action-sheet-add-staff',
          handler: () => this.router.navigate(['owner-tabs/add-staff'])
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          cssClass: 'cancel-button'
        }
      ]
    });
    await actionSheet.present();
  }
}