import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { VehicleService } from '../services/vehicle.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  constructor(
    private vehicleService: VehicleService,
    private router: Router,
  ) { }

  registrationForm!: FormGroup;
  city: any[] = [];
  states: any[] = [];
  sortedCities: any[] = [];
  selectedFile: File | null = null;

  ngOnInit(): void {
    this.initializeForm();
    this.loadInitialData();
  }

  loadInitialData() {
    this.vehicleService.getStates().subscribe(data => {
      this.states = data;
      // console.log(this.states)
    });

    this.vehicleService.getCities().subscribe(data => {
      this.city = data;
      // console.log(this.city)
    });
  }

  initializeForm() {
    this.registrationForm = new FormGroup({
      fullName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, this.emailValidator]),
      phoneNumber: new FormControl('', [
        Validators.required, this.phoneValidator
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/)
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      dateOfBirth: new FormControl(null, [this.dateValidator]),
      profilePicture: new FormControl(null),
      termsAndConditions: new FormControl(false, [Validators.requiredTrue])
    });
  }

  cityCaller() {
    this.registrationForm.get('city')?.reset();
    const stateId = this.registrationForm.get('state')?.value;
    if (stateId) {
      this.getDistrictLabel(stateId);
    }
  }

  getDistrictLabel(stateId: number) {
    this.sortedCities = this.city.filter(
      city => city.state == stateId
    );
    // console.log(this.sortedCities)
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    } else {
      console.error('No file selected.');
    }
  }


  navigateToLogin() {
    this.router.navigate(['']);
  }


  // Submit handler
  onSubmit() {
    if (this.registrationForm.valid) {
      const formData = new FormData();

      Object.keys(this.registrationForm.value).forEach(key => {
        formData.append(key, this.registrationForm.value[key]);
      });

      if (this.selectedFile) {
        formData.append('profilePicture', this.selectedFile, this.selectedFile.name);
      }

      this.vehicleService.createUser(formData).subscribe(
        response => {
          console.log('User created successfully:', response);
          this.resetForm();
          this.router.navigate(['']);
        },
        error => {
          console.error('Error submitting form:', error);
        }
      );
    } else {
      console.error('Form is invalid');
      this.registrationForm.markAllAsTouched();
    }
  }



  // Reset form handler
  resetForm() {
    this.registrationForm.reset();
  }


  //CustomValidators

  emailValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // If there's no value, don't validate yet
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const valid = emailRegex.test(control.value);
    return valid ? null : { invalidEmail: true };
  }

  phoneValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // If there's no value, don't validate yet
    }

    const phoneRegex = /^[0-9]{10}$/; // Matches exactly 10 digits
    const valid = phoneRegex.test(control.value);
    return valid ? null : { invalidPhoneNumber: true };
  }

  dateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const dob = new Date(control.value);

    if (isNaN(dob.getTime())) {
      return { invalidDate: true };
    }

    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    if (age >= 18) {
      return null;
    } else {
      return { underage: true };
    }
  }


}
