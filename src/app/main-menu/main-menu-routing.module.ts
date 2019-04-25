import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainMenuPageComponent } from './containers/main-menu-page/main-menu-page.component';

const routes: Routes = [
  { path: '', component: MainMenuPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainMenuRoutingModule { }
