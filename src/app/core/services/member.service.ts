import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Member, MembershipHistory, TransactionHistory } from '../models/member.model';
import { APP_CONSTANTS } from '../constants/app-constants';
import { MemberDashboardData } from '../models/member.model';
import { ApiSuccessResponse } from '../models/auth.model';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // Member CRUD operations

    getMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(this.baseUrl);
  }

    addMember(member: any) {
    return this.http.post(this.baseUrl, member);
  }

    getMemberDashboard(): Observable<MemberDashboardData> {
    return this.http.get<MemberDashboardData>(`${this.baseUrl}/member/dashboard`);
  }

  updateProfile(payload: { first_name?: string; last_name?: string; phone?: string }): Observable<ApiSuccessResponse> {
    return this.http.put<ApiSuccessResponse>(`${this.baseUrl}/member/profile`, payload);
  }

  // getAllMembers(): Observable<Member[]> {
  //   return this.http.get<Member[]>(this.apiUrl);
  // }

  // getMemberById(id: number): Observable<Member> {
  //   return this.http.get<Member>(`${this.apiUrl}/${id}`);
  // }

  // createMember(member: Member): Observable<Member> {
  //   return this.http.post<Member>(this.apiUrl, member);
  // }

  // updateMember(id: number, member: Partial<Member>): Observable<Member> {
  //   return this.http.put<Member>(`${this.apiUrl}/${id}`, member);
  // }

  // deleteMember(id: number): Observable<void> {
  //   return this.http.delete<void>(`${this.apiUrl}/${id}`);
  // }

  // // Membership operations
  // getCurrentMembership(memberId: number): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/${memberId}/current-membership`);
  // }

  // getMembershipHistory(memberId: number): Observable<MembershipHistory[]> {
  //   return this.http.get<MembershipHistory[]>(`${this.apiUrl}/${memberId}/membership-history`);
  // }

  // renewMembership(memberId: number, planId: number): Observable<any> {
  //   return this.http.post<any>(`${this.apiUrl}/${memberId}/renew`, { planId });
  // }

  // // Transaction operations
  // getTransactionHistory(memberId: number): Observable<TransactionHistory[]> {
  //   return this.http.get<TransactionHistory[]>(`${this.apiUrl}/${memberId}/transactions`);
  // }

  // addPayment(memberId: number, payment: any): Observable<any> {
  //   return this.http.post<any>(`${this.apiUrl}/${memberId}/payments`, payment);
  // }

  // // Member status operations
  // suspendMember(memberId: number): Observable<void> {
  //   return this.http.patch<void>(`${this.apiUrl}/${memberId}/suspend`, {});
  // }

  // activateMember(memberId: number): Observable<void> {
  //   return this.http.patch<void>(`${this.apiUrl}/${memberId}/activate`, {});
  // }
}