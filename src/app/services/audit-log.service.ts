import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '../config/constants';

@Injectable({
  providedIn: 'root',
})
export class AuditLogService {
  constructor(private http: HttpClient, private constants: Constants) {}

  buttonClicked(button: string, userId: string) {
    const description = `${button} clicked.`;
    const baseUrl =
      this.constants.baseUrl +
      '/ticket/auditlogs?description=' +
      description +
      '&gateid=' +
      this.constants.gateId +
      '&userid=' +
      userId;
      console.log('clicked here');
    return this.http.get<any>(baseUrl);
  }
  issueTicket(ticketNo: string, userId: string) {
    const description = `Issued ticket : ${ticketNo}.`;
    const baseUrl =
      this.constants.baseUrl +
      '/ticket/auditlogs?description=' +
      description +
      '&gateid=' +
      this.constants.gateId +
      '&userid=' +
      userId;
    return this.http.get<any>(baseUrl);
  }
  issueOfficialReceipt(officialReceipt: string, userId: string) {
    const description = `Issued official receipt : ${officialReceipt}.`;
    const baseUrl =
      this.constants.baseUrl +
      '/ticket/auditlogs?description=' +
      description +
      '&gateid=' +
      this.constants.gateId +
      '&userid=' +
      userId;
    return this.http.get<any>(baseUrl);
  }
  reprintTicket(ticketNo: string, userId: string) {
    const description = `Reprinted ticket : ${ticketNo}.`;
    const baseUrl =
      this.constants.baseUrl +
      '/ticket/auditlogs?description=' +
      description +
      '&gateid=' +
      this.constants.gateId +
      '&userid=' +
      userId;
    return this.http.get<any>(baseUrl);
  }
  reprintOfficialReceipt(officialReceipt: string, userId: string) {
    const description = `Reprinted official receipt : ${officialReceipt}.`;
    const baseUrl =
      this.constants.baseUrl +
      '/ticket/auditlogs?description=' +
      description +
      '&gateid=' +
      this.constants.gateId +
      '&userid=' +
      userId;
    return this.http.get<any>(baseUrl);
  }
  printedReadings(type: string, referenceNo: string, userId: string) {
    const description = `Printed ${type} readings : ${referenceNo}.`;
    const baseUrl =
      this.constants.baseUrl +
      '/ticket/auditlogs?description=' +
      description +
      '&gateid=' +
      this.constants.gateId +
      '&userid=' +
      userId;
    return this.http.get<any>(baseUrl);
  }
  rePrintedReadings(type: string, referenceNo: string, userId: string) {
    const description = `Reprinted ${type} readings : ${referenceNo}.`;
    const baseUrl =
      this.constants.baseUrl +
      '/ticket/auditlogs?description=' +
      description +
      '&gateid=' +
      this.constants.gateId +
      '&userid=' +
      userId;
    return this.http.get<any>(baseUrl);
  }
  userLogin(username: string, userId: string) {
    const description = `Log in success as : ${username}.`;
    const baseUrl =
      this.constants.baseUrl +
      '/ticket/auditlogs?description=' +
      description +
      '&gateid=' +
      this.constants.gateId +
      '&userid=' +
      userId;
    return this.http.get<any>(baseUrl);
  }
  userLoginError(username: string) {
    const description = `Log in failed for : ${username}.`;
    const baseUrl =
      this.constants.baseUrl +
      '/ticket/auditlogs?description=' +
      description +
      '&gateid=' +
      this.constants.gateId +
      '&userid=' +
      0;
    return this.http.get<any>(baseUrl);
  }
  userLogOut(userId: string) {
    const description = `Logged out.`;
    const baseUrl =
      this.constants.baseUrl +
      '/ticket/auditlogs?description=' +
      description +
      '&gateid=' +
      this.constants.gateId +
      '&userid=' +
      userId;
    return this.http.get<any>(baseUrl);
  }
  changeFund(amount: number, userId: string) {
    const description = `Printed change fund : ${amount}.`;
    const baseUrl =
      this.constants.baseUrl +
      '/ticket/auditlogs?description=' +
      description +
      '&gateid=' +
      this.constants.gateId +
      '&userid=' +
      userId;
    return this.http.get<any>(baseUrl);
  }
  confirmedTenderDeclaration(amount: number, userId: string) {
    const description = `Confirmed tender declaration : ${amount}.`;
    const baseUrl =
      this.constants.baseUrl +
      '/ticket/auditlogs?description=' +
      description +
      '&gateid=' +
      this.constants.gateId +
      '&userid=' +
      userId;
    return this.http.get<any>(baseUrl);
  }
  printedTenderDeclaration(amount: number, userId: string) {
    const description = `Printed tender declaration : ${amount}.`;
    const baseUrl =
      this.constants.baseUrl +
      '/ticket/auditlogs?description=' +
      description +
      '&gateid=' +
      this.constants.gateId +
      '&userid=' +
      userId;
    return this.http.get<any>(baseUrl);
  }
  searchReading(title: string, userId: string) {
    const description = `Search for ${title} Button Clicked.`;
    const baseUrl =
      this.constants.baseUrl +
      '/ticket/auditlogs?description=' +
      description +
      '&gateid=' +
      this.constants.gateId +
      '&userid=' +
      userId;
    return this.http.get<any>(baseUrl);
  }
  reprintReadings(title: string, userId: string) {
    const description = `Reprint for ${title} Button Clicked.`;
    const baseUrl =
      this.constants.baseUrl +
      '/ticket/auditlogs?description=' +
      description +
      '&gateid=' +
      this.constants.gateId +
      '&userid=' +
      userId;
    return this.http.get<any>(baseUrl);
  }
}
