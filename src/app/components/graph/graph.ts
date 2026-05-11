import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import { Data } from '../../services/data';

Chart.register(...registerables);

@Component({
  selector: 'app-graph',
  imports: [],
  templateUrl: './graph.html',
  styleUrl: './graph.scss',
})
export class Graph implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas') chartRef!: ElementRef;

  chart: any;
  dataSub!: Subscription;

  labels: string[] = [];
  dataPoints: number[] = [];

  constructor(private dataService: Data) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.createChart();

    // Load history
    this.dataService.getHistory().subscribe((history) => {
      history.forEach((item) => {
        this.updateChart(item, false);
      });
    });

    // Live updates
    this.dataSub = this.dataService.data$.subscribe((data) => {
      this.updateChart(data, true);
    });
  }

  toggleDataset(index: number, event: any) {
    const chart = this.chart;

    chart.data.datasets[index].hidden = !event.target.checked;

    chart.update();
  }

  createChart() {
    const ctx = this.chartRef.nativeElement.getContext('2d');

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Voltage (V)',
            data: [],
            borderColor: '#22c55e',
            tension: 0.4,
            pointRadius: 0,
          },
          {
            label: 'Current (A)',
            data: [],
            borderColor: '#3b82f6',
            tension: 0.4,
            pointRadius: 0,
          },
          {
            label: 'Power (W)',
            data: [],
            borderColor: '#f59e0b',
            tension: 0.4,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 300,
          easing: 'linear',
        },
        elements: {
          point: {
            radius: 0,
          },
        },
        plugins: {
          legend: {
            labels: { color: '#ffffff' },
          },
        },
        scales: {
          x: {
            ticks: { color: '#ffffff' },
          },
          y: {
            ticks: { color: '#ffffff' },
          },
        },
      },
    });
  }

  updateChart(dataPoint: any, isLive: boolean) {
    if (!this.chart) return;

    const time = new Date().toLocaleTimeString();

    const labels = this.chart.data.labels as string[];

    const voltageData = this.chart.data.datasets[0].data as number[];
    const currentData = this.chart.data.datasets[1].data as number[];
    const powerData = this.chart.data.datasets[2].data as number[];

    labels.push(time);
    voltageData.push(dataPoint.voltage);
    currentData.push(dataPoint.current);
    powerData.push(dataPoint.power);

    if (labels.length > 20) {
      labels.shift();
      voltageData.shift();
      currentData.shift();
      powerData.shift();
    }

    this.chart.update(isLive ? 'none' : undefined);
  }

  ngOnDestroy() {
    this.dataSub?.unsubscribe();
  }
}
