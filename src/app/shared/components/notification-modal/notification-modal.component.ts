import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NotificationService } from 'src/app/core/services/messages.service';
import { Notification } from 'src/app/core/services/messages.service';

@Component({
  selector: 'app-notification-modal',
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.scss'],
  standalone: false, 
})
export class NotificationModalComponent implements OnInit {
  notifications: Notification[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  hasMoreNotifications = true;

  constructor(
    private modalCtrl: ModalController,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications(page = 1) {
    this.loading = true;
    this.notificationService.getNotifications(page, 20).subscribe({
      next: (response) => {
        if (response.success) {
          if (page === 1) {
            this.notifications = response.notifications;
          } else {
            this.notifications = [...this.notifications, ...response.notifications];
          }
          
          if (response.pagination) {
            this.currentPage = response.pagination.current_page;
            this.totalPages = response.pagination.total_pages;
            this.hasMoreNotifications = this.currentPage < this.totalPages;
          }
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
        this.loading = false;
      }
    });
  }

  loadMoreNotifications() {
    if (this.hasMoreNotifications && !this.loading) {
      this.loadNotifications(this.currentPage + 1);
    }
  }

  markAsRead(notification: Notification) {
    if (notification.status === 'sent') {
      this.notificationService.markAsRead(notification.notification_id).subscribe({
        next: (response) => {
          if (response.success) {
            notification.status = 'read';
          }
        },
        error: (error) => {
          console.error('Error marking notification as read:', error);
        }
      });
    }
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead().subscribe({
      next: (response) => {
        if (response.success) {
          this.notifications.forEach(notification => {
            notification.status = 'read';
          });
        }
      },
      error: (error) => {
        console.error('Error marking all notifications as read:', error);
      }
    });
  }

  deleteNotification(notification: Notification) {
    this.notificationService.deleteNotification(notification.notification_id).subscribe({
      next: (response) => {
        if (response.success) {
          this.notifications = this.notifications.filter(n => n.notification_id !== notification.notification_id);
        }
      },
      error: (error) => {
        console.error('Error deleting notification:', error);
      }
    });
  }

  formatNotificationDate(dateString: string): string {
    return this.notificationService.formatNotificationDate(dateString);
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  refresh() {
    this.currentPage = 1;
    this.hasMoreNotifications = true;
    this.loadNotifications();
  }
} 