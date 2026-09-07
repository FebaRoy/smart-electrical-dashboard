import { Component } from '@angular/core';
import { Data } from '../../services/data';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-report',
  imports: [],
  templateUrl: './report.html',
  styleUrl: './report.scss',
})
export class Report {
  constructor(private dataService: Data) {}

  exportReport() {
    this.dataService.downloadReport().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'intelligrid_report.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Export failed: ', error);
      },
    });
  }
}
