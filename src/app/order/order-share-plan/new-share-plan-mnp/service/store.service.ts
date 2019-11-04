import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private _keyInSimSerial: boolean;
  private _simSerialValid: boolean;

  constructor() { }

  public get keyInSimSerial(): boolean {
    return this._keyInSimSerial;
  }
  public set keyInSimSerial(value: boolean) {
    this._keyInSimSerial = value;
  }

  public get simSerialValid(): boolean {
    return this._simSerialValid;
  }
  public set simSerialValid(value: boolean) {
    this._simSerialValid = value;
  }

}
