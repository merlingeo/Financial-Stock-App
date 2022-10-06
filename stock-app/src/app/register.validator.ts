import { formatDate } from '@angular/common';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';


// export function match(controlName: string, checkControlName: string): ValidatorFn {
//       return (controls: AbstractControl) => {
//         const control = controls.get(controlName);
//         const checkControl = controls.get(checkControlName);
  
//         // if (checkControl.errors && !checkControl.errors.matching) {
//         //     return null;
//         //   }
    
//         //   if (control.value !== checkControl.value) {
//         //     controls.get(checkControlName).setErrors({ matching: true });
//         //     return { matching: true };
//         //   } else {
//         //     return null;
//         //   }
//         }
//     }
  
  

// function dateValidator(): ValidatorFn {
export function dateValidator():ValidatorFn{
        
    return (control: AbstractControl): {[key: string]: any} | null => {
      const today = new Date();
      const year = today.setFullYear(today.getFullYear() - 18);
  
      if(!(control && control.value)) {
        // if there's no control or no value, that's ok
        return null;
      }
  
      // return null if there's no errors
      return new Date(control.value) > new Date(year)
        ? {invalidDate: 'You must be at least 18 years old' } 
        : null;
    }
  }


  export const PasswordMatch: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const pass = control.get('password');
    const confirmPass = control.get('confirmpassword');
    const oldpass =control.get('oldpassword')?control.get('oldpassword'):'';

    if(control.get('oldpassword')){

      return oldpass && pass && oldpass.value === pass.value ? { NoChangeinPass: true } : pass && confirmPass && pass.value === confirmPass.value ?  null :{ passwordsNotMatch: true };
    }
    return pass && confirmPass && pass.value === confirmPass.value ?  null :{ passwordsNotMatch: true };
  };

  

  
