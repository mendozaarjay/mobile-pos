import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '../config/constants';

@Injectable({
  providedIn: 'root',
})
export class TicketIssuanceService {
  constructor(private httpClient: HttpClient, private constants: Constants) {}
  getNextTicket() {
    const url =
      this.constants.baseUrl +
      '/ticket/GetNextTicket?gate=' +
      this.constants.gateId;
    return this.httpClient.get<any>(url);
  }
  setTicket(ticket: any, plateNo: any) {
    const url =
      this.constants.baseUrl +
      '/ticket/printticket?ticketNo=' +
      ticket +
      '&gateid=' +
      this.constants.gateId +
      '&plateNo=' +
      plateNo;
    return this.httpClient.get<any>(url);
  }
}
