import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../core/services/admin.service';
import { NotificationService } from '../../core/services/notification.service';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
  standalone: false
})
export class AdminDashboardPage implements OnInit {
  pendingOwners: any[] = [];
  isLoading = false;

  constructor(
    private adminService: AdminService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadPendingOwners();
  }

  loadPendingOwners() {
    this.isLoading = true;
    this.adminService.getPendingOwners().subscribe({
      next: (data) => {
        this.pendingOwners = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.notificationService.showToast('Failed to load pending requests', 'error');
      }
    });
  }

  approve(userId: number) {
    this.notificationService.showAlert(
      'Confirm Approval',
      'Are you sure you want to approve this owner?',
      [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Approve',
          handler: () => {
            this.adminService.approveOwner(userId).subscribe({
              next: () => {
                this.notificationService.showToast('Owner approved', 'success');
                this.loadPendingOwners();
              },
              error: (err) => this.notificationService.showToast('Failed to approve', 'error')
            });
          }
        }
      ]
    );
  }

  reject(userId: number) {
    this.notificationService.showAlert(
      'Confirm Rejection',
      'Are you sure you want to REJECT this owner?',
      [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Reject',
          role: 'destructive',
          handler: () => {
            this.adminService.rejectOwner(userId).subscribe({
              next: () => {
                this.notificationService.showToast('Owner rejected', 'success');
                this.loadPendingOwners();
              },
              error: (err) => this.notificationService.showToast('Failed to reject', 'error')
            });
          }
        }
      ]
    );
  }

  logout() {
    this.authService.logout();
  }
}
