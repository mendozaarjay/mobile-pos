import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../config/constants';
import { ParkerType } from '../models/ParkerType';
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';
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
  defaultParkerType: string ='';


  constructor(
    public loadingController: LoadingController,
    private httpClient: HttpClient,
    private constant: Constants,
    public alertController: AlertController
  ) {}

  ngOnInit() {
    this.getParkerTypes();
    this.defaultParkerType = "1";
  }
  loadParkerTypes(): Observable<any>{
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
        if(newItem.isDefault === true){
          this.defaultParkerType = newItem.id;
        }
        this.parkerType.push(newItem);
      });
    });
  }
async computeRate(){
  const baseUrl = this.constant.apiEndPoint + '/ticket/calculaterate?transitid=' + this.id + '&parkertypeid=' + this.parkerTypeId;
  const alert = await this.alertController.create({
    cssClass: 'my-custom-class',
    header: 'Cannot Continue',
    message: 'Please verify the ticket or plate number to continue.',
    buttons: ['OK']
  });

  if(this.id.length <= 0){
    await alert.present();
    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

}
  async presentLoading() {
    console.log(this.parkerTypeId);
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait while printing official receipt...',
      duration: 2000,
    });
    await loading.present();

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

  loadDefault() {
    this.verifiedTicketNo = '';
    this.plateNo = '';
    this.timeIn = '';
    this.timeOut = '';
    this.duration = '';
    this.id = '0';
  }

}
