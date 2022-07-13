import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class Constants {
  public readonly apiEndPoint: string = 'http://192.168.1.20/api';
  public readonly apiTestEndPoint: string = 'mock-domain/api';
  public userId: string;
  public readonly bluetoothAddress: string = '00:13:7B:3A:9C:BA';
  public readonly gateId: string = '13';
  public cashierShiftId: string;
  public defaultParkerType: string;
  public defaultTransactionType: string = '0';
}
