import { Component } from '@angular/core';
import { Data } from '../../services/data';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alerts',
  imports: [CommonModule],
  templateUrl: './alerts.html',
  styleUrl: './alerts.scss',
})
export class Alerts {
  alertMessage: string = '';
  prediction: string = '';
  anomaly: string = '';
  alerts: string[] = [];
  risk: string = '';

  trackByIndex(index: number) {
    return index;
  }

  constructor(private dataService: Data) {}

  ngOnInit() {
    this.dataService.data$.subscribe((data) => {
      if (!data) return;
      this.alertMessage = data.alert;
      this.prediction = data.prediction;
      this.anomaly = data.anomaly;
      this.risk = data.risk;
      if (data.alert && data.alert.trim() !== '' && this.alerts[0] !== data.alert) {
        this.alerts.unshift(data.alert);
      }
      if (this.alerts.length > 5) {
        this.alerts.pop();
      }
    });
  }

  getClass() {
    if (this.alertMessage.includes('High') || this.alertMessage.includes('Over')) {
      return 'danger';
    }

    if (this.alertMessage.includes('Low')) {
      return 'warning';
    }
    return 'normal';
  }

  riskClass() {
    if (this.risk === 'High') {
      return 'danger';
    }

    if (this.risk === 'Medium') {
      return 'warning';
    }

    return 'normal';
  }
}
