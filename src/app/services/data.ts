import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';

interface Device {
  name: string;
  status: string;
  health: string;
}

export interface DashboardData {
  voltage: number;
  current: number;
  power: number;

  status: string;
  alert: string;

  prediction: string;
  anomaly: string;
  risk: string;

  devices: Device[];
}

export interface HistoryReading {
  id: number;
  voltage: number;
  current: number;
  power: number;
  status: string;
  alert: string;
  prediction: string;
  anomaly: string;
}

@Injectable({
  providedIn: 'root',
})
export class Data {
  private socket!: WebSocket;

  private dataSubject = new BehaviorSubject<DashboardData | null>(null);

  data$ = this.dataSubject.asObservable();

  constructor(private http: HttpClient) {
    this.startWebSocket();
  }

  startWebSocket() {
    this.socket = new WebSocket('ws://127.0.0.1:8000/ws');

    this.socket.onopen = () => {
      console.log('WebSocket connected');
    };

    this.socket.onmessage = (event) => {
      const data: DashboardData = JSON.parse(event.data);

      console.log('Live data:', data);

      this.dataSubject.next(data);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected');

      setTimeout(() => {
        this.startWebSocket();
      }, 3000);
    };
  }

  getHistory() {
    return this.http.get<HistoryReading[]>('http://127.0.0.1:8000/history');
  }

  closeWebSocket() {
    if (this.socket) {
      this.socket.close();
    }
  }

  downloadReport() {
    return this.http.get('http://127.0.0.1:8000/export', { responseType: 'blob' });
  }
}
