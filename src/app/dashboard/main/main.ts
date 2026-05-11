import { Component } from '@angular/core';
import { KpiCard } from '../../components/kpi-card/kpi-card';
import { Graph } from '../../components/graph/graph';
import { Alerts } from '../../components/alerts/alerts';
import { DeviceStatus } from '../../components/device-status/device-status';
import { Data } from '../../services/data';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  imports: [KpiCard, Graph, Alerts, DeviceStatus, CommonModule],
  templateUrl: './main.html',
  styleUrls: ['./main.scss'],
})

export class Main {
  data$;

  constructor(private dataService: Data) {
    this.data$ = this.dataService.data$;
  }

  getStatusClass(status: string) {
    if (!status) return '';
    
    if (status.toLowerCase().includes('normal')) return 'status-green';
    if (status.toLowerCase().includes('warning')) return 'status-yellow';
   
     return 'status-red';
}
}
