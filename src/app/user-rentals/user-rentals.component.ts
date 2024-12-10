import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../services/vehicle.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-rentals',
  templateUrl: './user-rentals.component.html',
  styleUrl: './user-rentals.component.css'
})
export class UserRentalsComponent implements OnInit {

  constructor(
    private vehicleService: VehicleService,
    private route: Router,
    private router: ActivatedRoute,
  ) { }

  allRentals: any[] = [];
  activeRental: any[] = [];
  inactiveRentals: any[] = [];

  loginUserId: number = 0;
  loginUserType: number = 0;
  idDict: object = {};
  receivedData: any;

  ngOnInit(): void {
    this.router.queryParams.subscribe(params => {
      const data = params['data'];

      if (data) {
        try {
          this.receivedData = JSON.parse(decodeURIComponent(data));
          console.log(this.receivedData);

          this.loginUserId = this.receivedData['loginUserID'];
          this.loginUserType = this.receivedData['loginUserType'];

        } catch (error) {
          console.error('Failed to parse data:', error);
        }
      }
    });
    this.getRentalDetails();
    if(this.loginUserType != 2){
      this.route.navigate([''])
    }
  }

  getRentalDetails() {
    this.vehicleService.getRentalsByUser(this.loginUserId).subscribe((response) => {
      this.allRentals = response;
      console.log(this.allRentals)
    })
  }

  get hasPastRentals(): boolean {
    return this.allRentals.some(rental => !rental.status);
  }

  get hasCurrentRentals(): boolean {
    return this.allRentals.some(rental => rental.status);
  }

  backToPanel() {
    this.idDict = { 'loginUserID': this.loginUserId, 'loginUserType': this.loginUserType };
    const encodedData = encodeURIComponent(JSON.stringify(this.idDict));
    this.route.navigate(['userPanel'], { queryParams: { data: encodedData } });
  }
}
