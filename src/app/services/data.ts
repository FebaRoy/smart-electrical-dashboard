import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Data {
  private socket!: WebSocket;

  private dataSubject = new BehaviorSubject<any>(null);

  data$ = this.dataSubject.asObservable();

  constructor(private http: HttpClient) {
    this.connectWebSocket();
  }

  connectWebSocket() {
    this.socket = new WebSocket('ws://127.0.0.1:8000/ws');
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.dataSubject.next(data);
    };
    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    this.socket.onclose = () => {
      console.log('WebSocket Disconnected');
    };
  }

  getHistory() {
    return this.http.get<any[]>('http://127.0.0.1:8000/history');
  }
}
