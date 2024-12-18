import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {MatButton, MatIconButton} from '@angular/material/button';
import {CdkCopyToClipboard} from '@angular/cdk/clipboard';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    MatFormField,
    FormsModule,
    MatInput,
    MatButton,
    MatLabel,
    CdkCopyToClipboard,
    MatIcon,
    MatIconButton
  ]
})
export class HomeComponent {
  clientId = '';
  tenantId = '';
  accessToken = '';
  idToken = '';
  refreshedIdToken = '';
  isConfigured = false;

  constructor(private authService: AuthService) {}

  async configureMsal() {
    if (!this.clientId || !this.tenantId) {
      alert('Please enter both Client ID and Tenant ID.');
      return false;
    }

    await this.authService.configureMsal(this.clientId, this.tenantId);
    this.isConfigured = true;
    return this.isConfigured;
  }

  async login() {
    try {
      const status = await this.configureMsal();
      if(!status) return;

      const result = await this.authService.login();
      if (result) {
        this.accessToken = result.accessToken;
        this.idToken = result.idToken;
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Check console for details.');
    }
  }

  async refreshToken() {
    try {
      const result = await this.authService.acquireToken();
      if (result) {
        this.refreshedIdToken = result.idToken;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      alert('Token refresh failed. Check console for details.');
    }
  }
}
