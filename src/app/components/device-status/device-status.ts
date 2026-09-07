import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Data } from '../../services/data';

@Component({
  selector: 'app-device-status',
  imports: [CommonModule],
  templateUrl: './device-status.html',
  styleUrl: './device-status.scss',
})
export class DeviceStatus {
  devices: any[] = [];

  constructor(private dataService: Data) {}

  ngOnInit() {
    this.dataService.data$.subscribe((data) => {
      if (data?.devices) {
        this.devices = data.devices;
      }
    });
  }

  getCardClass(health: string) {
    if (health === 'good') {
      return 'online';
    }
    if (health === 'warning') {
      return 'warning';
    }
    return 'offline';
  }
}
