import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Istock } from '../ftsepage/ftsepage.component';
import { StockService } from '../stock.service';

@Component({
  selector: 'app-ticker-dashboard',
  templateUrl: './ticker-dashboard.component.html',
  styleUrls: ['./ticker-dashboard.component.scss']
})
export class TickerDashboardComponent implements OnInit {

  // @Input()
  // currentitem!: Istock; 

  isLoadingResults = true;
  isRateLimitReached = false;

  destroy$: Subject<boolean> = new Subject<boolean>();
  searchticker: string | null | undefined;
  dailyObj: any;
  stockINFO: any;
  newsData: any;
  
  constructor(private stockService : StockService,private route: ActivatedRoute) { }

  ngOnInit(): void {

    // console.log('childdata obtained :',this.currentitem);
    // // console.log('childdata 123243235>>> :',this.stockDaily);
    // if (this.currentitem){

    //   this.getDailyStockPrices(this.currentitem.code);
    //   this.getStockINFO(this.currentitem.code)
    // }
    if(this.route.snapshot.paramMap.get('id')){
      console.log('from route>>>',this.route.snapshot.paramMap.get('id'));
      
      this.searchticker = this.route.snapshot.paramMap.get('id');
      this.getStockINFO(this.searchticker)
      this.getDailyStockPrices(this.searchticker);
    }

  }

  ngOnDestroy() {
    
    this.destroy$.next(true);
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }
  
 getDailyStockPrices(ticker: any){
 this.isLoadingResults = true;
  this.dailyObj = {code : ticker};

  this.stockService.getAStocks(ticker).pipe(takeUntil(this.destroy$)).subscribe(
    {next: (data: any) => { 
      console.log('daily::::', data);
      this.isRateLimitReached = data === null;

      console.log('djkfhsdjfhsljfhlsjgsdg',Object.values(data['Open'])[0]);
      this.dailyObj = {...this.dailyObj,
         Open: Object.values(data['Open'])[0],
         Close: Object.values(data['Close'])[0],
         High: Object.values(data['High'])[0],
         Low: Object.values(data['Low'])[0], 
         Volume: Object.values(data['Volume'])[0],
         Date: Object.values(data['Date'])[0],
         AdjClose : Object.values(data['Adj Close'])[0],

    };
    console.log('from ticker dashboard',this.dailyObj);
    

    },
    error: (error: any) => { },
    complete: () => {}
  })

 }

 getStockINFO(ticker: any){

 

  this.stockService.stockInfoDB(ticker).pipe(takeUntil(this.destroy$)).subscribe(
    {next: (data: any) => { 
      console.log('INFO::::', data);
      this.displayStockNews(data[0]['news']); 
      
      setTimeout(()=>{                         
      this.stockINFO = data;
      this.isLoadingResults = false;
   }, 1000);

      this.isRateLimitReached = data === null;
    },
    error: (error: any) => {
      this.isLoadingResults = false;
     },
    complete: () => {}
  })

 }

 addtofavourites(){
  console.log('button clicked!!!');
  
  let favcode ={"code" : this.searchticker};

  this.stockService.addtofav(favcode).pipe(takeUntil(this.destroy$)).subscribe(
    {next: (data: any) => { 
      console.log('Added to fav');
      
    
    },
    error: (error: any) => {

     },
    complete: () => {}
  })

 }

 displayStockNews(newstext :string){
  console.log(newstext);
  this.stockService.getStockNews(newstext).pipe(takeUntil(this.destroy$)).subscribe(
    (data: any) => { 
      console.log('Added to fav',data);
      this.newsData =data['data'];
      
    
    });
  

  }
}


      // this.stockDaily =data;
     
      // const d = new Date(value); 
      // console.log(d.toLocaleString('en-GB', { timeZone: 'UTC' }));