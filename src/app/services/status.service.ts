import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from '../config/constants';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  constructor(private http: HttpClient, private constants: Constants) {}
  checkApiStatus(): Observable<boolean> {
    const baseUrl = this.constants.baseUrl + '/ticket/status';
    return this.http.get<boolean>(baseUrl);
  }
}
