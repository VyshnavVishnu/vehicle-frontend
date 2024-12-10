import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { EditVehicleComponent } from './edit-vehicle/edit-vehicle.component';
import { VehicleFormComponent } from './vehicle-form/vehicle-form.component';
import { UserFormComponent } from './user-form/user-form.component';
import { UserPanelComponent } from './user-panel/user-panel.component';
import { RequestVehicleComponent } from './request-vehicle/request-vehicle.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { RentalRequestsComponent } from './rental-requests/rental-requests.component';
import { ViewRentalRequestComponent } from './view-rental-request/view-rental-request.component';
import { UserRentalsComponent } from './user-rentals/user-rentals.component';

const routes: Routes = [
  //registration
  {path:'userForm',component:UserFormComponent},

  //login
  {path:'',component:UserLoginComponent},

  //admin pages type = 1
  {path:'adminPanel',component:AdminPanelComponent},
  {path:'editVehicle',component:EditVehicleComponent},
  {path:'vehicleForm',component:VehicleFormComponent},
  {path:'rentalRequests',component:RentalRequestsComponent},
  {path:'viewRequest',component:ViewRentalRequestComponent},

  //user pages type = 2
  {path:'userPanel',component:UserPanelComponent},
  {path:'viewVehicle',component:RequestVehicleComponent},
  {path:'userRentals',component:UserRentalsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
