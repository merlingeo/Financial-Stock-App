import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  destroy$: Subject<boolean> = new Subject<boolean>();
  
  private baseUrl = 'http://127.0.0.1:5000/'; 
 
  constructor(private http: HttpClient) { }

  current_token:any =sessionStorage.getItem("token")?sessionStorage.getItem("token"):'';

   headerData = {
     'Content-Type': 'application/json',
     'Access-Control-Allow-Origin': '*',
     'x-access-token':this.current_token,
    // 'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    // 'Access-Control-Allow-Credentials': 'true',
    // 'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS'

  }

   requestOptions = {                                                                                                                                                                                 
    headers: new HttpHeaders(this.headerData), 
  };
  
  getAllStocks(){

    return this.http.get(this.baseUrl + 'getstocklist', this.requestOptions);
  }

  getAStocks(code:string){

    return this.http.get(this.baseUrl + 'stockdaily/'+`${code}`, this.requestOptions);
  }

  stockInfoDB(code:string){

    return this.http.get(this.baseUrl + 'stockInfo/'+`${code}`, this.requestOptions);
  }

  stockPlotGraph(code:string){

    return this.http.get(this.baseUrl + 'plotgraph/'+`${code}`, this.requestOptions);
  }

  topGainersLoosers(){

    return this.http.get(this.baseUrl + 'gainlose', this.requestOptions);
  }
  

  getDiffIndustry(){

    return this.http.get(this.baseUrl + 'diffindushome', this.requestOptions);
  }

  addtofav(favdetails :any){

    // userRoleUpgrade(rolechange:any ,public_id :string){
console.log('inside add to fav',favdetails);


      return this.http.post(this.baseUrl + 'addtofav', favdetails,{
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'x-access-token': sessionStorage.getItem('token')!,
          'Access-Control-Allow-Origin': '*'
        })
      });

  }

  getfavlist(){


    return this.http.get(this.baseUrl + 'addtofav', {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'x-access-token': sessionStorage.getItem('token')!,
        'Access-Control-Allow-Origin': '*'
      })
  })

 
  

}

getdailydatalist(datalist :any){


  return this.http.put(this.baseUrl + 'stockdailylist',datalist, {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'x-access-token': sessionStorage.getItem('token')!,
      'Access-Control-Allow-Origin': '*'
    })
})
}

rmvAFavStock( ticker:any){


  return this.http.delete(this.baseUrl + 'rmvfav/'+`${ticker}`, {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'x-access-token': sessionStorage.getItem('token')!,
      'Access-Control-Allow-Origin': '*'
    })
})
}

getStockNews(nwstxt: string){ 
  return this.http.get(nwstxt) }


}

