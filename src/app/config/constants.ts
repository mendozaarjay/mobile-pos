import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class Constants {
  public readonly apiEndPoint: string = 'http://192.168.28.173:2336/api';
  public readonly apiTestEndPoint: string = 'mock-domain/api';
}
