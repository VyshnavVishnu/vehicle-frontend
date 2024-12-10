import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { VehicleService } from '../services/vehicle.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrl: './user-panel.component.css'
})
export class UserPanelComponent implements OnInit {
  filterForm!: FormGroup;

  constructor(
    private vehicleService: VehicleService,
    private fb: FormBuilder,
    private route: Router,
    private router: ActivatedRoute,
  ) { }
  
  vehicleTypes: any[] = [];
  brands: any[] = [];
  allVehicles: any[] = [];
  filteredVehicles: any[] = [];
  loginUserId: number = 0;
  loginUserType:number = 0;
  idDict: object = {};
  receivedData:any;

  ngOnInit(): void {
    this.initForm();
    this.loadVehicles();

    this.router.queryParams.subscribe(params => {
      const data = params['data'];

      if (data) {
        try {
          this.receivedData = JSON.parse(decodeURIComponent(data));
          console.log(this.receivedData); 
          
          this.loginUserId = this.receivedData['loginUserID'];
          this.loginUserType = this.receivedData['loginUserType']

        } catch (error) {
          console.error('Failed to parse data:', error);
        }
      }
    });
    if(this.loginUserType != 2){
      this.route.navigate([''])
    }
  }

  initForm() {
    this.filterForm = this.fb.group({
      vehicleType: [null],
      brand: [null]
    });
  }

  loadVehicles() {
    this.vehicleService.getTypes().subscribe(data => {
      this.vehicleTypes = data;
    });

    this.vehicleService.getBrands().subscribe(data => {
      this.brands = data;
    });

    this.vehicleService.getAllVehiclesForUser().subscribe(data => {
      this.allVehicles = data;
      // console.log(this.allVehicles)
    });
  }

  checkFilter() {
    const type = this.filterForm.get('vehicleType')?.value;
    const brand = this.filterForm.get('brand')?.value;

    this.filteredVehicles = [];

    if (type && brand) {
      this.filteredVehicles = this.allVehicles.filter(vehicle =>
        vehicle.vehicleType === +type && vehicle.brand === +brand
      );
    }
    else if (!type && brand) {
      this.filteredVehicles = this.allVehicles.filter(vehicle =>
        vehicle.brand === +brand
      );
    }
    else if (type && !brand) {
      this.filteredVehicles = this.allVehicles.filter(vehicle =>
        vehicle.vehicleType === +type
      );
    }
    else if (!type && !brand) {
      this.filteredVehicles = [];
    }

    console.log(this.filteredVehicles);
  }


  viewVehicleDetails(id: number) {
    this.idDict = { 'loginUserID': this.loginUserId, 'vehicleId': id, 'loginUserType':this.loginUserType };
    const encodedData = encodeURIComponent(JSON.stringify(this.idDict));
    this.route.navigate(['viewVehicle'], { queryParams: { data: encodedData } });
  }

  userRentals(){
    this.idDict = { 'loginUserID': this.loginUserId, 'loginUserType':this.loginUserType };
    const encodedData = encodeURIComponent(JSON.stringify(this.idDict));
    this.route.navigate(['userRentals'], { queryParams: { data: encodedData } });
  }
  logout(){
    this.route.navigate(['']);
  }
}
