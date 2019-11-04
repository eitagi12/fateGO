import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private _keyInSimSerial: boolean;

  constructor() { }

  public get keyInSimSerial(): boolean {
    return this._keyInSimSerial;
  }
  public set keyInSimSerial(value: boolean) {
    this._keyInSimSerial = value;
  }

}
