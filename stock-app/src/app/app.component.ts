import { Component } from '@angular/core';
import { MatDialog,MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject,takeUntil } from 'rxjs';
import { StateService } from './state.service';
import { UserRegisterComponent } from './user-register/user-register.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  destroy$: Subject<boolean> = new Subject<boolean>();
  title = 'stock-app';
  isLoggedIn =false;
  user_name :string='';

  constructor(public dialog: MatDialog,
    public router: Router,
    private stateService: StateService ) { 
      sessionStorage.removeItem('token');
      
      this.getCurrentState();
    }

  // openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
  //   this.dialog.open(UserRegisterComponent);
  // }

  getCurrentState(){
    this.stateService.current_state.pipe(takeUntil(this.destroy$)).subscribe((data )=>{
      console.log('app component state>>>', data);

      this.isLoggedIn = !!data.token;
      console.log('sjfgdshfghdsgfsg????????', !!data.token);
      this.user_name =data.user_name;
      console.log('usrname_top>>>>',this.user_name);
      
      
      
    });
  }

  logOut(){
    this.isLoggedIn = false;
    console.log(' this.isLoggedIn', this.isLoggedIn);
    this.stateService.setState({ token: '',
    isAdmin: false,
    isExpert :false,
    isUser :false,
    user_name : '',
    emailid :''})
    sessionStorage.removeItem('token');
    this.router.navigate(['/']);
    
  }

}



