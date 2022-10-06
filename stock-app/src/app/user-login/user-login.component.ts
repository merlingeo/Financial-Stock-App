import { ListKeyManager } from '@angular/cdk/a11y';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators ,FormGroup} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {  map, Observable, Subject, takeUntil } from 'rxjs';
import * as shajs from 'sha.js';
import { IState, StateService } from '../state.service';
import { UserService } from '../user.service';


@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {
  loginForm: any;
  state$!: Observable<IState>;
  destroy$: Subject<boolean> = new Subject<boolean>();
  
  constructor(private fb: FormBuilder,
    private userService :UserService,
    private router: Router,
    private stateService: StateService) { }

  ngOnInit(): void {
    
   
    this.createLoginForm();
    this.stateService.current_state.pipe(takeUntil(this.destroy$)).subscribe((data)=>{

      console.log( 'stttssstte>>>>>',data);
    })
    
  }
  ngOnDestroy() {
    
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  createLoginForm(){
    this.loginForm = this.fb.group({
      "username": ["", [Validators.required,Validators.email]],
      "password":["", Validators.required]
    });
  }


  onSubmit(){
    console.log(this.loginForm.status);
    let token : any;
    let hash = shajs('sha256').update(this.loginForm.value.password).digest('hex');
    console.log(hash);
    // this.loginForm.get("password").patchValue(hash);
    this.loginForm.controls.password.setValue(hash);
    console.log(this.loginForm.value);

    this.userService.userLogin(this.loginForm.value).pipe(takeUntil(this.destroy$)).subscribe(
      {next: (data: any) => { 
        console.log('message::::', data);
        token=data.token;
        if (data.sign == '00'){

          this.stateService.setState({isAdmin:true, token:data.token,user_name:data.name,emailid:data.email})
          this.router.navigate(['profile']);

        }else if(data.sign == '11'){

          this.stateService.setState({isExpert:true ,token:data.token,user_name:data.name,emailid:data.email})
          this.router.navigate(['profile']);

        }else{
          this.stateService.setState({isUser:true,token:data.token,user_name:data.name,emailid:data.email})
          this.router.navigate(['home']);
        }
      },
      error: (error: any) => { 
        this.loginForm.reset();
        console.log('error>>>>>>',error.error);
        console.log('error>>>>>>',error.status);
        sessionStorage.removeItem('token');

      },
      complete: () => {
        this.loginForm.reset();
        sessionStorage.setItem('token', token);
         console.log('login successfull');
      }
    }

    //   ((data:any) => {
    //   console.log('message::::', data);
    //   sessionStorage.setItem('token', data.token);
    //   this.router.navigate(['/']);
    // }),

    );
    
  }
}
