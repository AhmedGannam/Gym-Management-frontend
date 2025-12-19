import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // Example: health-check
  public getHealth(): Observable<{ status: string; timestamp: string }> {
    return this.http.get<{ status: string; timestamp: string }>(
      `${this.baseUrl}/health`
    );
  }

  // Future endpoints: e.g., getMembers(), getDashboardMetrics(), etc.
  // public getMembers(): Observable<Member[]> {
  //   return this.http.get<Member[]>(`${this.baseUrl}/members`);
  // }
}
