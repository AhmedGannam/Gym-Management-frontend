// src/app/core/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken, LoginResponse, RegisterOwnerResponse, RegisterMemberResponse, UserProfile } from '../models/auth.model';
import { Capacitor } from '@capacitor/core';
import { PushNotifications, Token } from '@capacitor/push-notifications';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiBaseUrl;
  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null); // Use UserProfile interface

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadToken();
  }

  private loadToken() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        // Map decoded token to UserProfile
        const userProfile: UserProfile = {
          user_id: decoded.user_id,
          role: decoded.role,
          gym_id: decoded.gym_id || 0,
          email: '', // You might need to fetch this from backend or store in token
          first_name: '', // You might need to fetch this from backend or store in token
          last_name: '', // You might need to fetch this from backend or store in token
        };
        this.currentUserSubject.next(userProfile);

        // Optional: Check token expiration
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          this.logout();
        }
      } catch (e) {
        console.error('Error decoding token:', e);
        this.logout();
      }
    }
  }

  // Expose as Observable
  currentUser(): Observable<UserProfile | null> {
    return this.currentUserSubject.asObservable();
  }

  // Get current value (synchronously)
  getCurrentUserValue(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  getGymId(): number | null {
    return this.currentUserSubject.value?.gym_id || null;
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, { email, password }).pipe(
      tap(res => {
        // Save Token (localStorage only, as requested)
        localStorage.setItem('token', res.token);

        // Update State
        const decoded: DecodedToken = jwtDecode(res.token);
        const userProfile: UserProfile = {
          user_id: decoded.user_id,
          role: decoded.role,
          gym_id: decoded.gym_id || 0,
          email: email,
          first_name: '',
          last_name: '',
        };
        this.currentUserSubject.next(userProfile);

        // Trigger Push Registration (Background) - Safe guard check inside
        this.registerForPush();
      })
    );
  }

  async registerForPush() {
    // Safety check for Web/Hybrid to avoid errors
    const isPushSupported = Capacitor.isNativePlatform();
    if (!isPushSupported) return;

    try {
      let permStatus = await PushNotifications.checkPermissions();
      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }
      if (permStatus.receive !== 'granted') return;

      await PushNotifications.register();

      // Remove any existing listeners to prevent duplicates
      await PushNotifications.removeAllListeners();

      await PushNotifications.addListener('registration', (token: Token) => {
        console.log('FCM Token:', token.value);
        this.updateFcmToken(token.value);
      });

      await PushNotifications.addListener('registrationError', (error: any) => {
        console.error('FCM Registration Error:', error);
      });
    } catch (e) {
      console.error('Push registration exception', e);
    }
  }

  updateFcmToken(token: string) {
    this.http.put(`${this.baseUrl}/auth/fcm-token`, { fcm_token: token }).subscribe({
      error: (e) => console.error('Failed to update FCM token on backend', e)
    });
  }

  registerOwner(data: any): Observable<RegisterOwnerResponse> {
    return this.http.post<RegisterOwnerResponse>(`${this.baseUrl}/auth/register-owner`, data);
  }

  adminLogin(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/admin-login`, data).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        // We could update currentUserSubject here with a dummy admin profile
        const userProfile: UserProfile = {
          user_id: 0, // Use 0 for admin
          role: 'admin',
          gym_id: 0,
          email: 'admin@gym.com',
          first_name: 'Admin',
          last_name: ''
        };
        this.currentUserSubject.next(userProfile);
      })
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/forgot-password`, { email });
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/reset-password/${token}`, { password });
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): 'owner' | 'member' | 'staff' | 'admin' | null {
    const currentUser = this.currentUserSubject.value;
    return currentUser ? currentUser.role : null;
  }

  getProfile() {
    return this.http.get<any>(`${this.baseUrl}/owner/profile`);
  }

  uploadProfilePhoto(formData: FormData) {
    return this.http.put<any>(`${this.baseUrl}/owner/profile/photo`, formData);
  }

  changePassword(currentPassword: string, newPassword: string) {
    return this.http.post<{ success: boolean; message: string; error?: string }>(
      `${this.baseUrl}/auth/change-password`,
      { currentPassword, newPassword }
    );
  }
}