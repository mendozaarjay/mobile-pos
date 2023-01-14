import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TicketItem } from '../models/TicketItem';
import { Constants } from '../config/constants';
@Injectable({
  providedIn: 'root',
})
export class ReprintserviceService {
  constructor(private http: HttpClient, private constants: Constants) {}

  getTickets(keyword): Observable<TicketItem[]> {
    const url =
      this.constants.baseUrl +
      '/ticket/ticketlist?gateid=' +
      this.constants.gateId +
      '&keyword=' +
      keyword;

    return this.http.get<TicketItem[]>(url);
  }
  getTicketDetails(ticket: string): Observable<any> {
    const url =
      this.constants.baseUrl + '/ticket/reprintticket?ticketNo=' + ticket;
    return this.http.get<any>(url);
  }
}
