import { Component, OnInit } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { PrintService } from '../services/print.service';
import EscPosEncoder from 'esc-pos-encoder-ionic';
import { commands } from '../services/printer-commands';
import {
  PrinterToUse,
  ThermalPrinterPlugin,
} from 'thermal-printer-cordova-plugin/src';
// eslint-disable-next-line @typescript-eslint/naming-convention, no-var
declare let ThermalPrinter: ThermalPrinterPlugin;
@Component({
  selector: 'app-ticketprinter',
  templateUrl: './ticketprinter.page.html',
  styleUrls: ['./ticketprinter.page.scss'],
})
export class TicketprinterPage implements OnInit {
  bluetoothList: any = [];
  selectedPrinter: any;
  constructor(
    private bluetoothSerial: BluetoothSerial,
    public print: PrintService
  ) {}

  ngOnInit() {
    this.listPrinter();
  }

  async printTicket() {
    console.log(this.selectedPrinter);
    const data =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

    const encoder = new EscPosEncoder();
    const result = encoder.initialize();
    result
      .codepage('cp936')
      .align('center')
      .raw(commands.TEXT_FORMAT.TXT_NORMAL)
      .line(data)
      .raw(commands.TEXT_FORMAT.TXT_NORMAL)
      .text(commands.HORIZONTAL_LINE.HR_58MM)
      .text(commands.HORIZONTAL_LINE.HR2_58MM)
      .newline()
      .raw(commands.TEXT_FORMAT.TXT_NORMAL)
      .newline()
      .newline();
    ThermalPrinter.printFormattedText(
      {
        type: 'bluetooth',
        id: this.selectedPrinter,
        text:
          '[L]\n' +
          "[C]<u><font size='big'>ORDER N°045</font></u>\n" +
          '[L]\n' +
          '[C]================================\n' +
          '[L]\n' +
          '[L]<b>BEAUTIFUL SHIRT</b>[R]9.99e\n' +
          '[L]  + Size : S\n' +
          '[L]\n' +
          '[L]<b>AWESOME HAT</b>[R]24.99e\n' +
          '[L]  + Size : 57/58\n' +
          '[L]\n' +
          '[C]--------------------------------\n' +
          '[R]TOTAL PRICE :[R]34.98e\n' +
          '[R]TAX :[R]4.23e\n' +
          '[L]\n' +
          '[C]================================\n' +
          '[L]\n' +
          "[L]<font size='tall'>Customer :</font>\n" +
          '[L]Raymond DUPONT\n' +
          '[L]5 rue des girafes\n' +
          '[L]31547 PERPETES\n' +
          '[L]Tel : +33801201456\n' +
          '[L]\n' +
          "[C]<barcode type='ean13' height='10'>831254784551</barcode>\n" +
          "[C]<qrcode size='20'>http://www.developpeur-web.dantsu.com/</qrcode>",
      },
      function () {
        console.log('Successfully printed!');
      },
      function (error) {
        console.error('Printing error', error);
      }
    );
  }
  listPrinter() {
    this.print.searchBluetoothPrinter().then((data) => {
      this.bluetoothList = data;
    });
  }
  selectPrinter(macAddress) {
    this.selectedPrinter = macAddress;
  }
}
