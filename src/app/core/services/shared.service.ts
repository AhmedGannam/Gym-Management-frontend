import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SharedService {
  private refreshSubject = new Subject<string>();
  refresh$ = this.refreshSubject.asObservable();

  triggerRefresh(type: string) {
    this.refreshSubject.next(type);
  }
} 