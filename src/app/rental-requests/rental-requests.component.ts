import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from '../services/vehicle.service';

@Component({
  selector: 'app-rental-requests',
  templateUrl: './rental-requests.component.html',
  styleUrl: './rental-requests.component.css'
})
export class RentalRequestsComponent implements OnInit {

  vehicleId: number = 0;
  loginUserID: number = 0;
  loginUserType: number = 0;
  requestId: number = 0;
  receivedData: any;
  idDict: any;

  allRequests: any[] = [];

  constructor(
    private router: ActivatedRoute,
    private route: Router,
    private vehicleService: VehicleService,
  ) { }

  ngOnInit(): void {
    setTimeout(()=>{
      this.loadInitialData();
    },300);
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
    this.vehicleService.getAllRequests().subscribe((data) => {
      this.allRequests = data;
      console.log(this.allRequests)
    })
  }

  viewRequest(id:number) {
    this.requestId = id;
    this.idDict = { 'loginUserID': this.loginUserID, 'vehicleId': this.vehicleId, 'requestId': this.requestId, 'loginUserType': this.loginUserType };
    const encodedData = encodeURIComponent(JSON.stringify(this.idDict));
    this.route.navigate(['viewRequest'], { queryParams: { data: encodedData } });
  }

  backToAdminPanel() {
    this.idDict = { 'loginUserID': this.loginUserID, 'vehicleId': this.vehicleId, 'loginUserType': this.loginUserType };
    const encodedData = encodeURIComponent(JSON.stringify(this.idDict));
    this.route.navigate(['adminPanel'], { queryParams: { data: encodedData } });
  } 

  logout(){
    this.route.navigate([''])
  }
}
