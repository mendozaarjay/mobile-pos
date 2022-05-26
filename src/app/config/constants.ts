import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class Constants {
  public readonly apiEndPoint: string = 'https://localhost:44332/api';
  public readonly apiTestEndPoint: string = 'mock-domain/api';
  public userId: string;
  public readonly bluetoothAddress: string = '00:11:AB:3A:9C:BA';
  public readonly gateId: string = '13';
}
