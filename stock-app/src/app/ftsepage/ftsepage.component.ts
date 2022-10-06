import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { StockService } from '../stock.service';

@Component({
  selector: 'app-ftsepage',
  templateUrl: './ftsepage.component.html',
  styleUrls: ['./ftsepage.component.scss']
})
export class FtsepageComponent implements OnInit {


 
  currentSelectedItem: Istock ={
    ISIN: '',
    code: '',
    marketcap: '',
    name: '',
    subsectors: '',
    admitdate: '',
    percentvalue :'',
    industry: '',
    supersector :'',
    sector :'',
    definition :'',


  };


  constructor(private stockService : StockService, private router: Router) { 

   
  }



  displayedColumns: string[] = ['No', 'Ticker', 'Name','Daily Percent','MarketCap', 'SubSector'];
  // currentSelectedItem ='';
  dataSource = new MatTableDataSource<Istock>();
 
  destroy$: Subject<boolean> = new Subject<boolean>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;
  
  ngAfterViewInit() {
    this.displayAllStocks();
    
    
   

    // this.stkSort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.stkSort;
  }
  ngOnInit(): void {

  }

  ngOnDestroy() {
    
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  displayAllStocks(){

    this.stockService.getAllStocks().pipe(takeUntil(this.destroy$)).subscribe(
      {next: (data: any) => { 
        console.log('allstocks::::', data);
        this.dataSource = new MatTableDataSource<Istock>(data.response);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (error: any) => { },
      complete: () => {}
    })

  }


  // showProgressSpinner = () => {
  //   this.displayProgressSpinner = true;
  //   setTimeout(() => {
  //     this.displayProgressSpinner = false;
  //   }, 3000);
  // };

  clickedStock( stk :Istock){
    console.log(stk);
    this.router.navigate(['ticker',stk.code]);
    // this.currentSelectedItem =stk;

  }

}


export interface Istock {
  ISIN: string;
  code: string;
  marketcap: string;
  name: string;
  subsectors: string;
  admitdate: string;
  percentvalue : string;
  industry: string;
  supersector :string;
  sector :string;
  definition :string;
}
