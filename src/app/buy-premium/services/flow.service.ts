import { Injectable } from '@angular/core';

export enum CustomerGroup {
  NEW_REGISTER = 'MC001',
  PRE_TO_POST = 'MC002',
  MNP = 'MC003',
  EXISTING = 'MC004',
  DEVICE_ONLY = 'MC005'
}

@Injectable({
  providedIn: 'root'
})
export class FlowService {

  constructor() { }
}
