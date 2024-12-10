import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserFormComponent } from './user-form/user-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { VehicleFormComponent } from './vehicle-form/vehicle-form.component';
import { EditVehicleComponent } from './edit-vehicle/edit-vehicle.component';
import { UserPanelComponent } from './user-panel/user-panel.component';
import { RequestVehicleComponent } from './request-vehicle/request-vehicle.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { RentalRequestsComponent } from './rental-requests/rental-requests.component';
import { ViewRentalRequestComponent } from './view-rental-request/view-rental-request.component';
import { UserRentalsComponent } from './user-rentals/user-rentals.component';

@NgModule({
  declarations: [
    AppComponent,
    UserFormComponent,
    AdminPanelComponent,
    VehicleFormComponent,
    EditVehicleComponent,
    UserPanelComponent,
    RequestVehicleComponent,
    UserLoginComponent,
    RentalRequestsComponent,
    ViewRentalRequestComponent,
    UserRentalsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
