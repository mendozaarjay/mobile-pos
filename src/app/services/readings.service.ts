import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from '../config/constants';
import { ReadingItem } from '../models/ReadingItem.model';
import { XReadingItem } from '../models/XReadingItem';

@Injectable({
  providedIn: 'root',
})
export class ReadingsService {
  constructor(private http: HttpClient, private constants: Constants) {}
  loadGeneratedXReading() {
    const baseUrl =
      this.constants.baseUrl +
      '/ticket/xreadingtoday?gateid=' +
      this.constants.gateId;
    return this.http.get<any>(baseUrl);
  }
  performXReading() {
    const baseUrl =
      this.constants.baseUrl +
      '/ticket/performxreading?gateid=' +
      this.constants.gateId;
    return this.http.get<any>(baseUrl);
  }
  getXReadingPrintable(srNo: string) {
    const baseUrl =
      this.constants.baseUrl +
      '/ticket/xreading?gateid=' +
      this.constants.gateId +
      '&srno=' +
      srNo;
    return this.http.get<any>(baseUrl);
  }
  loadGeneratedYReading() {
    const baseUrl =
      this.constants.baseUrl +
      '/ticket/yreadingtoday?gateid=' +
      this.constants.gateId;
    return this.http.get<any>(baseUrl);
  }
  performYReading(userId: string) {
    const baseUrl =
      this.constants.baseUrl +
      '/ticket/performyreading?gateid=' +
      this.constants.gateId +
      '&userid=' +
      userId;
    return this.http.get<any>(baseUrl);
  }
  getYReadingPrintable(srNo: string) {
    const baseUrl =
      this.constants.baseUrl +
      '/ticket/yreading?gateid=' +
      this.constants.gateId +
      '&srno=' +
      srNo;
    return this.http.get<any>(baseUrl);
  }
  loadGeneratedZReading() {
    const baseUrl =
      this.constants.baseUrl +
      '/ticket/zreadingtoday?gateid=' +
      this.constants.gateId;
    return this.http.get<any>(baseUrl);
  }
  performZReading(userId: string) {
    const baseUrl =
      this.constants.baseUrl +
      '/ticket/performzreading?gateid=' +
      this.constants.gateId +
      '&userid=' +
      userId;
    return this.http.get<any>(baseUrl);
  }
  getZReadingPrintable(srNo: string, userId: string) {
    const baseUrl =
      this.constants.baseUrl +
      '/ticket/zreading?gateid=' +
      this.constants.gateId +
      '&srno=' +
      srNo +
      '&userid=' +
      userId;
    return this.http.get<any>(baseUrl);
  }
  getReadingItems(type: string, keyword: string): Observable<ReadingItem[]> {
    const baseUrl =
      this.constants.baseUrl +
      '/ticket/readingitems?gateid=' +
      this.constants.gateId +
      '&type=' +
      type +
      '&keyword=' +
      keyword;
    return this.http.get<ReadingItem[]>(baseUrl);
  }

  reprintReadings(type: string, srNo: string, userId: string) {
    let baseUrl = '';
    if (type === 'XR') {
      baseUrl =
        this.constants.baseUrl +
        '/ticket/xreadingreprint?gateId=' +
        this.constants.gateId +
        '&srNo=' +
        srNo;
    }
    if (type === 'YR') {
      baseUrl =
        this.constants.baseUrl +
        '/ticket/yreadingreprint?gateId=' +
        this.constants.gateId +
        '&srNo=' +
        srNo;
    }
    if (type === 'ZR') {
      baseUrl =
        this.constants.baseUrl +
        '/ticket/zreadingreprint?gateId=' +
        this.constants.gateId +
        '&srNo=' +
        srNo +
        '&userId=' +
        userId;
    }
    return this.http.get<any>(baseUrl);
  }
}
