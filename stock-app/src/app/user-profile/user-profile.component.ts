import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { StockService } from '../stock.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {


  favourites: any[] = [  
    {ticker: 'APPL', change: '+5.00', high :'148.70 ' ,low:'145.90',adjClose :'146.50 '},  
    {ticker: 'ABDN', change: '-6.50', high :'3030.00' ,low:'2912.50',adjClose :'2968.50'},  
    {ticker: 'ADM', change: '+18.00', high :'174.20' ,low:'166.00',adjClose :'166.40'},  
    {ticker: 'AAF', change: '+0.30', high :'1669.00' ,low:'1629.50',adjClose :'1635.00'},  
    {ticker: 'AAL', change: '-36.00', high :'2328.00 ' ,low:'2290.00',adjClose :'2314.00'},  
    {ticker: 'ANTO', change: '-24.50', high :'1168.50' ,low:'1126.00',adjClose :'1140.00'},  
    {ticker: 'AHT', change: '+17.00', high :'686.60' ,low:'679.80',adjClose :'685.20'},  
    {ticker: 'ABF', change: '-20.00', high :'663.60 ' ,low:'657.40',adjClose :'660.40'}
  ];  

  destroy$: Subject<boolean> = new Subject<boolean>();
  // favData: any;
  // favCloses: any='';
  // favOpens: any='';
  favPercents: any;
  favDataList: any;
  isDataLoaded =false;
  displayDailyData: any[]=[];
  displayNOlist: boolean=false;
  favNames: any;
  constructor(private stockService : StockService) { }

  ngOnInit(): void {

    this.getfavList();
  }

  ngOnDestroy() {
    
    this.destroy$.next(true);
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

  getfavList(){
    this.stockService.getfavlist().pipe(takeUntil(this.destroy$)).subscribe(
      {next: (data: any) => { 
        console.log('INFO::::', data);

        this.favDataList = data.codelist;
        this.favPercents =data.codepercent;
        this.favNames = data.codenames;
        if(data.response !='nofav'){
          this.getDailyData( this.favDataList)
        }else{
          this.isDataLoaded= true;
          this.displayNOlist =true;
        }

      },
      error: (error: any) => {

       },
      complete: () => {
        
      }
    })
  }


  getDailyData(codelist :any){

this.stockService.getdailydatalist(codelist).pipe(takeUntil(this.destroy$)).subscribe(
      {next: (data: any) => { 
        console.log('INFO::::', data);

          let dailystatus :any[]=[];
          for (let i=0;i<=this.favDataList.length-1;i++){
            
            let status = {
              Ticker :this.favDataList[i].toUpperCase(),
              Open: data[0].open[0][i],
              Close : data[0].close[0][i],
              Percent :this.favPercents[i][this.favDataList[i]],
              Name : this.favNames[i]
            }
            
            dailystatus.push(status)
          }
          this.displayDailyData =dailystatus
          this.isDataLoaded= true;
      console.log('dailystsus>>>>>>>>>>>>',dailystatus);
      
    },
      error: (error: any) => {

       },
      complete: () => {}
    })
  }

  removeFavoriteStock(index:any,Ticker:any){

    this.displayDailyData.splice(index,1)

    let code = Ticker.slice(0,-2)

    this.stockService.rmvAFavStock(code).pipe(takeUntil(this.destroy$)).subscribe(
      {next: (data: any) => { 
        console.log('INFO::::', data);
      },
      error: (error: any) => {

       },
      complete: () => {}
    })

  }
}
