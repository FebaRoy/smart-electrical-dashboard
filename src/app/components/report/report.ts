import { Component } from '@angular/core';
import { Data } from '../../services/data';

@Component({
  selector: 'app-report',
  imports: [],
  templateUrl: './report.html',
  styleUrl: './report.scss',
})
export class Report {
  loading = false;

  constructor(private dataService: Data) {}
  downloadCSV() {
    this.loading = true;
    this.dataService.downloadReport().subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'system_report.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      this.loading = false;
    });
  }
}
