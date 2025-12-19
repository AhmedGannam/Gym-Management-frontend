import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface LoaderState {
  visible: boolean;
  message?: string;
  progress?: number | null;
}

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private loaderState = new BehaviorSubject<LoaderState>({ visible: false });
  loaderState$ = this.loaderState.asObservable();
  private showTimeout: any;

  show(message?: string, progress?: number | null) {
    clearTimeout(this.showTimeout);
    this.showTimeout = setTimeout(() => {
      this.loaderState.next({ visible: true, message, progress });
    }, 200); // 200ms delay
  }

  hide() {
    clearTimeout(this.showTimeout);
    this.loaderState.next({ visible: false });
  }

  setProgress(progress: number) {
    const current = this.loaderState.value;
    if (current.visible) {
      this.loaderState.next({ ...current, progress });
    }
  }

  setMessage(message: string) {
    const current = this.loaderState.value;
    if (current.visible) {
      this.loaderState.next({ ...current, message });
    }
  }
} 