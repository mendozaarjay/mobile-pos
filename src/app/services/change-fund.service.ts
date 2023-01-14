import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '../config/constants';

@Injectable({
  providedIn: 'root',
})
export class ChangeFundService {
  constructor(private httpClient: HttpClient, private constants: Constants) {}
  confirmChangeFund(fund: any) {
    const url =
      this.constants.baseUrl +
      '/ticket/setchangefund?id=' +
      this.constants.cashierShiftId +
      '&fund=' +
      fund;
    return this.httpClient.get<any>(url);
  }
  getChangeFund() {
    const url =
      this.constants.baseUrl +
      '/ticket/getchangefundprint?gateid=' +
      this.constants.gateId +
      '&id=' +
      this.constants.cashierShiftId;
    return this.httpClient.get<any>(url);
  }
}
