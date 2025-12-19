import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoaderService, LoaderState } from './core/services/loader.service';
import { Subscription } from 'rxjs';
import { Platform } from '@ionic/angular';
import { PushNotifications } from '@capacitor/push-notifications';
import { OwnerService } from './core/services/owner.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit, OnDestroy {
  loaderState: LoaderState = { visible: false };
  private loaderSub?: Subscription;

  constructor(private loader: LoaderService, private platform: Platform, private ownerService: OwnerService) {}

  ngOnInit() {
    const prefersDark = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark', prefersDark);
    this.loaderSub = this.loader.loaderState$.subscribe(state => {
      this.loaderState = state;
    });
    this.platform.ready().then(() => {
      this.registerPushNotifications();
    });
  }

  registerPushNotifications() {
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        PushNotifications.register();
      }
    });
    PushNotifications.addListener('registration', (token) => {
      // Send token to backend
      this.ownerService.saveFcmToken(token.value).subscribe({
        next: () => console.log('FCM token sent to backend'),
        error: (err) => console.error('Failed to send FCM token', err)
      });
    });
    PushNotifications.addListener('registrationError', (error) => {
      console.error('Push registration error:', error);
    });
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      // You can show a toast or notification here
      console.log('Push notification received:', notification);
      // Optionally, show a toast or update UI
    });
  }

  ngOnDestroy() {
    this.loaderSub?.unsubscribe();
  }
}
