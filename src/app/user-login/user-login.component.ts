import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehicleService } from '../services/vehicle.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css'
})
export class UserLoginComponent {
  loginForm!: FormGroup;
  loginUserId: number = 0;
  loginUserType: number = 0;
  message: string = '';
  idDict:any;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private route: Router,
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.vehicleService.userLogin(this.loginForm.value).subscribe((response: any) => {
        console.log('Login Successful', this.loginForm.value);
        // console.log(response)
        this.loginUserId = response['userId'];
        this.loginUserType = response['user'];
        this.loginForm.reset();

        if (this.loginUserType === 1) {
          
          this.idDict = { 'loginUserID': this.loginUserId, 'loginUserType': this.loginUserType };
          const encodedData = encodeURIComponent(JSON.stringify(this.idDict));
          this.route.navigate(['adminPanel'], { queryParams: { data: encodedData } });
          
        }
        else if (this.loginUserType === 2) {
          this.idDict = { 'loginUserID': this.loginUserId, 'loginUserType': this.loginUserType };
          const encodedData = encodeURIComponent(JSON.stringify(this.idDict));
          this.route.navigate(['userPanel'], { queryParams: { data: encodedData } });
        } 
      }, (error) => {
        this.message = 'Check Login Credentials and Try Again'
      });

    } else {
      this.loginForm.markAllAsTouched();
      console.log('Form is invalid', this.loginForm.value);
    }
  }

  navigateToRegister() {
    this.route.navigate(['userForm']); 
}

togglePasswordVisibility() {
  this.showPassword = !this.showPassword;
}

}

