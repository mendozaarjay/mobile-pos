import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TestconnectionService {
  constructor(private http: HttpClient) {}

  testConnection(url: string) {
    const baseUrl = url + '/ticket/testconnection';
    return this.http.get<any>(baseUrl);
  }
}
