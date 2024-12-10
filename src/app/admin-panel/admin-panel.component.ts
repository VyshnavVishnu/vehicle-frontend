import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../services/vehicle.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent implements OnInit {

  filterForm!: FormGroup;

  filteredVehicles: any[] = [];
  vehicleTypes: any[] = [];
  brands: any[] = [];
  availableVehicles: any[] = [];
  userToDelete: number | null = null;
  isModalOpen: boolean = false;

  vehicleId: number = 0;
  loginUserID: number = 0;
  loginUserType: number = 0;
  receivedData: any;
  idDict: any;

  constructor(
    private vehicleService: VehicleService,
    private route: Router,
    private router: ActivatedRoute,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
  
    this.initForm();
    setTimeout(() => {
      this.fetchVehicles();
    }, 300)

    this.router.queryParams.subscribe(params => {
      const data = params['data'];
      if (data) {
        try {
          this.receivedData = JSON.parse(decodeURIComponent(data));
          console.log(this.receivedData);

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

  initForm() {
    this.filterForm = this.fb.group({
      vehicleType: [''],
      brand: ['']
    });
  }

  fetchVehicles() {
    this.vehicleService.getTypes().subscribe(data => {
      this.vehicleTypes = data;
    });

    this.vehicleService.getBrands().subscribe(data => {
      this.brands = data;
    });

    this.vehicleService.getAllVehicles().subscribe(data => {
      this.availableVehicles = data;
      console.log(this.availableVehicles)
    })
  }

  applyFilters() {
    const type = +this.filterForm.get('vehicleType')?.value;
    const brand = +this.filterForm.get('brand')?.value;

    // console.log()
    this.filteredVehicles = [];

    if (type && brand) {
      this.filteredVehicles = this.availableVehicles.filter(vehicle =>
        vehicle.vehicleTypeId === +type && vehicle.brandId === +brand
      );
    }
    else if (!type && brand) {
      this.filteredVehicles = this.availableVehicles.filter(vehicle =>
        vehicle.brandId === +brand
      );
    }
    else if (type && !brand) {
      this.filteredVehicles = this.availableVehicles.filter(vehicle =>
        vehicle.vehicleTypeId === +type
      );
    }
    else if (!type && !brand) {
      this.filteredVehicles = [];
    }

    console.log(this.filteredVehicles);
  }

  addVehicle() {
    this.idDict = { 'loginUserID': this.loginUserID, 'loginUserType': this.loginUserType };
    const encodedData = encodeURIComponent(JSON.stringify(this.idDict));
    this.route.navigate(['vehicleForm'], { queryParams: { data: encodedData } });
  }

  editVehicle(id: number) {
    this.vehicleId = id;
    this.idDict = { 'loginUserID': this.loginUserID, 'vehicleId': this.vehicleId, 'loginUserType': this.loginUserType };
    const encodedData = encodeURIComponent(JSON.stringify(this.idDict));
    this.route.navigate(['editVehicle'], { queryParams: { data: encodedData } });
  }

  viewRequests() {
    this.idDict = { 'loginUserID': this.loginUserID, 'loginUserType': this.loginUserType };
    const encodedData = encodeURIComponent(JSON.stringify(this.idDict));
    this.route.navigate(['rentalRequests'], { queryParams: { data: encodedData } });
  }

  openModal(id: number) {
    this.userToDelete = id;
    this.isModalOpen = true;
    document.getElementById('deleteModal')!.style.display = 'flex';
  }

  onConfirm() {
    if (this.userToDelete) {
      this.deleteVehicle(this.userToDelete);
      this.closeModal();
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.userToDelete = null;
    document.getElementById('deleteModal')!.style.display = 'none'; document.getElementById('deleteModal')!.style.display = 'none';
  }

  deleteVehicle(id: number) {
    console.log(id);
    this.vehicleService.deleteVehicle(id).subscribe();
    setTimeout(()=>{
      this.fetchVehicles();
    },300)
    
  }

  logout() {
    this.route.navigate([''])
  }
}
