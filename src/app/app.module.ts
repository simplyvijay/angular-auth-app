import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule} from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ClipboardModule} from '@angular/cdk/clipboard';
import { MatSidenavModule} from '@angular/material/sidenav';
import { Base64Component } from './base64/base64.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    AppComponent,
    HomeComponent,
    ClipboardModule,
    MatSidenavModule,
    Base64Component,
    MatTooltipModule,
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [],
})
export class AppModule {}
