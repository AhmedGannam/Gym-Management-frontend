// src/app/core/services/owner.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs'; // Import Observable
import { environment } from 'src/environments/environment';

import { MembershipPlan } from '../models/membership-plan.model';
import { Member, AddMemberPayload } from '../models/member.model'; // Assuming Member and AddMemberPayload are in member.model.ts
import { ApiSuccessResponse } from '../models/common.model'; // Import ApiSuccessResponse
import { OwnerDashboardData } from '../models/gym.model'; // For dashboard data
import { Membership } from '../models/membership.model'; // For memberships
import { Transaction } from '../models/transaction.model'; // For transactions
import { PersonalTraining } from '../models/personal-training.model';
import { Staff} from '../models/staff.model'; 
@Injectable({
  providedIn: 'root'
})
export class OwnerService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  getOwnerDashboard(): Observable<OwnerDashboardData> {
    return this.http.get<OwnerDashboardData>(`${this.apiUrl}/owner/dashboard`);
  }

  getMembershipPlans(page?: number, limit?: number): Observable<any> {
    let params = new HttpParams();
    if (page) {
      params = params.set('page', page.toString());
    }
    if (limit) {
      params = params.set('limit', limit.toString());
    }
    return this.http.get<any>(`${this.apiUrl}/owner/membership-plans`, { params });
  }
     createMembershipPlan(planData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/owner/membership-plans`, planData);
  }

  updateMembershipPlan(plan_id: number, data: any) {
  return this.http.put(`${this.apiUrl}/owner/membership-plans/${plan_id}`, data);
}

  addMember(memberData: AddMemberPayload): Observable<ApiSuccessResponse> {
    return this.http.post<ApiSuccessResponse>(`${this.apiUrl}/owner/members`, memberData);
  }
  addStaff(data: any) {
  return this.http.post(`${this.apiUrl}/owner/staff`, data);
}

  getMembers(searchQuery?: string, filterExpired?: boolean, page?: number, limit?: number): Observable<any> {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.set('search', searchQuery);
    }
    if (filterExpired) {
      params = params.set('filter', 'expired');
    }
    if (page) {
      params = params.set('page', page.toString());
    }
    if (limit) {
      params = params.set('limit', limit.toString());
    }
    return this.http.get<any>(`${this.apiUrl}/owner/members`, { params });
  }

  getAllMembersForOwner(): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.apiUrl}/owner/members`);
  }

  updateMemberStatus(memberId: number, newStatus: string): Observable<ApiSuccessResponse> {
    return this.http.put<ApiSuccessResponse>(`${this.apiUrl}/owner/members/${memberId}/status`, { new_status: newStatus });
  }

  getMemberDetails(memberId: number): Observable<{ member: Member, memberships: Membership[], transactions: Transaction[], personal_trainings: PersonalTraining[] }> {
    return this.http.get<{ member: Member, memberships: Membership[], transactions: Transaction[], personal_trainings: PersonalTraining[] }>(`${this.apiUrl}/owner/members/${memberId}/details`);
  }

  addMembershipToMember(memberId: number, membershipData: any): Observable<ApiSuccessResponse> {
    return this.http.post<ApiSuccessResponse>(`${this.apiUrl}/owner/members/${memberId}/add-membership`, membershipData);
  }

  getTransactionSummary(): Observable<{ summary: any, recent: Transaction[] }> {
    return this.http.get<{ summary: any, recent: Transaction[] }>(`${this.apiUrl}/owner/transactions/summary`);
  }

// Add a membership to a member (for owner)
addMembershipToMemberForOwner(memberId: number, membershipData: any): Observable<ApiSuccessResponse> {
  return this.http.post<ApiSuccessResponse>(`${this.apiUrl}/owner/members/${memberId}/add-membership`, membershipData);
}

// Get a single membership plan
getMembershipPlan(planId: number): Observable<MembershipPlan> {
  return this.http.get<MembershipPlan>(`${this.apiUrl}/owner/membership-plans/${planId}`);
}

// Update member info
updateMemberInfo(memberId: number, data: Partial<Member>): Observable<ApiSuccessResponse> {
  return this.http.put<ApiSuccessResponse>(`${this.apiUrl}/owner/members/${memberId}`, data);
}

// Deactivate a member
deactivateMember(memberId: number): Observable<ApiSuccessResponse> {
  return this.http.delete<ApiSuccessResponse>(`${this.apiUrl}/owner/members/${memberId}`);
}

// Deactivate a membership plan
deactivateMembershipPlan(planId: number): Observable<ApiSuccessResponse> {
  return this.http.delete<ApiSuccessResponse>(`${this.apiUrl}/owner/membership-plans/${planId}`);
}

// Update a membership
updateMembership(membershipId: number, data: any): Observable<ApiSuccessResponse> {
  return this.http.put<ApiSuccessResponse>(`${this.apiUrl}/owner/memberships/${membershipId}`, data);
}

// Cancel a membership
cancelMembership(membershipId: number): Observable<ApiSuccessResponse> {
  return this.http.delete<ApiSuccessResponse>(`${this.apiUrl}/owner/memberships/${membershipId}`);
}

// Get transactions (with optional filters)
getTransactions(params?: { member_id?: number; start_date?: string; end_date?: string; page?: number; limit?: number }): Observable<any> {
  let httpParams = new HttpParams();
  if (params) {
    for (const key in params) {
      if (params.hasOwnProperty(key) && (params as any)[key] !== undefined) {
        httpParams = httpParams.set(key, (params as any)[key].toString());
      }
    }
  }
  return this.http.get<any>(`${this.apiUrl}/owner/transactions`, { params: httpParams });
}

addPersonalTrainingToMember(memberId: number, data: any) {
  return this.http.post<ApiSuccessResponse>(`${this.apiUrl}/owner/members/${memberId}/personal-training`, data);
}

getStaffList(page?: number, limit?: number): Observable<any> {
  let params = new HttpParams();
  if (page) {
    params = params.set('page', page.toString());
  }
  if (limit) {
    params = params.set('limit', limit.toString());
  }
  return this.http.get<any>(`${this.apiUrl}/owner/staff`, { params });
}

getGymInfo(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/owner/gym/info`);
}

updateGymInfo(data: any): Observable<ApiSuccessResponse> {
  return this.http.patch<ApiSuccessResponse>(`${this.apiUrl}/owner/gym/info`, data);
}

uploadStaffPhoto(staffId: number, formData: FormData) {
  return this.http.put(`${this.apiUrl}/owner/staff/${staffId}/photo`, formData);
}

// WhatsApp Integration
getWhatsAppIntegration(): Observable<{ success: boolean; integration: { api_key: string; sender_id: string; hasIntegration: boolean } | null }> {
  return this.http.get<{ success: boolean; integration: { api_key: string; sender_id: string; hasIntegration: boolean } | null }>(`${this.apiUrl}/owner/whatsapp-integration`);
}

setWhatsAppIntegration(api_key: string, sender_id: string): Observable<{ success: boolean; message: string }> {
  return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/owner/whatsapp-integration`, { api_key, sender_id });
}

testWhatsAppIntegration(test_number: string): Observable<{ success: boolean; message?: string; error?: string }> {
  return this.http.post<{ success: boolean; message?: string; error?: string }>(`${this.apiUrl}/owner/whatsapp-integration/test`, { test_number });
}

saveFcmToken(fcm_token: string) {
  return this.http.post(`${this.apiUrl}/owner/save-fcm-token`, { fcm_token });
}

}