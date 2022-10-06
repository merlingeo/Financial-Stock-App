import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject ,takeUntil} from 'rxjs';
import { IState, StateService } from '../state.service';

@Component({
  selector: 'app-profilebasepage',
  templateUrl: './profilebasepage.component.html',
  styleUrls: ['./profilebasepage.component.scss']
})
export class ProfilebasepageComponent implements OnInit {

  destroy$: Subject<boolean> = new Subject<boolean>();
  new_state : any;
  nav_selected : any[] =[];
  
  navUser :any[]=[{link:'user-home', icon : 'favorite',name :'Favourites'},
  {link:'notif', icon : 'notifications',name :'Notifications'},
  {link:'msgexp', icon : 'message',name :'Expert Advice'}]
  
  navAdmin :any[]=[{link:'admin-home', icon : 'supervisor_account',name :'User Dashboard'},
  {link:'expert-list', icon : 'school',name :'Expert Dashboard'},
  {link:'notif', icon : 'notifications',name :'Notifications'}]
  
  navExpert :any[]=[{link:'exp-home', icon : 'message',name :'Message Inbox'},
  {link:'exp-out',icon : 'mail_outline',name :'Message Outbox'},
  {link:'notif', icon : 'notifications',name :'Notifications'}
]
  usr_name: any;
  usr_email: string='';
  
constructor(private stateService: StateService,
  private route: ActivatedRoute,
  private router: Router) { }

ngOnInit(): void {
  this.getCurrentState();

}

ngOnDestroy() {
  
  this.destroy$.next(true);
  this.destroy$.unsubscribe();
}
  
  
  
  
  getCurrentState(){
    this.stateService.current_state.pipe(takeUntil(this.destroy$)).subscribe((data )=>{
      
      console.log( 'current state profilebase pgestttssstte>>>>>',data);
      this.usr_name =data.user_name;
      this.usr_email =data.emailid;
      this.nav_selected = data.isAdmin? this.navAdmin: data.isExpert? this.navExpert:this.navUser;
      
      this.router.navigate([this.nav_selected[0].link],{ relativeTo: this.route });
    })
  }

  sideNavLogOut(){

    this.stateService.setState({ token: '',
    isAdmin: false,
    isExpert :false,
    isUser :false,
    user_name : '',
    emailid :''})
    
    sessionStorage.removeItem('token');
    this.router.navigate(['login']);

  }
}
