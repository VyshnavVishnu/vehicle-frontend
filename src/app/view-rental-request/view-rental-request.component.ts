import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from '../services/vehicle.service';

@Component({
  selector: 'app-view-rental-request',
  templateUrl: './view-rental-request.component.html',
  styleUrl: './view-rental-request.component.css'
})
export class ViewRentalRequestComponent implements OnInit {

  vehicleId: number = 0;
  requestId: number = 0;
  loginUserID: number = 0;
  loginUserType: number = 0;
  receivedData: any;
  idDict: any;

  currentRequest: any;
  isModalOpen = false;

  constructor(
    private router: ActivatedRoute,
    private vehicleService: VehicleService,
    private route: Router,
  ) { }

  ngOnInit(): void {
    this.router.queryParams.subscribe(params => {
      const data = params['data'];

      if (data) {
        try {
          this.receivedData = JSON.parse(decodeURIComponent(data));
          console.log(this.receivedData);

          this.vehicleId = this.receivedData['vehicleId'];
          this.loginUserID = this.receivedData['loginUserID']
          this.loginUserType = this.receivedData['loginUserType']
          this.requestId = this.receivedData['requestId']

        } catch (error) {
          console.error('Failed to parse data:', error);
        }
      }
    });
    if(this.loginUserType != 1){
      this.route.navigate([''])
    }
    this.loadInitialData();
  }

  loadInitialData() {
    this.vehicleService.getRequestById(this.requestId).subscribe((data) => {
      this.currentRequest = data;
      console.log(this.currentRequest)
    })
  }

  approveRequest() {
    this.currentRequest.userId = this.loginUserID;
    this.vehicleService.approveRequest(this.currentRequest).subscribe((response)=>{
      console.log(response)
    })

    this.requestId = 0;
    this.idDict = { 'loginUserID': this.loginUserID, 'vehicleId': this.vehicleId, 'requestId': this.requestId, 'loginUserType': this.loginUserType };
    const encodedData = encodeURIComponent(JSON.stringify(this.idDict));
    this.route.navigate(['rentalRequests'], { queryParams: { data: encodedData } });
  }

  openModal() {
    this.isModalOpen = true;
    document.getElementById('deleteModal')!.style.display = 'flex';
  }

  onConfirm() {
    this.deleteRequest();
    this.closeModal();
  }

  closeModal() {
    this.isModalOpen = false;
    document.getElementById('deleteModal')!.style.display = 'none'; document.getElementById('deleteModal')!.style.display = 'none';
  }

  deleteRequest() {
    this.vehicleService.deleteRequest(this.requestId).subscribe((data) => {
      console.log(data)
    })

    this.requestId = 0;
    this.idDict = { 'loginUserID': this.loginUserID, 'vehicleId': this.vehicleId, 'requestId': this.requestId, 'loginUserType': this.loginUserType };
    const encodedData = encodeURIComponent(JSON.stringify(this.idDict));
    this.route.navigate(['rentalRequests'], { queryParams: { data: encodedData } });
  }

  back(){
    this.requestId = 0;
    this.idDict = { 'loginUserID': this.loginUserID, 'vehicleId': this.vehicleId, 'requestId': this.requestId, 'loginUserType': this.loginUserType };
    const encodedData = encodeURIComponent(JSON.stringify(this.idDict));
    this.route.navigate(['rentalRequests'], { queryParams: { data: encodedData } }); 
  }

}
