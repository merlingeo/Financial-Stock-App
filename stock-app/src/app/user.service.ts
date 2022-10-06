import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { StateService } from './state.service';
import { Subject,takeUntil } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://127.0.0.1:5000/'; 

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

  destroy$: Subject<boolean> = new Subject<boolean>();
  
  constructor(private http: HttpClient) {

     
     }


  userLogin(loginform:any){

    return this.http.get(this.baseUrl + 'login',  {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Basic ' + btoa(loginform.username + ':' + loginform.password)
      })
    } );

  }

  // {
  //   headers: new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'x-header': 'x-value'
  //   })
  // }

  userRegisteration(registerform:any){

    return this.http.post(this.baseUrl + 'createuser', registerform,this.requestOptions
    //  {
    //   headers: new HttpHeaders({
    //     'Content-Type':  'application/json',
    //     'x-access-token': '',
    //     'Access-Control-Allow-Origin': '*'
    //   })
    // }
    );

  }

  getAllUsers(){


    return this.http.get(this.baseUrl + 'allusers', {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'x-access-token': sessionStorage.getItem('token')!,
        'Access-Control-Allow-Origin': '*'
      })
    });

  }

  userRoleUpgrade(rolechange:any ,public_id :string){


    return this.http.put(this.baseUrl + 'user/'+`${public_id}`,rolechange ,{
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'x-access-token': sessionStorage.getItem('token')!,
        'Access-Control-Allow-Origin': '*'
      })
    });
  }

  userChangePassword(passobj:any){

console.log('insideservice!!',passobj);

    return this.http.put(this.baseUrl+'changepwd' ,passobj ,{
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'x-access-token': sessionStorage.getItem('token')!,
        'Access-Control-Allow-Origin': '*'
      })
    });
  }

  userDelete(public_id :string){


    return this.http.delete(this.baseUrl + 'user/'+`${public_id}`, {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'x-access-token': sessionStorage.getItem('token')!,
        'Access-Control-Allow-Origin': '*'
      })
    });
  }

  getAllConversations(){


    return this.http.get(this.baseUrl + 'conversation', {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'x-access-token': sessionStorage.getItem('token')!,
        'Access-Control-Allow-Origin': '*'
      })
    });

  }

  getAllStars(){


    return this.http.get(this.baseUrl + 'get-stars', {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'x-access-token': sessionStorage.getItem('token')!,
        'Access-Control-Allow-Origin': '*'
      })
    });

  }

  expertSpecificConversation(){


    return this.http.get(this.baseUrl + 'expertreplies', {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'x-access-token': sessionStorage.getItem('token')!,
        'Access-Control-Allow-Origin': '*'
      })
    });

  }

  addNewConversation(newmsg:any){

    return this.http.post(this.baseUrl + 'createmsg', newmsg,{
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'x-access-token': sessionStorage.getItem('token')!,
        'Access-Control-Allow-Origin': '*'
      })
    }

    );
  }

  
  addNewReply(newreply:any){

    return this.http.post(this.baseUrl + 'createreply', newreply,{
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'x-access-token': sessionStorage.getItem('token')!,
        'Access-Control-Allow-Origin': '*'
      })
    }

    );
  }

  
  getAllUnansweredQstn(){


    return this.http.get(this.baseUrl + 'unanswered', {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'x-access-token': sessionStorage.getItem('token')!,
        'Access-Control-Allow-Origin': '*'
      })
    });

  }

  giveRating(msgbody:any){


    return this.http.put(this.baseUrl + 'star-rating',msgbody ,{
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'x-access-token': sessionStorage.getItem('token')!,
        'Access-Control-Allow-Origin': '*'
      })
    });
  }

}
