import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';

interface DashboardData {
  voltage: number | string;
  current: number | string;
  power: number;
  status: string;
  alert: string;
  prediction: string;
  anomaly: string;
  risk: string;
}

@Injectable({
  providedIn: 'root',
})
export class Data {
  previousVoltage: number[] = [];

  voltageHistory: number[] = [];

  private dataSubject = new BehaviorSubject<any>(null);

  data$ = this.dataSubject.asObservable();

  constructor(private http: HttpClient) {
    this.startFetching();
  }

  startFetching() {
    interval(1000).subscribe(() => {
      this.http.get<any>('http://127.0.0.1:8000/data').subscribe((res) => {
        this.dataSubject.next(res);
      });
    });
  }

  generateAlert(voltage: number, current: number): string {
    if (voltage > 235) {
      return 'High Voltage ⚠️';
    }

    if (voltage < 210) {
      return 'Low Voltage ⚠️';
    }

    if (current > 6.5) {
      return 'Overcurrent ⚠️';
    }

    return 'System Normal ✅';
  }

  predictTrend(voltage: number): string {
    this.previousVoltage.push(voltage);

    if (this.previousVoltage.length > 5) {
      this.previousVoltage.shift();
    }

    if (this.previousVoltage.length < 5) {
      return 'Stable';
    }

    const [v1, v2, v3, v4, v5] = this.previousVoltage;

    const isRising = v1 < v2 && v2 < v3 && v3 < v4 && v4 < v5;
    if (isRising) {
      return 'Rising ⚠️';
    }

    if (v1 > v2 && v2 > v3 && v3 > v4 && v4 > v5) {
      const isDrpping = v1 > v2 && v2 > v3 && v3 > v4 && v4 > v5;
      if (isDrpping) {
        return 'Dropping ⚠️';
      }
    }

    if (v5 > 235 && isRising) {
      return 'Critical Risk 🚨';
    }

    return 'Stable';
  }

  detectAnomaly(voltage: number): string {
    this.voltageHistory.push(voltage);

    if (this.voltageHistory.length > 10) {
      this.voltageHistory.shift();
    }

    if (this.voltageHistory.length < 5) {
      return 'Normal';
    }

    const avg = this.voltageHistory.reduce((a, b) => a + b, 0) / this.voltageHistory.length;
    const deviation = Math.abs(voltage - avg);

    if (deviation > 10) {
      return 'Anomaly 🚨';
    }

    return 'Normal';
  }

  getHistory() {
    return this.http.get<any[]>('http://127.0.0.1:8000/history');
  }
}
