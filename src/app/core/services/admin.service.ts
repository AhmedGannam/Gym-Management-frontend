import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  getPendingOwners(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/admin/pending-owners`);
  }

  approveOwner(userId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/approve/${userId}`, {});
  }

  rejectOwner(userId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/reject/${userId}`, {});
  }
}
