import { Component, OnInit } from '@angular/core';
import { StarPRNT } from '@awesome-cordova-plugins/star-prnt/ngx';

@Component({
  selector: 'app-ticketprinter',
  templateUrl: './ticketprinter.page.html',
  styleUrls: ['./ticketprinter.page.scss'],
})
export class TicketprinterPage implements OnInit {
  constructor(private starprnt: StarPRNT) {}

  ngOnInit() {}

  async printTicket() {
    // const hasBarcodeReader = false;
    // this.starprnt
    //   .connect('SW_9CBA', 'EscPosMobile', hasBarcodeReader)
    //   .subscribe(
    //     (result) => {
    //       console.log(result); //Success!
    //     },
    //     (error) => {
    //       console.log(error);
    //     }
    //   );
    // this.starprnt.portDiscovery('all')
    // .then((res: any) => console.log(res))
    // .catch((error: any) => console.error(error));
    this.starprnt.portDiscovery('all').then((data) => {
      console.log('devices:' + data );
    })
    .catch((error) => {
      console.log('error ' + error);
    });
  }
}
