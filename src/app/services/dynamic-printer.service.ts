import { Injectable } from '@angular/core';
import {
  PrinterToUse,
  ThermalPrinterPlugin,
} from 'thermal-printer-cordova-plugin/src';
import { Constants } from '../config/constants';
// eslint-disable-next-line @typescript-eslint/naming-convention, no-var
declare let ThermalPrinter: ThermalPrinterPlugin;
@Injectable({
  providedIn: 'root',
})
export class DynamicPrinterService {
  constructor(private constants: Constants) {}
  print(data: string) {
    ThermalPrinter.printFormattedText(
      {
        type: 'bluetooth',
        id: this.constants.bluetoothAddress,
        text: data,
        mmFeedPaper : 30,
        dotsFeedPaper: 10
      },
      () => {
        console.log('Successfully printed!');
      },
      (error) => {
        console.error('Printing error', error);
      }
    );
  }
}
