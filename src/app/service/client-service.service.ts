import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InvoiceResponse } from './InvoiceResponseModel';
import { InvoiceRequest } from './InvoiceRequestModel';

@Injectable({
  providedIn: 'root'
})
export class ClientServiceService {
  private apiUrl = 'http://localhost:3000/user'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  // Method to fetch string response from API
  getStringResponse(request:InvoiceRequest):Observable<InvoiceResponse> {
    let responseHtml;
    return this.http.post<InvoiceResponse>(this.apiUrl,request);
  }
}
