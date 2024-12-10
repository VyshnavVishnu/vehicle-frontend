import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehicleService } from '../services/vehicle.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-vehicle',
  templateUrl: './edit-vehicle.component.html',
  styleUrl: './edit-vehicle.component.css'
})
export class EditVehicleComponent {

  vehicleId: number = 0;
  loginUserID: number = 0;
  loginUserType: number = 0;
  receivedData: any;
  idDict: any;

  vehicleForm!: FormGroup;
  vehicleTypes: any[] = [];
  brands: any[] = [];
  updateId: number = 0;

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadInitialData();
    this.route.queryParams.subscribe(params => {
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
    if(this.loginUserType != 1){
      this.router.navigate([''])
    }
  }

  loadInitialData() {
    this.vehicleService.getBrands().subscribe(data => {
      this.brands = data;
    })

    this.vehicleService.getTypes().subscribe(data => {
      this.vehicleTypes = data;
    })
    
  }

  initializeForm() {
    this.vehicleForm = this.fb.group({
      vehicleName: ['', Validators.required],
      description: ['', Validators.required],
      vehicleType: ['', Validators.required],
      brand: ['', Validators.required],
      rent: ['', [Validators.required, Validators.min(1)]],
      availability: ['', Validators.required]
    });
  }

  loadVehicleDetails(id: number) {
    this.vehicleService.getVehicleById(id).subscribe({
      next: (vehicle) => {

        console.log(vehicle)
        this.updateId = vehicle.id
        // Find matching objects for vehicleType and brand
        const matchingVehicleType = this.vehicleTypes.find(
          type => type.id === vehicle.vehicleType
        );

        const matchingBrand = this.brands.find(
          brand => brand.id === vehicle.brand
        );

        this.vehicleForm.patchValue({
          vehicleName: vehicle.vehicleName,
          description: vehicle.description,
          vehicleType: matchingVehicleType, // Patch with full object
          brand: matchingBrand,             // Patch with full object
          rent: vehicle.rent,
          availability: vehicle.availability ? 'True' : 'False'
        });
      },
      error: (err) => console.error('Error fetching vehicle details:', err)
    });
  }


  onSubmit(): void {
    if (this.vehicleForm.valid) {
      console.log('Form Submitted', this.vehicleForm.value);
      this.vehicleService.updateVehicle(this.updateId, this.vehicleForm.value).subscribe();
      this.vehicleForm.reset();

      this.idDict = { 'loginUserID': this.loginUserID, 'vehicleId': this.vehicleId, 'loginUserType': this.loginUserType };
      const encodedData = encodeURIComponent(JSON.stringify(this.idDict));
      this.router.navigate(['adminPanel'], { queryParams: { data: encodedData } });
      // Process the form data as needed
    } else {
      console.log('Form is invalid');
      this.vehicleForm.markAllAsTouched();
    }
  }

  backToAdminPanel() {
    this.idDict = { 'loginUserID': this.loginUserID, 'vehicleId': this.vehicleId, 'loginUserType': this.loginUserType };
    const encodedData = encodeURIComponent(JSON.stringify(this.idDict));
    this.router.navigate(['adminPanel'], { queryParams: { data: encodedData } });
  }
}
