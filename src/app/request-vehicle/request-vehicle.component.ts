import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from '../services/vehicle.service';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-request-vehicle',
  templateUrl: './request-vehicle.component.html',
  styleUrl: './request-vehicle.component.css'
})
export class RequestVehicleComponent implements OnInit {

  requestForm!: FormGroup;

  vehicleId: number = 0;
  loginUserID: number = 0;
  loginUserType: number = 0;
  receivedData: any;
  idDict: any;


  vehicleName: string = '';
  vehicleType: string = '';
  brand: string = '';
  rentPerDay: string = '';
  description: string = '';
  message: any = '';

  constructor(
    private router: ActivatedRoute,
    private vehicleService: VehicleService,
    private route: Router,
  ) { }
  ngOnInit(): void {
    this.initializeForm();
    this.router.queryParams.subscribe(params => {
      const data = params['data'];

      if (data) {
        try {
          this.receivedData = JSON.parse(decodeURIComponent(data));
          console.log(this.receivedData);

          this.vehicleId = this.receivedData['vehicleId'];
          this.loginUserID = this.receivedData['loginUserID']
          this.loginUserType = this.receivedData['loginUserType']

          if (this.vehicleId) {
            this.loadVehicleDetails(this.vehicleId);
          }
        } catch (error) {
          console.error('Failed to parse data:', error);
        }
      }
    });
    if(this.loginUserType != 2){
      this.route.navigate([''])
    }
  }

  initializeForm() {
    this.requestForm = new FormGroup({
      startDate: new FormControl('', [Validators.required, this.startDateValidator]),
      endDate: new FormControl('', [Validators.required, this.endDateValidator]),
    })
  }

  loadVehicleDetails(id: number) {
    this.vehicleService.getVehicleByIdForUser(id).subscribe((data) => {
      // console.log(data)
      this.vehicleName = data.vehicleName
      this.vehicleType = data.vehicleType
      this.brand = data.brand
      this.rentPerDay = data.rent
      this.description = data.description
    })
  }

  viewList() {
    this.idDict = { 'loginUserID': this.loginUserID, 'vehicleId': this.vehicleId, 'loginUserType': this.loginUserType };
    const encodedData = encodeURIComponent(JSON.stringify(this.idDict));
    this.route.navigate(['userPanel'], { queryParams: { data: encodedData } });
  }

  sendRequest() {
    this.message = "";
    this.requestForm.markAllAsTouched();
    if (this.requestForm.valid) {
      const data = { ...this.requestForm.value };
      data.vehicleId = this.vehicleId;
      data.userId = this.loginUserID;
      console.log(data);
      this.vehicleService.sendRequest(data).subscribe((response) => {
        this.message = response;
        console.log(this.message)
        this.requestForm.reset();

        // this.idDict = { 'loginUserID': this.loginUserID, 'vehicleId': this.vehicleId, 'loginUserType': this.loginUserType };
        // const encodedData = encodeURIComponent(JSON.stringify(this.idDict));
        // this.route.navigate(['userPanel'], { queryParams: { data: encodedData } });
      });

    } else {
      this.requestForm.markAllAsTouched();
      console.log(this.requestForm.value);
    }
  }


  //Custom Validators
  startDateValidator(control: AbstractControl): ValidationErrors | null {
    const selectedDate = new Date(control.value);
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (isNaN(selectedDate.getTime()) || selectedDate <= today) {
      return { startdateNotValid: true };
    }

    return null;
  }

  endDateValidator(control: AbstractControl): ValidationErrors | null {
    const endDate = new Date(control.value);
    const formGroup = control.parent;
    const startDate = formGroup ? new Date(formGroup.get('startDate')?.value) : null;
  
    if (!startDate || isNaN(endDate.getTime()) || isNaN(startDate.getTime())) {
      return null; // Do not validate if startDate or endDate is invalid
    }
  
    if (endDate < startDate) {
      return { endDateNotAfterStartDate: true };
    }
  
    return null;
  }
}
