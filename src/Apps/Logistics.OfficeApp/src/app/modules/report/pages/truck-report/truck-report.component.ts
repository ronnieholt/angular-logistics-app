import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GrossesForInterval, Truck, TruckGrosses } from '@shared/models';
import { DistanceUnitPipe } from '@shared/pipes';
import { ApiService } from '@shared/services';
import { DateUtils } from '@shared/utils';

@Component({
  selector: 'app-truck-report',
  templateUrl: './truck-report.component.html',
  styleUrls: ['./truck-report.component.scss']
})
export class TruckReportComponent implements OnInit {
  public id!: string;
  public isBusy: boolean;
  public truck!: Truck;
  public truckGrosses!: TruckGrosses;
  public rpmLastMonth: number;
  public rpmAllTime: number;
  public chartData: any;
  public chartOptions: any;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private dateUtils: DateUtils,
    private distanceUnit: DistanceUnitPipe) 
  {
    this.isBusy = false;
    this.rpmLastMonth = 0;
    this.rpmAllTime = 0;

    this.chartData = {
      labels: [],
      datasets: [
        {
          label: 'Daily Gross',
          data: []
        }
      ]
    },

    this.chartOptions = {
      plugins: {
        legend: {
          display: false
        }
      }
    }
  }

  public ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });

    this.isBusy = true;
    this.fetchTruck();
    this.fetchTruckGrosses();
  }

  private fetchTruck() {
    this.apiService.getTruck(this.id).subscribe(result => {
      if (result.success && result.value) {
        this.truck = result.value;
      }
    });
  }

  private fetchTruckGrosses() {
    const oneMonthAgo = this.dateUtils.daysAgo(30);

    this.apiService.getTruckGrossesForInterval(this.id, oneMonthAgo).subscribe(result => {
      if (result.success && result.value) {
        const truckGross = result.value;
        this.truckGrosses = result.value;
        this.rpmAllTime = truckGross.totalGrossAllTime / this.toMi(truckGross.totalDistanceAllTime);

        if (truckGross.grosses) {
          this.rpmLastMonth = truckGross.grosses.totalGross / this.toMi(truckGross.grosses.totalDistance);
        }
        
        this.drawChart(truckGross.grosses!);
      }

      this.isBusy = false;
    });
  }

  private drawChart(grosses: GrossesForInterval) {
    const labels = new Array<string>();
    const data = new Array<number>();
    
    grosses.days.forEach(i => {
      labels.push(this.dateUtils.toLocaleDate(i.date));
      data.push(i.gross);
    });

    this.chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Daily Gross',
          data: data,
          fill: true,
          borderColor: '#FFA726',
          tension: 0.4,
          backgroundColor: '#F8E6CA'
        }
      ]
    }
  }

  private toMi(value?: number): number {
    return this.distanceUnit.transform(value, 'mi');
  }
}