import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class VehicleService {
    private baseUrl = 'http://127.0.0.1:8000';

    constructor(private http: HttpClient) { }

    //Initial Data for user form
    getStates(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/state/`);
    }

    getCities(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/city/`);
    }

    //Users
    createUser(user: any) {
        console.log(user)
        return this.http.post(`${this.baseUrl}/users/`, user);
    }

    updateUser(id: number, user: any): Observable<any> {
        return this.http.put(`${this.baseUrl}/users/${id}/`, user);
    }

    getUserById(id: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/users/${id}/`);
    }

    getAllUsers(): Observable<any> {
        return this.http.get<{ users: any[] }>(`${this.baseUrl}/users/`);
    }


    deleteUser(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/users/${id}/`);
    }


    //Initial Data for Vehicles
    getBrands(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/brands/`);
    }

    getTypes(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/types/`);
    }

    //Vehicles
    addVehicle(vehicle: any) {
        return this.http.post(`${this.baseUrl}/vehicle/`, vehicle, {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    getAllVehicles(): Observable<any> {
        return this.http.get<{ users: any[] }>(`${this.baseUrl}/vehicle/`);
    }

    getVehicleById(id: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/vehicle/${id}/`);
    }

    updateVehicle(id: number, vehicle: any): Observable<any> {
        return this.http.put(`${this.baseUrl}/vehicle/${id}/`, vehicle);
    }

    deleteVehicle(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/vehicle/${id}/`);
    }

    //User Panel Initial Data

    getAllVehiclesForUser(): Observable<any> {
        return this.http.get<{ users: any[] }>(`${this.baseUrl}/vehicleForUser/`);
    }

    getVehicleByIdForUser(id: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/vehicleForUser/${id}/`);
    }

    //User Login

    userLogin(login: any){
        return this.http.post(`${this.baseUrl}/userLogin/`, login)
    }

    //Rental Requests

    sendRequest(request:any){
        return this.http.post(`${this.baseUrl}/rentalRequest/`, request)
    }

    getAllRequests(): Observable<any> {
        return this.http.get<{ users: any[] }>(`${this.baseUrl}/rentalRequest/`);
    }

    getRequestById(id: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/requestDetails/${id}/`);
    }

    deleteRequest(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/requestDetails/${id}/`);
    }

    approveRequest(data: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/rentals/`,data);
    }

    getRentalsByUser(id: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/rentalDetails/${id}/`);
    }
}   

