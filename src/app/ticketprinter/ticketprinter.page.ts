import { Component, OnInit } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';

@Component({
  selector: 'app-ticketprinter',
  templateUrl: './ticketprinter.page.html',
  styleUrls: ['./ticketprinter.page.scss'],
})
export class TicketprinterPage implements OnInit {
  constructor(private bluetoothSerial: BluetoothSerial) {}

  ngOnInit() {}

  async printTicket() {
    // console.log(this.bluetoothSerial.list());
    const printerData =
    ' TOTAL AMOUNT DUE                  P 125.00\n'	+
    ' AMOUNT TENDERED                   P 125.00\n'	+
    ' CHANGE                              P 0.00\n'	+
    '-------------------------------------------\n'	+
    ' VATable Sales    : 111.61                 \n'	+
    ' VAT Amount       : 13.39                  \n'	+
    ' VAT Exempt Sales : 0.00                   \n'	+
    ' Zero-rated Sales : 0.00                   \n'	+
    '-------------------------------------------\n'	+
    ' PARKER INFORMATION                        \n'	+
    '                                           \n'	+
    '   NAME : ______________________________   \n'	+
    '                                           \n'	+
    '   ADDRESS : ___________________________   \n'	+
    '                                           \n'	+
    '   TIN : _______________________________   \n'	+
    '                                           \n'	+
    '   SC/PWD ID : _________________________   \n'	+
    '                                           \n'	+
    '   SIGNATURE : _________________________   \n'	+
    '                                           \n'	+
    '  SMARCOM SECURITY SYSTEMS (PHILS.) CORP.  \n'	+
    '           Unit 3106 East tower            \n'	+
    '     Philippine Stock Exchange Centre      \n'	+
    '   Exchange rd Ortigas Center Pasig City   \n'	+
    '       VAT REG TIN: 009-006-597-000        \n'	+
    ' ACCREDITATION NO: 43A0090065972016080549  \n'	+
    '          DATE ISSUED: 08/22/2016          \n'	+
    '          VALID UNTIL: 08/22/2021          \n'	+
    '    PTU NO: FP092018-126-0182278-00059     \n'	+
    '          DATE ISSUED: 09/06/2018          \n'	+
    '                                           \n'	+
    '                THANK YOU !                \n'	+
    '      THIS RECEIPT SHALL BE VALID FOR      \n'	+
    '      FIVE(5) YEARS FROM THE DATE OF       \n'	+
    '             THE PERMIT TO USE             \n'	+
    '                                           \n'	+
    '-------------------------------------------\n'	+
    '                                           \n'	+
    '  SMARCOM SECURITY SYSTEMS (PHILS.) CORP.  \n'	+
    '           Unit 3106 East tower            \n'	+
    '     Philippine Stock Exchange Centre      \n'	+
    '   Exchange rd Ortigas Center Pasig City   \n'	+
    '       VAT REG TIN: 009-006-597-000        \n'	+
    ' ACCREDITATION NO: 43A0090065972016080549  \n'	+
    '          DATE ISSUED: 08/22/2016          \n'	+
    '          VALID UNTIL: 08/22/2021          \n'	+
    '    PTU NO: FP092018-126-0182278-00059     \n'	+
    '          DATE ISSUED: 09/06/2018          \n'	+
    '                                           \n'	+
    '             OFFICIAL RECEIPT              \n'	+
    '                                           \n'	+
    '                  RETAIL                   \n'	+
    '                                           \n'	+
    '            OR NO : OR10002440             \n'	+
    '          TICKET NO : RT10002577           \n'	+
    '               PLATE NO : MC               \n'	+
    '                                           \n'	+
    ' LOCATION         : THE LINK               \n'	+
    ' TERMINAL         : POS1                   \n'	+
    ' CASHIER NAME     : LORI ANN BORBON_PM     \n'	+
    ' DATE/TIME IN     : 10/31/2018 13:54:52    \n'	+
    ' DATE/TIME OUT    : 11/01/2018 00:08:14    \n'	+
    ' DURATION OF STAY : 10:14                  \n'	+
    '-------------------------------------------\n'	;


    this.bluetoothSerial.connect('00:13:7B:3A:9C:BA').subscribe(
      (data) => {
        this.bluetoothSerial.write(printerData).then(
          (_) => {
            console.log(printerData);
            this.bluetoothSerial.disconnect();
          },
          (err) => {
            console.log(err);
          }
        );
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
