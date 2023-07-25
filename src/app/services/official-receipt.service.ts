import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '../config/constants';
import { OfficialReceiptItem } from '../models/OfficialReceiptItem';

@Injectable({
  providedIn: 'root',
})
export class OfficialReceiptService {
  constructor(private httpClient: HttpClient, private constants: Constants) {}
  getParkerTypes() {
    const url = this.constants.baseUrl + '/ticket/parkertypes';
    return this.httpClient.get<any>(url);
  }
  getDiscounts() {
    const url = this.constants.baseUrl + '/ticket/getdiscounttypes';
    return this.httpClient.get<any>(url);
  }
  getTransactionTypes() {
    const url = this.constants.baseUrl + '/ticket/gettransactiontypes';
    return this.httpClient.get<any>(url);
  }
  getRate(id: any, parkerType: any) {
    const url =
      this.constants.baseUrl +
      '/ticket/calculaterate?transitid=' +
      id +
      '&parkertypeid=' +
      parkerType;
    return this.httpClient.get<any>(url);
  }
  setOfficialReceipt(item: OfficialReceiptItem, userId: string) {
    const url = this.constants.baseUrl + '/ticket/officialreceipt';
    return this.httpClient.post<any>(url, item);
  }
  verifyTicket(ticketNo: any, plateNo: any) {
    const url =
      this.constants.baseUrl +
      '/ticket/verifyticket?ticket=' +
      ticketNo +
      '&gate=0' +
      '&plateno=' +
      plateNo;
    return this.httpClient.get<any>(url);
  }
  loadOfficialReceipts(keyword: any) {
    const url =
      this.constants.baseUrl +
      '/ticket/searchor?gateid=' +
      this.constants.gateId +
      '&keyword=' +
      keyword;
    return this.httpClient.get<any>(url);
  }
  reprintOfficialReceipt(id: any) {
    const url =
      this.constants.baseUrl + '/ticket/reprintofficialreceipt?transitid=' + id;
    return this.httpClient.get<any>(url);
  }
  checkIfVatable(rateid: any) {
    const url =
      this.constants.baseUrl + '/ticket/checkifvatable?rateid=' + rateid;
    return this.httpClient.get<any>(url);
  }
}
