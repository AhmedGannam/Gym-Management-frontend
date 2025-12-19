// src/app/core/services/public.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Gym } from '../models/gym.model';

@Injectable({
  providedIn: 'root'
})
export class PublicService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  getGymByJoinCode(join_code: string): Observable<Gym> {
    // Corrected endpoint URL based on your backend
    return this.http.get<Gym>(`${this.baseUrl}/gyms/${join_code}`);
  }

  checkMemberEmail(email: string): Observable<{ exists: boolean; gym_id?: number; member_status?: string }> {
    // Corrected endpoint URL based on your backend
    return this.http.get<{ exists: boolean; gym_id?: number; member_status?: string }>(`${this.baseUrl}/public/check-member-email/${email}`);
  }
}