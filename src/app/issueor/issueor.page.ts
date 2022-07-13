import { AfterContentInit, Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../config/constants';
import { ParkerType } from '../models/ParkerType';
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { PrintService } from '../services/print.service';
import EscPosEncoder from 'esc-pos-encoder-ionic';
import { commands } from '../services/printer-commands';
import { DiscountType } from '../models/DiscountType';
import { TransactionType } from '../models/TransactionType';
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
  discountTypes: DiscountType[] = [];
  transactionTypes: TransactionType[] = [];
  transactionTypeId: string;
  defaultParkerType: string = '0';
  defaulttransactionTypeId: string = '0';
  discountTypeId: number = 0;
  tenderamount: number = 0;
  isDiscountDisabled: boolean = true;
  discount: number = 0;
  vat: number;
  fee: number;
  change: number;
  totalamount: number;
  reference: string = '';
  isrefenable: boolean = false;
  constructor(
    public loadingController: LoadingController,
    private httpClient: HttpClient,
    private constant: Constants,
    public alertController: AlertController,
    public print: PrintService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.getParkerTypes();
      this.getDiscountType();
      this.getTransactionType();
    }, 1000);

    this.tenderamount = Number(this.tenderamount.toFixed(2));
  }

  loadParkerTypes(): Observable<any> {
    const baseUrl = this.constant.apiEndPoint + '/ticket/parkertypes';
    return this.httpClient.get<any>(baseUrl);
  }
  async getParkerTypes() {
    this.parkerType = [];
    const baseUrl = this.constant.apiEndPoint + '/ticket/parkertypes';
    return this.httpClient.get<any>(baseUrl).subscribe((res) => {
      res.forEach((element) => {
        const newItem = new ParkerType();
        newItem.id = element.Id;
        newItem.gracePeriod = element.GracePeriod;
        newItem.name = element.Name;
        newItem.vat = element.Vat;
        newItem.isDefault = element.IsDefault;
        if (newItem.isDefault === true) {
          this.constant.defaultParkerType = element.Id;
          this.defaultParkerType = element.Id;
        }
        this.parkerType.push(newItem);
      });
    });
  }
  async getDiscountType() {
    const baseUrl = this.constant.apiEndPoint + '/ticket/getdiscounttypes';
    this.httpClient.get<any>(baseUrl).subscribe((res) => {
      res.forEach((element) => {
        const newItem = new DiscountType();
        newItem.id = element.Id;
        newItem.name = element.Name;
        newItem.amount = element.Amount;
        newItem.type = element.Type;
        this.discountTypes.push(newItem);
      });
    });
  }
  async getTransactionType() {
    const baseUrl = this.constant.apiEndPoint + '/ticket/gettransactiontypes';
    this.httpClient.get<any>(baseUrl).subscribe((res) => {
      res.forEach((element) => {
        const newItem = new TransactionType();
        newItem.id = element.Id;
        newItem.name = element.Name;
        this.transactionTypes.push(newItem);
        this.defaulttransactionTypeId = this.constant.defaultTransactionType;
        this.transactionTypeId = this.constant.defaultTransactionType;
      });
    });
  }
  async computeRate() {
    console.log(this.discount);
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
      this.totalamount = data.Amount - this.discount;
      this.fee = data.Amount - this.discount;
      console.log(this.totalamount);
      console.log(this.fee);
      const computedVat = (this.totalamount * 0.12) / 1.12;
      this.vat = computedVat;

      if (this.tenderamount > 0) {
        this.change = this.tenderamount - this.totalamount;
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
  checkRefence(): boolean {
    const ref = this.reference.replace(' ', '');
    if (ref.length > 0) {
      return true;
    } else {
      return false;
    }
  }
  async printOfficialReceipt() {
    console.log(this.isrefenable);
    console.log(this.transactionTypeId);
    console.log('refeernce' + this.reference + '|asd');
    if (this.isrefenable && this.checkRefence() === false) {
      console.log('why pumasok dito');
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Cannot Continue',
        message: 'Please provide cashless reference type.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

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
      this.constant.userId +
      '&discountid=' +
      this.discountTypeId +
      '&discountamount=' +
      this.discount +
      '&cashlesstype=' +
      this.transactionTypeId +
      '&cashlessreference=' +
      this.reference;
    this.httpClient.get<any>(baseUrl).subscribe(
      (result) => {
        console.log(result.Printable);
        this.printData(result.Printable);
        this.loadDefault();
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
    this.change = this.change - this.discount;
    this.calculateDiscount();
  }
  discountChanged(event: any) {
    const id = event.target.value;
    if (id === '0' || id === 0) {
      this.isDiscountDisabled = true;
      this.discount = 0;
    } else {
      this.isDiscountDisabled = true;
      this.calculateDiscount();
    }
    this.computeRate();
  }

  calculateDiscount() {
    if (this.discountTypeId !== 0) {
      const selected = this.discountTypes.find(
        (a) => a.id === this.discountTypeId
      );
      if (selected.type === 1) {
        this.discount = selected.amount;
      } else {
        this.discount = (selected.amount / this.totalamount) * 100;
      }
    }
  }
  typeChanged(event: any) {
    const id = event.target.value;
    console.log(id);
    if (id === '0' || id === 0) {
      this.isrefenable = false;
    } else {
      this.isrefenable = true;
    }
    console.log(this.isrefenable);
  }
  loadDefault() {
    this.verifiedTicketNo = '';
    this.plateNo = '';
    this.timeIn = '';
    this.timeOut = '';
    this.duration = '';
    this.id = '0';
    this.reference = '';
  }
  async printData(printingdata) {
    console.log(printingdata);
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
    this.print.sendToBluetoothPrinter(
      this.constant.bluetoothAddress,
      result.encode()
    );
  }
}
