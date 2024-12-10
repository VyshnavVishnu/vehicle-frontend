import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehicleService } from '../services/vehicle.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrl: './vehicle-form.component.css'
})
export class VehicleFormComponent implements OnInit {

  vehicleForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private route: Router,
    private router: ActivatedRoute,
  ) { }

  vehicleId: number = 0;
  loginUserID: number = 0;
  loginUserType: number = 0;
  receivedData: any;
  idDict: any;
  message: any = "";

  vehicleBrands: any[] = [];
  vehicleTypes: any[] = [];

  ngOnInit(): void {
    this.initializeForm();
    this.loadInitialData();

    this.router.queryParams.subscribe(params => {
      const data = params['data'];

      if (data) {
        try {
          this.receivedData = JSON.parse(decodeURIComponent(data));
          console.log(this.receivedData);

          this.vehicleId = this.receivedData['vehicleId'];
          this.loginUserID = this.receivedData['loginUserID']
          this.loginUserType = this.receivedData['loginUserType']


        } catch (error) {
          console.error('Failed to parse data:', error);
        }
      }
    });
    if(this.loginUserType != 1){
      this.route.navigate([''])
    }
  }

  loadInitialData() {
    this.vehicleService.getBrands().subscribe(data => {
      this.vehicleBrands = data;
      // console.log(this.vehicleBrands)
    });

    this.vehicleService.getTypes().subscribe(data => {
      this.vehicleTypes = data;
      // console.log(this.vehicleTypes)
    });
  }

  initializeForm() {
    this.vehicleForm = this.fb.group({
      vehicleName: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      vehicleType: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      rentPerDay: ['', [Validators.required, Validators.min(1)]],
    });
  }

  // Submit handler
  onSubmit() {
    this.message = "";
    if (this.vehicleForm.valid) {
      this.vehicleService.addVehicle(this.vehicleForm.value).subscribe((response) => {
        this.message = response;
        this.vehicleForm.reset();
      })


      // this.idDict = { 'loginUserID': this.loginUserID, 'loginUserType': this.loginUserType };
      // const encodedData = encodeURIComponent(JSON.stringify(this.idDict));
      // this.route.navigate(['adminPanel'], { queryParams: { data: encodedData } });

    } else {
      console.log('Form is invalid');
      this.vehicleForm.markAllAsTouched();
    }
  }


  viewList() {
    this.idDict = { 'loginUserID': this.loginUserID, 'vehicleId': this.vehicleId, 'loginUserType': this.loginUserType };
    const encodedData = encodeURIComponent(JSON.stringify(this.idDict));
    this.route.navigate(['adminPanel'], { queryParams: { data: encodedData } });
  }
}
