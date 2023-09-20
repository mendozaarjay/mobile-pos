/* eslint-disable no-var */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ParkerType } from '../models/ParkerType';
import { AlertController } from '@ionic/angular';
import { DiscountType } from '../models/DiscountType';
import { TransactionType } from '../models/TransactionType';
import { Storage } from '@ionic/storage-angular';
import { OfficialReceiptItem } from '../models/OfficialReceiptItem';
import { Router } from '@angular/router';
import { OfficialReceiptService } from '../services/official-receipt.service';
import { DynamicPrinterService } from '../services/dynamic-printer.service';
import { AuditLogService } from '../services/audit-log.service';
import { UserLogInService } from '../services/user-log-in.service';
import { StatusComponent } from '../components/status/status.component';
import { interval } from 'rxjs';
import { Constants } from '../config/constants';
@Component({
  selector: 'app-issueor',
  templateUrl: './issueor.page.html',
  styleUrls: ['./issueor.page.scss'],
})
export class IssueorPage implements OnInit {
  @ViewChild(StatusComponent) statusComponent!: StatusComponent;
  isModalOpen = false;
  scanActive = false;
  id = '';
  plateNo = '';
  ticketNo: any;
  verifiedTicketNo: any = '';
  timeIn = '';
  timeOut = '';
  duration = '';
  parkerTypeId = '';
  parkerType: ParkerType[] = [];
  discountTypes: DiscountType[] = [];
  transactionTypes: TransactionType[] = [];
  transactionTypeId: string;
  defaultParkerType = '0';
  defaulttransactionTypeId = '0';
  discountTypeId = 0;
  tenderamount = 0;
  isDiscountDisabled = true;
  discount = 0;
  vat: number;
  fee: number;
  change: number;
  totalamount: number;
  vatablesales: number;
  vatExempt: number;
  reference = '';
  isrefenable = false;
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  isPrinting: boolean = false;
  withDiscount: boolean = false;
  customerName: string = '';
  customerAddress: string = '';
  customerTin: string = '';
  customerId: string = '';
  constructor(
    public loadingController: LoadingController,
    public alertController: AlertController,
    private route: Router,
    private storage: Storage,
    private service: OfficialReceiptService,
    private printer: DynamicPrinterService,
    private auditLogs: AuditLogService,
    private loginService: UserLogInService,
    private constant: Constants
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.getDiscountType();
      this.getTransactionType();
    }, 1000);

    this.tenderamount = Number(this.tenderamount.toFixed(2));
  }
  async getParkerTypes() {
    this.parkerType = [];
    this.service.getParkerTypes().subscribe((res) => {
      res.forEach((element) => {
        const newItem = new ParkerType();
        newItem.id = element.Id;
        newItem.gracePeriod = element.GracePeriod;
        newItem.name = element.Name;
        newItem.vat = element.Vat;
        newItem.isDefault = element.IsDefault;
        if (newItem.isDefault === true) {
          this.defaultParkerType = element.Id;
        }
        this.parkerType.push(newItem);
      });
    });
  }
  async getDiscountType() {
    this.discountTypes = [];
    this.service.getDiscounts().subscribe((res) => {
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
    this.transactionTypes = [];
    this.service.getTransactionTypes().subscribe((res) => {
      res.forEach((element) => {
        const newItem = new TransactionType();
        newItem.id = element.Id;
        newItem.name = element.Name;
        this.transactionTypes.push(newItem);
      });
    });
  }
  async computeRate() {
    this.auditLogs
      .buttonClicked('Compute OR Button', this.userId)
      .subscribe((a) => {});
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
    this.service.getRate(this.id, this.parkerTypeId).subscribe((data) => {
      let fee = data.Amount;
      let vatableSales = fee / 1.12;
      let vatAmount = fee - vatableSales;
      let discountAmount = 0;
      let withDiscount: boolean = false;
      if (this.discountTypeId !== 0 || this.discountTypeId !== undefined) {
        const selected = this.discountTypes.find(
          (a) => a.id === this.discountTypeId
        );
        if (selected) {
          withDiscount = true;
          if (selected.type === 2) {
            discountAmount = selected.amount;
          } else {
            var percentage = selected.amount / 100;
            discountAmount = vatableSales * percentage;
          }
        } else {
          discountAmount = 0;
        }
      } else {
        discountAmount = 0;
      }
      this.vatablesales = withDiscount ? 0 : vatableSales;
      this.vat = withDiscount ? 0 : vatAmount;
      this.vatExempt = withDiscount ? vatableSales : 0;
      this.fee = fee;
      this.totalamount = withDiscount ? vatableSales - discountAmount : fee;
      this.change = this.tenderamount - this.totalamount;
      this.discount = Number(discountAmount.toFixed(2));
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
  checkCustomer(): boolean {
    if (
      this.customerName.length <= 0 ||
      this.customerAddress.length <= 0 ||
      this.customerTin.length <= 0 ||
      this.customerId.length <= 0
    ) {
      return false;
    } else {
      return true;
    }
  }
  async printOfficialReceipt() {
    this.auditLogs
      .buttonClicked('Save and Print OR', this.userId)
      .subscribe((a) => {});

    if (this.withReading) {
      this.showWithReading();
      return;
    }
    if (this.isrefenable && this.checkRefence() === false) {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Cannot Continue',
        message: 'Please provide cashless reference type.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }
    if (this.withDiscount && this.checkCustomer() === false) {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Cannot Continue',
        message: 'Please provide customer name, address, tin and id.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }
    if (this.id === '0' || this.id === '') {
      this.officialReceiptError();
      console.log('should return here');
      return;
    }

    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait while printing official receipt...',
      duration: 2000,
    });
    await loading.present();

    const item: OfficialReceiptItem = {} as OfficialReceiptItem;
    item.transitId = this.id;
    item.ticketNo = this.ticketNo;
    item.parkerType = this.parkerTypeId;
    item.tenderAmount = this.tenderamount;
    item.change = this.change;
    item.totalAmount = this.totalamount;
    item.discountId = this.discountTypeId;
    item.discountAmount = this.discount;
    item.cashlessType = this.transactionTypeId;
    item.cashlessReference = this.reference;
    item.vatAmount = this.vat;
    item.vatExempt = this.vatExempt;
    item.fee = this.fee;
    item.vatableSales = this.vatablesales;
    item.userId = this.userId;
    item.gate = this.constant.gateId;
    item.customerAddress = this.customerAddress;
    item.customerName = this.customerName;
    item.customerTin = this.customerTin;
    item.customerId = this.customerId;
    this.isPrinting = true;
    this.service.setOfficialReceipt(item, this.userId).subscribe(
      (result) => {
        console.log(result.Printable);
        this.printer.print(result.Printable);
        this.loadDefault();
        this.isPrinting = false;
      },
      (error) => {
        console.log(error);
        this.officialReceiptError();
      }
    );
    const { role, data } = await loading.onDidDismiss();
  }

  async verifyTicket() {
    this.auditLogs
      .buttonClicked('Verify Button', this.userId)
      .subscribe((a) => {});
    const shouldReturn = await new Promise((resolve) => {
      this.loginService.checkIfWithReading().subscribe((result) => {
        if (result) {
          this.showWithReading();
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });

    if (shouldReturn) {
      return;
    }

    if (!this.withReading) {
      this.service.verifyTicket(this.ticketNo, this.plateNo).subscribe(
        (ticketdata) => {
          if (ticketdata.IsCompleted === false) {
            this.verifiedTicketNo = ticketdata.TicketNo;
            this.plateNo = ticketdata.PlateNo;
            this.timeIn = ticketdata.EntranceDate;
            this.timeOut = ticketdata.ExitDate;
            this.duration = ticketdata.Duration;
            this.id = ticketdata.Id;
          } else {
            this.showAlert();
          }
        },
        (error) => {
          if (error.status === 404) {
            this.showAlert();
          }
          this.loadDefault();
        }
      );
    } else {
      this.showWithReading();
    }
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
      this.withDiscount = false;
    } else {
      this.isDiscountDisabled = true;
      this.calculateDiscount();
      this.withDiscount = true;
    }
    this.computeRate();
  }
  async showAlert() {
    const alert = await this.alertController.create({
      header: 'Official Receipt',
      message: 'This ticket has been processed.',
      buttons: ['OK'],
    });
    await alert.present();
  }
  async officialReceiptError() {
    const alert = await this.alertController.create({
      header: 'Official Receipt',
      message:
        'Cannot continue. Please check all the details before printing the official receipt.',
      buttons: ['OK'],
    });
    await alert.present();
  }
  calculateDiscount() {
    // if (this.discountTypeId !== 0) {
    //   const selected = this.discountTypes.find(
    //     (a) => a.id === this.discountTypeId
    //   );
    //   if (selected.type === 2) {
    //     this.discount = selected.amount;
    //   } else {
    //     this.discount = (selected.amount / this.totalamount) * 100;
    //   }
    // }
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
    this.plateNo = '';
    this.timeIn = '';
    this.timeOut = '';
    this.duration = '';
    this.parkerTypeId = '';
    this.transactionTypeId = '';
    this.defaultParkerType = '0';
    this.defaulttransactionTypeId = '0';
    this.discountTypeId = 0;
    this.tenderamount = 0;
    this.isDiscountDisabled = true;
    this.discount = 0;
    this.vat = 0;
    this.fee = 0;
    this.change = 0;
    this.totalamount = 0;
    this.reference = '';
    this.isrefenable = false;
    this.customerName = '';
    this.customerAddress = '';
    this.customerTin = '';
    this.customerId = '';
    this.vatablesales = 0;
  }
  async openModal() {
    this.auditLogs
      .buttonClicked('Scan QR Button', this.userId)
      .subscribe((a) => {});
    this.route.navigateByUrl('/qrscanner');
  }
  async checkTicketViaQr() {
    const name = await this.storage.get('ticket');
    if (name) {
      this.ticketNo = name;
      await this.storage.remove('ticket');
      this.verifyTicket();
    }
  }
  async showWithReading() {
    const alert = await this.alertController.create({
      header: 'Cannot Continue.',
      message: 'There is already a Z Reading for today.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  username = '';
  userId = '';
  cashierShiftId = '';
  withReading: boolean = false;
  ionViewWillEnter() {
    interval(5000).subscribe(() => {
      this.statusComponent.checkApiStatus();
    });
    this.getParkerTypes();
    this.checkTicketViaQr();
    const userInfoString = localStorage.getItem('userInfo');
    if (userInfoString) {
      const userInfo = JSON.parse(userInfoString);
      const cashierId = userInfo.Id;
      const cashierName = userInfo.Name;
      this.username = cashierName;
      this.userId = cashierId;
    }
    const cashierShiftId = localStorage.getItem('cashierShiftId');
    this.cashierShiftId = cashierShiftId;
    const withReadingString = localStorage.getItem('withReading');
    this.withReading = withReadingString === '1';
  }
}
