import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Storage } from '@ionic/storage-angular';
import { IssueorPage } from '../issueor/issueor.page';
@Component({
  selector: 'app-qrscanner',
  templateUrl: './qrscanner.page.html',
  styleUrls: ['./qrscanner.page.scss'],
})
export class QrscannerPage implements OnInit, AfterViewInit {
  scanActive: boolean = false;
  @ViewChild('startscan') startClick: ElementRef;
  constructor(
    private elementRef: ElementRef,
    private route: Router,
    private storage: Storage,
    private issueOr: IssueorPage
  ) {}

  ngOnInit() {}
  ngAfterViewInit(): void {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor =
      'transparent';
    this.startScanner();
  }
  async checkPermission() {
    return new Promise(async (resolve, reject) => {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        resolve(true);
      } else if (status.denied) {
        BarcodeScanner.openAppSettings();
        resolve(false);
      }
    });
  }

  async startScanner() {
    const allowed = await this.checkPermission();

    if (allowed) {
      this.scanActive = true;
      document.querySelector('body').classList.add('scanner-active');
      BarcodeScanner.hideBackground();

      const result = await BarcodeScanner.startScan();

      if (result.hasContent) {
        this.scanActive = false;
        document.querySelector('body').classList.remove('scanner-active');
        this.stopScanner();
        this.setTicket(result.content);
      } else {
        alert('NO DATA FOUND!');
      }
    } else {
      alert('NOT ALLOWED!');
    }
  }

  stopScanner() {
    BarcodeScanner.stopScan();
    this.scanActive = false;
    document.querySelector('body').classList.remove('scanner-active');
  }

  ionViewWillLeave() {
    BarcodeScanner.stopScan();
    this.scanActive = false;
    document.querySelector('body').classList.remove('scanner-active');
  }
  cancel() {
    this.route.navigateByUrl('issueor');
  }
  async setTicket(ticket: any) {
    await this.storage.set('ticket', ticket);

    this.route.navigateByUrl('issueor');
  }
  ionViewWillEnter() {
    setTimeout(() => {
      this.startClick.nativeElement.click();
    }, 1000);
  }
}
