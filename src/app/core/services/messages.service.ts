import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Notification {
  notification_id: number;
  gym_id: number;
  member_id?: number;
  membership_id?: number;
  message: string;
  status: 'sent' | 'read';
  created_at: string;
  updated_at: string;
  Member?: {
    first_name: string;
    last_name: string;
    member_id: number;
  };
  Membership?: {
    membership_id: number;
    end_date: string;
  };
}

export interface NotificationResponse {
  success: boolean;
  notifications: Notification[];
  pagination?: {
    current_page: number;
    total_pages: number;
    total_count: number;
    limit: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = environment.apiBaseUrl;
  
  // BehaviorSubject to track unread notifications count
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  // BehaviorSubject to track latest notifications
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  constructor(private http: HttpClient) { }

  /**
   * Get notifications for the current gym
   */
  getNotifications(page = 1, limit = 20): Observable<NotificationResponse> {
    return this.http.get<NotificationResponse>(`${this.apiUrl}/notifications?page=${page}&limit=${limit}`);
  }

  /**
   * Get unread notification count
   */
  getUnreadCount(): Observable<{ success: boolean; unread_count: number }> {
    return this.http.get<{ success: boolean; unread_count: number }>(`${this.apiUrl}/notifications/unread-count`);
  }

  /**
   * Mark a specific notification as read
   */
  markAsRead(notificationId: number): Observable<{ success: boolean; message: string }> {
    return this.http.put<{ success: boolean; message: string }>(`${this.apiUrl}/notifications/${notificationId}/read`, {});
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): Observable<{ success: boolean; message: string }> {
    return this.http.put<{ success: boolean; message: string }>(`${this.apiUrl}/notifications/mark-all-read`, {});
  }

  /**
   * Delete a notification
   */
  deleteNotification(notificationId: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/notifications/${notificationId}`);
  }

  /**
   * Test notification system
   */
  testNotification(): Observable<{ success: boolean; message: string; notification: Notification }> {
    return this.http.post<{ success: boolean; message: string; notification: Notification }>(`${this.apiUrl}/notifications/test`, {});
  }

  /**
   * Load notifications and update the BehaviorSubject
   */
  loadNotifications(page = 1, limit = 20): void {
    this.getNotifications(page, limit).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationsSubject.next(response.notifications);
        }
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
      }
    });
  }

  /**
   * Update unread count
   */
  updateUnreadCount(): void {
    this.getUnreadCount().subscribe({
      next: (response) => {
        if (response.success) {
          this.unreadCountSubject.next(response.unread_count);
        }
      },
      error: (error) => {
        console.error('Error getting unread count:', error);
      }
    });
  }

  /**
   * Mark notification as read and update counts
   */
  markNotificationAsRead(notificationId: number): void {
    this.markAsRead(notificationId).subscribe({
      next: (response) => {
        if (response.success) {
          // Update the notification status in the current list
          const currentNotifications = this.notificationsSubject.value;
          const updatedNotifications = currentNotifications.map(notification => 
            notification.notification_id === notificationId 
              ? { ...notification, status: 'read' as const }
              : notification
          );
          this.notificationsSubject.next(updatedNotifications);
          
          // Update unread count
          this.updateUnreadCount();
        }
      },
      error: (error) => {
        console.error('Error marking notification as read:', error);
      }
    });
  }

  /**
   * Mark all notifications as read
   */
  markAllNotificationsAsRead(): void {
    this.markAllAsRead().subscribe({
      next: (response) => {
        if (response.success) {
          // Update all notifications status in the current list
          const currentNotifications = this.notificationsSubject.value;
          const updatedNotifications = currentNotifications.map(notification => 
            ({ ...notification, status: 'read' as const })
          );
          this.notificationsSubject.next(updatedNotifications);
          
          // Update unread count
          this.updateUnreadCount();
        }
      },
      error: (error) => {
        console.error('Error marking all notifications as read:', error);
      }
    });
  }

  /**
   * Delete notification and update list
   */
  deleteNotificationAndUpdate(notificationId: number): void {
    this.deleteNotification(notificationId).subscribe({
      next: (response) => {
        if (response.success) {
          // Remove the notification from the current list
          const currentNotifications = this.notificationsSubject.value;
          const updatedNotifications = currentNotifications.filter(notification => 
            notification.notification_id !== notificationId
          );
          this.notificationsSubject.next(updatedNotifications);
          
          // Update unread count
          this.updateUnreadCount();
        }
      },
      error: (error) => {
        console.error('Error deleting notification:', error);
      }
    });
  }

  /**
   * Format notification date
   */
  formatNotificationDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  /**
   * Initialize notification service
   */
  initialize(): void {
    this.loadNotifications();
    this.updateUnreadCount();
  }

  /**
   * Refresh notifications
   */
  refresh(): void {
    this.loadNotifications();
    this.updateUnreadCount();
  }
}