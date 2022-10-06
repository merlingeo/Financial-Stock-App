import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject,takeUntil } from 'rxjs';
import { StockService } from '../stock.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  stockINFO: any;
  displayStocklist_headings: string[] = [];
  displayStocklist_data =[];
  loserData: any;
  gainerData: any;
  industryINFO: any;
  industryData: Array<any> = [];
  industryHeading: string[] = [];
  // dailystatus: never[];
  // dailyObj={};
  // displayStocklist_headings =[];

  constructor(private stockService : StockService,private router: Router) { }
  destroy$: Subject<boolean> = new Subject<boolean>();
  
  ngOnInit(): void {
    this.getTopLoosersGainers()
    this.getIndustrialData()
  }

  searchTicker(ticker:any){
    
    
    console.log('fnsjkdfj routed!!!!',ticker);
    this.stockService.getAStocks(ticker).pipe(takeUntil(this.destroy$)).subscribe(
      {next: (data: any) => { 
        // if(data.code ==ticker)
        console.log('allstock::::', data);
        
        this.router.navigate(['ticker',ticker]);
        
      },
      error: (error: any) => { 
        console.warn('ticker does not exist!!');
        
      },
      complete: () => {}
    })
    
  }


  getTopLoosersGainers(){

    this.stockService.topGainersLoosers().pipe(takeUntil(this.destroy$)).subscribe(
      {next: (data: any) => { 
        console.log('Losegain::::', data);
        
            this.stockINFO = data;
            console.log(Object.keys( this.stockINFO)[0]);
            // let op_keys = Object.keys( this.stockINFO)
            
            // op_keys.forEach((element:any) => {
              
            //   this.displayStocklist_headings.push('Top ' + element)
            // });
            this.loserData =this.stockINFO['Losers'];
            this.gainerData =this.stockINFO['Gainers'];
          console.log(this.loserData);
          console.log(this.gainerData);
          

      },
      error: (error: any) => {
        // this.isLoadingResults = false;
       },
      complete: () => {}
    })
  
  }


  getIndustrialData(){

    this.stockService.getDiffIndustry().pipe(takeUntil(this.destroy$)).subscribe(
      {next: (data: any) => { 
        console.log('Losegain::::', data);
        
            this.industryINFO = data;
            console.log(Object.keys( this.industryINFO));

            this.industryHeading =Object.keys( this.industryINFO);
            Object.keys( this.industryINFO).forEach(element => {
              let op_industrylist =this.industryINFO[element]
              // op_industrylist?.sort((a:any, b:any) => (parseInt( a.daily) <parseInt( b.daily) ? 1 : -1))

              this.industryData.push(op_industrylist)
              
              // console.log('this.industryData', this.industryData);
            });
        

          
          

      },
      error: (error: any) => {
       },
      complete: () => {}
    })

  }

  routeToTicker(op:any){
    console.log('sjfldfnlop??>>>',op);
    this.router.navigate(['/ticker/'+op]);
    
  }
}
