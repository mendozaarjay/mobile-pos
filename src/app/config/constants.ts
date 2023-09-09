/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class Constants {
  public readonly baseUrl: string = 'http://192.168.1.100:3360/api';
  public readonly apiTestEndPoint: string = 'mock-domain/api';
  public readonly bluetoothAddress: string = '00:13:7B:3A:9C:C6';
  public readonly gateId: string = '13';
  public defaultParkerType: string;
  public defaultTransactionType: string = '0';
  public isForTesting = true;
  public username: string;
  public version: string = '1.0';
  public gateName: string = 'PDT01';
}
