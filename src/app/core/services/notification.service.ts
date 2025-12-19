import { Injectable } from '@angular/core';
import { ToastController, AlertController, AlertButton } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private toastQueue: any[] = [];
  private isToastActive = false;

  constructor(private toastCtrl: ToastController, private alertCtrl: AlertController) { }

  async showToast(message: string, type: 'success' | 'error' | 'info' = 'info', duration = 3000) {
    this.toastQueue.push({ message, type, duration });
    if (!this.isToastActive) {
      this.presentNextToast();
    }
  }

  private async presentNextToast() {
    if (this.toastQueue.length === 0) {
      this.isToastActive = false;
      return;
    }
    this.isToastActive = true;
    const { message, type, duration } = this.toastQueue.shift();
    const toast = await this.toastCtrl.create({
      message,
      duration,
      color: type === 'success' ? 'success' : type === 'error' ? 'danger' : 'primary',
      position: 'bottom',
      cssClass: 'custom-toast',
      buttons: [{ text: 'Close', role: 'cancel' }]
    });
    toast.onDidDismiss().then(() => this.presentNextToast());
    toast.present();
  }

  async showAlert(header: string, message: string, buttons: (AlertButton | string)[] = ['OK']) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons
    });
    await alert.present();
  }

  getFriendlyError(error: any): string {
    if (!error) return 'An unknown error occurred.';
    if (typeof error === 'string') return error;
    if (error.error?.error) {
      // Map known backend error messages to user-friendly ones
      switch (error.error.error) {
        case 'Invalid email address.':
        case 'Invalid email address':
          return 'Please enter a valid email address (e.g., user@example.com).';
        case 'Email already registered':
          return 'This email is already registered. Please use a different email or log in.';
        case 'This email is already registered as a user.':
          return 'This email is already registered. Please use a different email or log in.';
        case 'You are already a member of this gym with this app account.':
          return 'You are already a member of this gym with this account.';
        case 'This email is already registered in the system. Please log in with your existing account.':
          return 'This email is already registered. Please log in with your existing account.';
        case 'Invalid gym code':
          return 'The gym join code you entered is invalid. Please check and try again.';
        case 'Plan name, duration, price, and type are required.':
          return 'Please fill in all required fields for the membership plan.';
        case 'Price must be a valid non-negative number.':
          return 'Please enter a valid, non-negative price.';
        case 'Duration must be a positive integer in months.':
          return 'Please enter a valid duration (in months).';
        case 'Member not found':
        case 'Membership plan not found or does not belong to your gym.':
          return 'The selected member or plan could not be found. Please try again.';
        case 'Invalid credentials':
          return 'Incorrect email or password. Please try again.';
        case 'User not found':
          return 'No account found with this email. Please register first.';
        case 'Member login is no longer supported.':
          return 'Gym member login is disabled. This app is for Gym Owners only.';
        case 'Password must be at least 6 characters long.':
          return 'Password is too short. It must be at least 6 characters.';
        case 'First name is required.':
          return 'Please enter your first name.';
        case 'Gym name is required.':
          return 'Please enter the name of your gym.';
        case 'API key and sender ID are required.':
          return 'Both API Key and Sender ID are required to save settings.';
        // Add more mappings as needed
        default:
          return error.error.error || 'An unexpected error occurred.';
      }
    }
    // Handle network errors or other structures
    if (error.status === 0) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    if (error.status === 500) {
      return 'Something went wrong on our end. Please try again later.';
    }

    return 'An error occurred. Please try again.';
  }
}
