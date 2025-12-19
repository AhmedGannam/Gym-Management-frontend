import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Location } from '@angular/common';
import { NotificationService } from 'src/app/core/services/messages.service';
import { NotificationModalComponent } from '../notification-modal/notification-modal.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: false
})
export class ToolbarComponent implements OnInit {
  @Input() role: 'owner' | 'member' = 'member';
  @Input() title: string = '';
  @Input() showBackButton: boolean = false;

  unreadCount = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private actionSheetCtrl: ActionSheetController,
    private location: Location,
    private notificationService: NotificationService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    if (this.role === 'owner') {
      this.loadUnreadCount();
      // Subscribe to unread count updates
      this.notificationService.unreadCount$.subscribe(count => {
        this.unreadCount = count;
      });
    }
  }

  loadUnreadCount() {
    this.notificationService.getUnreadCount().subscribe({
      next: (response) => {
        if (response.success) {
          this.unreadCount = response.unread_count;
        }
      },
      error: (error) => {
        console.error('Error loading unread count:', error);
      }
    });
  }

  goBack() {
    this.location.back();
  }

  async openNotifications() {
    if (this.role !== 'owner') return;

    const modal = await this.modalCtrl.create({
      component: NotificationModalComponent,
      componentProps: {},
      breakpoints: [0, 0.5, 0.8, 1],
      initialBreakpoint: 0.8,
      backdropDismiss: true
    });

    await modal.present();

    // Refresh unread count when modal is dismissed
    modal.onDidDismiss().then(() => {
      this.loadUnreadCount();
    });
  }

  async openQuickActions() {
    if (this.role !== 'owner') return;
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Quick Actions',
      buttons: [
        {
          text: 'Add Member',
          icon: 'person-add-outline',
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
          handler: () => this.router.navigate(['owner-tabs/add-staff'])
        },
        {
          text: 'Transactions',
          icon: 'card-outline',
          handler: () => this.router.navigate(['owner-tabs/transactions'])
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async openProfileMenu() {

    let settingsPath: string;

    if (this.role === 'owner') {
      settingsPath = 'owner-tabs/settings';
    } else {
      settingsPath = 'member-tabs/member-settings';
    }

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Profile',
      buttons: [
        {
          text: 'Settings',
          icon: 'settings-outline',
          handler: () => this.router.navigate([settingsPath])
        },
        {
          text: 'Logout',
          icon: 'log-out-outline',
          handler: () => this.authService.logout(),
          role: 'destructive'
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }
}
