import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import * as shajs from 'sha.js';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { PasswordMatch } from '../register.validator';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.scss']
})
export class UserRegisterComponent implements OnInit {
    registerForm: any;
    isAdmin =false;
   
    destroy$: Subject<boolean> = new Subject<boolean>();
  maxDate: Date;


  constructor(private fb: FormBuilder,
    private UserService :UserService ,
    private router: Router) { 
      const currentYear = new Date().getFullYear();
      const currentMonth =new Date().getMonth();
      const currentDay =new Date().getDate();
      this.maxDate = new Date(currentYear - 18, currentMonth, currentDay);
    }


  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit() {
    
    this.createRegisterForm();
    // this.onDatePickerChange();
  }


  createRegisterForm(){

    this.registerForm = this.fb.group({
        "name": ["", [Validators.required,Validators.minLength(4)]],
        "email": ["",[Validators.required,Validators.email]],
        "password": ["", Validators.required],
        "confirmpassword": ["", Validators.required],
        "dob": ["", Validators.required],
        "address":["", Validators.required],
        "admin": [""]
      },{ validators: PasswordMatch });

  }

  onRegisterSubmit(regform?:any){
    // console.log(regform);
    console.log(formatDate(this.registerForm.value.dob,'yyyy-MM-dd','en_US'));
    
    let hash = shajs('sha256').update(this.registerForm.value.password).digest('hex');
    console.log(hash);
    

    this.registerForm.get("admin").patchValue('01');
    this.registerForm.controls['password'].setValue(hash);
    this.registerForm.controls['confirmpassword'].setValue(hash);
    console.log(this.registerForm.value);

    console.log(regform);

    this.UserService.userRegisteration(this.registerForm.value).pipe(takeUntil(this.destroy$)).subscribe((data:any) => {
      console.log('message::::', data);
      this.router.navigate(['/login']);
    });

  }

  onDatePickerChange(change :any){

    console.log(change.value  );
    
    let date2 = formatDate(change.value,'yyyy-MM-dd','en_US');
    console.log(date2);
    

      // let newdateformat = change.value.toISOString().split('T')[0]
      
      // this.registerForm.get("dob").patchValue(newdateformat);
      // console.log(newdateformat);

  }

  

}
