// src/app/core/services/websocket.service.ts
import { Injectable } from '@angular/core';
// import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
//   private socket: Socket;
  private readonly socketUrl = environment.apiBaseUrl; // Your backend URL

//   constructor() {
//     this.socket = io(this.socketUrl, {
//       transports: ['websocket', 'polling'] // Force websocket or polling
//     });

//     this.socket.on('connect', () => {
//       console.log('Connected to WebSocket server:', this.socket.id);
//     });

//     this.socket.on('disconnect', () => {
//       console.log('Disconnected from WebSocket server.');
//     });

//     this.socket.on('connect_error', (err) => {
//       console.error('WebSocket connection error:', err);
//     });
//   }

  // Register owner's gym ID with the server
//   registerOwnerGym(gymId: string) {
//     this.socket.emit('register_owner_gym', gymId);
//   }

  // Listen for owner notifications
//   onOwnerNotification(): Observable<any> {
//     return new Observable(observer => {
//       this.socket.on('owner_notification', (data: any) => {
//         observer.next(data);
//       });
//     });
//   }

  // Add other methods to emit/listen for events as needed
//   emit(eventName: string, data: any) {
//     this.socket.emit(eventName, data);
//   }

//   on(eventName: string): Observable<any> {
//     return new Observable(observer => {
//       this.socket.on(eventName, (data: any) => {
//         observer.next(data);
//       });
//     });
//   }
}