import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-issueor',
  templateUrl: './issueor.page.html',
  styleUrls: ['./issueor.page.scss'],
})
export class IssueorPage implements OnInit {
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
  reference = '';
  isrefenable = false;
  constructor(
    public loadingController: LoadingController,
    public alertController: AlertController,
    private route: Router,
    private storage: Storage,
    private service: OfficialReceiptService,
    private printer: DynamicPrinterService,
    private auditLogs: AuditLogService
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
    this.auditLogs.buttonClicked('Compute OR Button').subscribe((a) => {});
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
      this.totalamount = data.Amount - this.discount;
      this.fee = data.Amount - this.discount;

      this.service.checkIfVatable(this.parkerTypeId).subscribe((vatable) => {
        if (vatable === true) {
          const computedVat = (this.totalamount * 0.12) / 1.12;
          this.vat = computedVat;
        } else {
          this.vat = 0;
        }
      });

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
    this.auditLogs.buttonClicked('Save and Print OR').subscribe((a) => {});
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

    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait while printing official receipt...',
      duration: 2000,
    });
    await loading.present();

    const item = new OfficialReceiptItem();
    item.id = this.id;
    item.ticketNo = this.ticketNo;
    item.parkerTypeId = this.parkerTypeId;
    item.tenderAmount = this.tenderamount;
    item.change = this.change;
    item.totalamount = this.totalamount;
    item.discountTypeId = this.discountTypeId;
    item.discount = this.discount;
    item.transactionTypeId = this.transactionTypeId;
    item.reference = this.reference;
    this.service.setOfficialReceipt(item).subscribe(
      (result) => {
        this.printer.print(result.Printable);
        this.loadDefault();
      },
      (error) => {
        console.log(error);
      }
    );
    const { role, data } = await loading.onDidDismiss();
  }

  async verifyTicket() {
    this.auditLogs.buttonClicked('Verify Button').subscribe((a) => {});
    this.service.verifyTicket(this.ticketNo, this.plateNo).subscribe(
      (ticketdata) => {
        this.verifiedTicketNo = ticketdata.TicketNo;
        this.plateNo = ticketdata.PlateNo;
        this.timeIn = ticketdata.EntranceDate;
        this.timeOut = ticketdata.ExitDate;
        this.duration = ticketdata.Duration;
        this.id = ticketdata.Id;
        console.log(ticketdata);
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
  async openModal() {
    this.auditLogs.buttonClicked('Scan QR Button').subscribe((a) => {});
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
  ionViewWillEnter() {
    this.getParkerTypes();
    this.checkTicketViaQr();
  }
}
