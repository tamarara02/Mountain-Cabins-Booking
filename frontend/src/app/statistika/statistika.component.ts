import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgCharts } from 'ag-charts-angular';
import { AgChartOptions } from 'ag-charts-community';
import { VlasnikService } from '../services/vlasnik.service';
import { Reservation } from '../models/Rezervacija';
import { Cottage } from '../models/Vikendica';



@Component({
  selector: 'app-statistika',
  standalone: true,
  imports: [FormsModule, CommonModule, AgCharts ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './statistika.component.html',
  styleUrl: './statistika.component.css'
})
export class StatistikaComponent {
  private service = inject(VlasnikService)

  username: any = ""
  allRes: Reservation[] = []
  allCot: Cottage[] = []

  ngOnInit(){
    this.username = localStorage.getItem("username")
    this.service.getMyCottages(this.username).subscribe(data=>{
      if(data!=null){
        this.allCot = data

        this.service.getMyReservations(this.username).subscribe(data=>{
          if(data!=null){
            this.allRes = data
            console.log("all reservations: ", this.allRes)

            const cottageMap: Record<number, string> = {};
            this.allCot.forEach(c => {
              cottageMap[c.id] = c.name;
            });

            const finished = this.allRes.filter(r => r.status === 'zavrsena');

            let barChartData: any[] = [];
            let barSeries: any[] = [];

            if (finished.length > 0) {
              const months = Array.from(new Set(finished.map(r => new Date(r.startDate).toLocaleString('default', { month: 'short' }))));
              const cottages = Array.from(new Set(finished.map(r => r.cottageid)));

              barChartData = months.map(month => {
                const obj: any = { month };
                cottages.forEach(cottageId => {
                  obj[cottageMap[cottageId]] = finished.filter(r =>
                      r.cottageid === cottageId &&
                      new Date(r.startDate).toLocaleString('default', { month: 'short' }) === month
                    ).length;
                });
                return obj;
              });

              barSeries = cottages.map(cottageId => ({
                type: 'bar',
                xKey: 'month',
                yKey: cottageMap[cottageId]
              }));
            } else {
              // Ako nema završenih rezervacija, dummy podatak
              barChartData = [{ month: '', 'Nema završenih rezervacija': 0 }];
              barSeries = [{
                type: 'bar',
                xKey: 'month',
                yKey: 'Nema završenih rezervacija',
                label: { enabled: true }
              }];
            }

            this.barChartOptions = {
              data: barChartData,
              series: barSeries,
              title: {
                text: finished.length > 0 ? "" : 'Nema završenih rezervacija',
                fontSize: 16
              }
            };


            const cottagesAll = Array.from(new Set(this.allRes.map(r => r.cottageid)));
            const baseColors = [
              '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
              '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf',
              '#393b79', '#637939', '#8c6d31', '#843c39', '#7b4173',
              '#3182bd', '#31a354', '#e6550d', '#756bb1', '#636363'
            ];

            let pieData: any[] = [];
            let fills: string[] = [];
            let strokes: string[] = [];

            if (cottagesAll.length > 0) {
              cottagesAll.forEach((cottageId, i) => {
                const cottageRes = this.allRes.filter(r => r.cottageid === cottageId);
                let weekendCount = 0;
                let weekdayCount = 0;

                cottageRes.forEach(r => {
                  const start = new Date(r.startDate);
                  const end = new Date(r.endDate);
                  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                    const day = d.getDay();
                    if(day === 0 || day === 6) weekendCount++;
                    else weekdayCount++;
                  }
                });

                const cottageName = cottageMap[cottageId] || `Vikendica ${cottageId}`;
                const baseColor = baseColors[i % baseColors.length];
                const lightColor = lightenColor(baseColor, 0.5);

                pieData.push({ cottage: `${cottageName} - vikend`, count: weekendCount });
                pieData.push({ cottage: `${cottageName} - radna nedelja`, count: weekdayCount });

                fills.push(baseColor);
                fills.push(lightColor);
              });
            } else {
              // Ako nema rezervacija, dodaj dummy podatak
              pieData.push({ cottage: 'Nema rezervacija', count: 1 });
              fills.push('#cccccc');
              strokes.push('#ffffff');
            }

            function lightenColor(hex: string, luminosity: number) {
              hex = hex.replace(/[^0-9a-f]/gi, '');
              if (hex.length < 6) {
                hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
              }
              let rgb = "#", c, i;
              for (i = 0; i < 3; i++) {
                c = parseInt(hex.substr(i*2,2), 16);
                c = Math.round(Math.min(Math.max(0, c + (c * luminosity)), 255)).toString(16);
                rgb += ("00"+c).substr(c.length);
              }
              return rgb;
            }

            const pieSeries: any[] = [{
              type: 'pie',
              angleKey: 'count',
              legendItemKey: 'cottage',
              fills: fills,
              strokes: strokes,
              strokeWidth: 1
            }];

            this.pieChartOptions = {
              container: document.getElementById("myChart"),
              data: pieData,
              series: pieSeries,
              legend: { 
                enabled: true, 
                position: 'bottom'
              },
              title: {
                text: cottagesAll.length > 0 ? "" : 'Nema rezervacija',
                fontSize: 16
              }
            };
            
          }
        })

      }
    })
    
  }

  public barChartOptions: AgChartOptions;
  public pieChartOptions: AgChartOptions;
  constructor() {
    this.barChartOptions = {};
    this.pieChartOptions ={};
  }

  logOut(){
    localStorage.removeItem('username');
  }
}
