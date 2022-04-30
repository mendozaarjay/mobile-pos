import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../config/constants';
import { ParkerType } from '../models/ParkerType';
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { PrintService } from '../services/print.service';
import EscPosEncoder from 'esc-pos-encoder-ionic';
import { commands } from '../services/printer-commands';
@Component({
  selector: 'app-issueor',
  templateUrl: './issueor.page.html',
  styleUrls: ['./issueor.page.scss'],
})
export class IssueorPage implements OnInit {
  id: string = '';
  plateNo: string = '';
  ticketNo: string = '';
  verifiedTicketNo: string = '';
  timeIn: string = '';
  timeOut: string = '';
  duration: string = '';
  parkerTypeId: string = '';
  parkerType: ParkerType[] = [];
  defaultParkerType: string = '';
  tenderamount: number = 0;
  discount: number;
  vat: number;
  fee: number;
  change: number;
  totalamount: number;

  constructor(
    public loadingController: LoadingController,
    private httpClient: HttpClient,
    private constant: Constants,
    public alertController: AlertController,
    public print: PrintService
  ) {}

  ngOnInit() {
    this.getParkerTypes();
    this.defaultParkerType = '1';
    this.tenderamount = Number(this.tenderamount.toFixed(2));
  }
  loadParkerTypes(): Observable<any> {
    const baseUrl = this.constant.apiEndPoint + '/ticket/parkertypes';
    return this.httpClient.get<any>(baseUrl);
  }
  getParkerTypes() {
    const baseUrl = this.constant.apiEndPoint + '/ticket/parkertypes';
    this.httpClient.get<any>(baseUrl).subscribe((res) => {
      res.forEach((element) => {
        const newItem = new ParkerType();
        newItem.id = element.Id;
        newItem.gracePeriod = element.GracePeriod;
        newItem.name = element.Name;
        newItem.vat = element.Vat;
        newItem.isDefault = element.IsDefault;
        if (newItem.isDefault === true) {
          this.defaultParkerType = newItem.id;
        }
        this.parkerType.push(newItem);
      });
    });
  }
  async computeRate() {
    const baseUrl =
      this.constant.apiEndPoint +
      '/ticket/calculaterate?transitid=' +
      this.id +
      '&parkertypeid=' +
      this.parkerTypeId;
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Cannot Continue',
      message: 'Please verify the ticket or plate number to continue.',
      buttons: ['OK'],
    });

    const noparkertypealert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Cannot Continue',
      message: 'Please select parker type to continue.',
      buttons: ['OK'],
    });
    if (this.id.length <= 0) {
      await alert.present();
      const { role } = await alert.onDidDismiss();
      console.log('onDidDismiss resolved with role', role);
      return;
    }
    if (this.parkerTypeId.length <= 0) {
      await noparkertypealert.present();
      const { role } = await alert.onDidDismiss();
      console.log('onDidDismiss resolved with role', role);
      return;
    }

    this.httpClient.get<any>(baseUrl).subscribe((data) => {
      this.totalamount = data.Amount;
      this.fee = data.Amount;
      const computedVat = (data.Amount * 0.12) / 1.12;
      this.vat = computedVat;

      if (this.tenderamount > 0) {
        this.change = this.tenderamount - data.Amount;
      }
    });
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait while printing official receipt...',
      duration: 2000,
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
  }
  async printOfficialReceipt() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait while printing official receipt...',
      duration: 2000,
    });
    await loading.present();
    const baseUrl =
      this.constant.apiEndPoint +
      '/ticket/officialreceipt?' +
      'ticketno=' +
      this.ticketNo +
      '&' +
      'transitid=' +
      this.id +
      '&' +
      'gate=' +
      this.constant.gateId +
      '&' +
      'parkertype=' +
      this.parkerTypeId +
      '&' +
      'tenderamount=' +
      this.tenderamount +
      '&' +
      'change=' +
      this.change +
      '&' +
      'totalamount=' +
      this.totalamount +
      '&' +
      'userid=' +
      this.constant.userId;
    this.httpClient.get<any>(baseUrl).subscribe(
      (result) => {
        this.printData(result.Printable);
      },
      (error) => {
        console.log(error);
      }
    );
    const { role, data } = await loading.onDidDismiss();
  }
  async verifyTicket() {
    const baseUrl =
      this.constant.apiEndPoint +
      '/ticket/verifyticket?ticket=' +
      this.ticketNo +
      '&gate=0' +
      '&plateno=' +
      this.plateNo;
    this.httpClient.get<any>(baseUrl).subscribe(
      (ticketdata) => {
        this.verifiedTicketNo = ticketdata.TicketNo;
        this.plateNo = ticketdata.PlateNo;
        this.timeIn = ticketdata.EntranceDate;
        this.timeOut = ticketdata.ExitDate;
        this.duration = ticketdata.Duration;
        this.id = ticketdata.Id;
      },
      (error) => {
        this.loadDefault();
      }
    );
  }
  tenderAmountChanged(event: any) {
    const inputAmount = event.target.value;
    this.change = inputAmount - this.fee;
  }

  loadDefault() {
    this.verifiedTicketNo = '';
    this.plateNo = '';
    this.timeIn = '';
    this.timeOut = '';
    this.duration = '';
    this.id = '0';
  }
  async printData(printingdata) {
    const encoder = new EscPosEncoder();
    const result = encoder.initialize();

    result
      .codepage('cp936')
      .align('center')
      .raw(commands.TEXT_FORMAT.TXT_NORMAL)
      .line(printingdata)
      .raw(commands.TEXT_FORMAT.TXT_NORMAL)
      .text(commands.HORIZONTAL_LINE.HR_58MM)
      .text(commands.HORIZONTAL_LINE.HR2_58MM)
      .newline()
      .raw(commands.TEXT_FORMAT.TXT_NORMAL)
      .newline()
      .newline();
    this.print.sendToBluetoothPrinter(this.constant.bluetoothAddress, result.encode());
  }
}
