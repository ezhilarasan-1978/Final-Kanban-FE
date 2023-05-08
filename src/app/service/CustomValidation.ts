import { AbstractControl, FormControl, FormControlName, FormGroup, ValidationErrors } from "@angular/forms";

export class CustomValidation{
    
    static passwordMatchValidator(group:FormGroup){
        const password = group.get('password')?.value;
        const confirmPassword=group.get('Cpassword')?.value;

        if(password===confirmPassword){
            return null;
        }else{
            return {PasswordError:true};
        }
    }
}   