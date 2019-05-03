import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService, ChannelType } from 'mychannel-shared-libs';

@Injectable({
  providedIn: 'root'
})
export class MainMenuGuard implements CanActivate {
  constructor(
    private tokenService: TokenService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return ChannelType.SMART_ORDER === this.tokenService.getUser().channelType;
  }
}
