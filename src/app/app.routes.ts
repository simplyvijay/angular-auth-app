import {Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {Base64Component} from './base64/base64.component';
import {ImsComponent} from './ims/ims.component'; // Import ImsComponent

export const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'base64', component: Base64Component},
  {path: 'ims', component: ImsComponent} // Add route for ImsComponent
];
