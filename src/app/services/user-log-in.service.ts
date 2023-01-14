import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '../config/constants';
@Injectable({
  providedIn: 'root',
})
export class UserLogInService {
  constructor(private http: HttpClient, private constants: Constants) {}
  checkUser(username: string, password: string) {
    const url =
      this.constants.baseUrl +
      '/ticket/isvaliduser?username=' +
      username +
      '&password=' +
      password +
      '&gateid=' +
      this.constants.gateId;

    return this.http.get<any>(url);
  }
  checkChangeFund(userid: any) {
    const url =
      this.constants.baseUrl +
      '/ticket/checkchangefund?userid=' +
      userid +
      '&gateid=' +
      this.constants.gateId;
    return this.http.get<any>(url);
  }
  setParkingTypes() {
    const url = this.constants.baseUrl + '/ticket/parkertypes';
    this.http.get<any>(url).subscribe((res) => {
      res.forEach((element) => {
        if (element.isDefault === true) {
          this.constants.defaultParkerType = element.Id;
        }
      });
    });
  }
  logOut() {
    const url =
      this.constants.baseUrl +
      '/ticket/signout?userid=' +
      this.constants.userId +
      '&gateid=' +
      this.constants.gateId;
    return this.http.get<any>(url);
  }
}
