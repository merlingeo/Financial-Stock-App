import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
// import * as Plotly from 'plotly.js';
import { Subject,takeUntil } from 'rxjs';
import { StockService } from '../stock.service';

declare const Plotly: { newPlot: (arg0: string, arg1: any, arg2: any) => void; };

@Component({
  selector: 'app-plotly',
  templateUrl: './plotly.component.html',
  styleUrls: ['./plotly.component.scss']
})
export class PlotlyComponent implements OnInit {

  // @ViewChild('chart')
  // el!: ElementRef;
  @ViewChild("rideShareGraph", { static: false })
  rideShareGraphContainer!: ElementRef;

  @ViewChild("VolumeGraph", { static: false })
  VolumeGraphContainer!: ElementRef;

// @Input Ticker :string;
  @Input('ticker') public ticker: string = '';

  destroy$: Subject<boolean> = new Subject<boolean>();
  plotData :any;
  rideShareGraph: any;
  volumeGraph:any;
  constructor(private stockService : StockService,private router: Router) { }

  ngOnInit(): void {

    // this.plotChart()
    this.creategraphTicker(this.ticker)
  }

    ngAfterViewInit() {
//     // Plotly.newPlot(
//     //     this.rideShareGraphContainer.nativeElement,
//     //     this.rideShareGraph.data,
//     //     this.rideShareGraph.layout,
//     //     this.rideShareGraph.config
//     //   );
//     Plotly.newPlot('myDiv', data, layout);
  }


  creategraphTicker(ticker:string){

        this.stockService.stockPlotGraph(ticker).pipe(takeUntil(this.destroy$)).subscribe(
          {next: (data: any) => { 
            // if(data.code ==ticker)
            console.log('datagraph::::', data);
            this.plotData =data;
            this.graphPloting();
            this.volumeGraphPloting();
            
          },
          error: (error: any) => { 
            console.warn('ticker does not exist!!');
            
          },
          complete: () => {}
        })
      }


      graphPloting(){
            this.rideShareGraph = {
              data: [
                // {
                //   x: Object.values(this.plotData.Date),
                //   y:  Object.values(this.plotData.Open),
                //   type: 'scatter',
                //   name: 'Open',
                // },
                {
                  x: Object.values(this.plotData.Date),
                  y:  Object.values(this.plotData.Close),
                  type: 'scatter',
                  name: 'Close',
                },
              ],
              layout: {
                responsive: true,
                title: { text: 'Five Year Stock Data' },
                xaxis: { 
                  title: { text: "Dates" },
                },
                yaxis: {
                  title: { text: "Close" },
                },
              }
            };

            Plotly.newPlot(this.rideShareGraphContainer.nativeElement, this.rideShareGraph.data, this.rideShareGraph.layout);

          }

          volumeGraphPloting(){

            this.volumeGraph={
              data: [

                {
                  x: Object.values(this.plotData.Date),
                  y:  Object.values(this.plotData.Volume),
                  type: 'scatter',
                  name: 'Volume',
                },
              ],
              layout: {
                responsive: true,
                title: { text: 'Five Year Volume' },
                xaxis: { 
                  title: { text: "Dates" },
                },
                yaxis: {
                  title: { text: "Volume" },
                },
              }
            }
            Plotly.newPlot(this.VolumeGraphContainer.nativeElement, this.volumeGraph.data, this.volumeGraph.layout);

          }

}
