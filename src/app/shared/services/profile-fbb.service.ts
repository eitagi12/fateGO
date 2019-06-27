import { Injectable } from '@angular/core';
import { LocalStorageService, NgxResource } from 'ngx-store';
import { ProfileFbb } from 'src/app/shared/models/profile-fbb.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileFbbService {

  constructor(
    private localStorageService: LocalStorageService
    ) { }

    private get settings(): NgxResource<ProfileFbb> {
      return this.localStorageService
        .load(`ProfileFbb`)
        .setDefaultValue({});
    }

    remove(): void {
      this.settings.remove();
    }

    save(profileFbb: ProfileFbb): void {
      this.settings.save(profileFbb);
    }

    update(profileFbb: ProfileFbb): void {
      this.settings.update(profileFbb);
    }

    load(): ProfileFbb {
      return this.settings.value;
    }
}
