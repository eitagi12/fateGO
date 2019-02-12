import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class I18nService implements Resolve<any> {

  private module: string;
  private lang: string;

  private langSubject: Subject<string> = new Subject<string>();

  constructor(
    private http: HttpClient,
    private translateService: TranslateService,
  ) {
    this.langSubject.subscribe((lang: string) => {
      this.translateLoader(this.module, lang);
    });
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    this.module = route.routeConfig.path;
    return this.translateLoader(this.module, this.lang);
  }

  setLang(lang: string) {
    console.log('lang', lang);
    this.langSubject.next(lang);
  }

  private translateLoader(module: string, lang: string = 'en') {
    this.http.get(`/i18n/${module}/${lang}.json`).toPromise().then((i18n: any) => {
      console.log('datafileProject', i18n);
      this.translateService.setDefaultLang('th');
      this.translateService.setTranslation(lang, i18n);
      this.translateService.use(lang);
    });
  }


}
