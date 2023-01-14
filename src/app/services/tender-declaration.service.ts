import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '../config/constants';
import { TenderDeclarationItem } from '../models/TenderDeclarationItem';

@Injectable({
  providedIn: 'root',
})
export class TenderDeclarationService {
  constructor(private httpClient: HttpClient, private constants: Constants) {}
  confirmTender(item: TenderDeclarationItem) {
    const url =
      this.constants.baseUrl +
      '/ticket/settenderdeclaration?id=' +
      this.constants.cashierShiftId +
      '&v1000=' +
      item.php1000 +
      '&v500=' +
      item.php500 +
      '&v200=' +
      item.php200 +
      '&v100=' +
      item.php100 +
      '&v50=' +
      item.php50 +
      '&v20=' +
      item.php20 +
      '&v10=' +
      item.php10 +
      '&v5=' +
      item.php5 +
      '&v1=' +
      item.php1 +
      '&vcent=' +
      item.cent1 +
      '&comment=' +
      item.comment;
    return this.httpClient.get<any>(url);
  }
  getTenderPrintable() {
    const url =
      this.constants.baseUrl +
      '/ticket/gettenderdeclaration?gateid=' +
      this.constants.gateId +
      '&id=' +
      this.constants.cashierShiftId;
    return this.httpClient.get<any>(url);
  }
}
