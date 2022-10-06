import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { PasswordMatch } from '../register.validator';
import { UserService } from '../user.service';
import * as shajs from 'sha.js';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {


  pwdForm: any;
  ispassUpdated :any;

  constructor(private fb: FormBuilder,
    private userService :UserService,
    // private router: Router,
    // private stateService: StateService
    ) { }

  destroy$: Subject<boolean> = new Subject<boolean>();

  ngOnInit(): void {
    this.createpaswordChangeForm();
  }

  createpaswordChangeForm(){
    this.pwdForm = this.fb.group({
      "oldpassword": ["", [Validators.required]],
      "password":["", Validators.required],
      "confirmpassword" : ["", Validators.required]
    },{ validators: PasswordMatch });
  }



  onSubmit(){
    console.log('insideOnsubmitt');
    let newpassObj ={
      "oldpassword":  shajs('sha256').update(this.pwdForm.value.oldpassword).digest('hex'),
      "password": shajs('sha256').update(this.pwdForm.value.password).digest('hex')
    }
    this.userService.userChangePassword(newpassObj).pipe(takeUntil(this.destroy$)).subscribe(
      {next: (data: any) => { 
        console.log('response::::', data);
        if(data[1]==200){
          this.pwdForm.reset()
          this.pwdForm.markAsPristine();
          for (let control in this.pwdForm.controls) {
            this.pwdForm.controls[control].setErrors(null);
          }
          this.ispassUpdated= "Password Updated Successfully!!!";
        }else{
          this.ispassUpdated= "Old password entered is Incorrect!!!";
        }

      },
      error: (error: any) => {

       },
      complete: () => {}
    })
  }

}
