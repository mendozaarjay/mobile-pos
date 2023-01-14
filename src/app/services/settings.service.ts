import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from '../config/constants';
import { GateInformation } from '../models/GateInformation';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private constants: Constants, private http: HttpClient) {}
  getGateInfo(): Observable<GateInformation> {
    const baseUrl =
      this.constants.baseUrl +
      '/ticket/gateinformation?gateid=' +
      this.constants.gateId;
    return this.http.get<GateInformation>(baseUrl);
  }
  resetHandled() {
    const baseUrl =
      this.constants.baseUrl +
      '/ticket/resetcounter?gateid=' +
      this.constants.gateId;
    return this.http.get<any>(baseUrl);
  }
}
