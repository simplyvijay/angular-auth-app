import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {MatListItem, MatNavList} from '@angular/material/list';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatSidenavContainer, MatSidenavContent, MatNavList, MatListItem, MatSidenav],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-auth-app';
}
