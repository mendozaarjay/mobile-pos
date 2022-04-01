import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class Constants {
  public readonly apiEndPoint: string = 'http://192.168.1.25:1331/api';
  public readonly apiTestEndPoint: string = 'mock-domain/api';
  public userId: string;
}
