import {Component, OnInit} from '@angular/core';
import { AuthService } from '../auth.service';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {MatButton, MatIconButton} from '@angular/material/button';
import {CdkCopyToClipboard} from '@angular/cdk/clipboard';
import {MatIcon} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import { jwtDecode as jwt_decode } from 'jwt-decode';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

interface IdToken {
  aud: string;
  iss: string;
  iat: number;
  exp: number;
  name: string;
  preferred_username: string;
  email: string;
  img: string;
}

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
    MatIconButton,
    MatCardModule,
    CommonModule
  ]
})
export class HomeComponent implements OnInit {
  clientId = '';
  tenantId = '';
  accessToken = '';
  idToken = '';
  refreshedIdToken = '';
  authCode = '';
  isConfigured = false;
  showUserCard = false;
  user: IdToken = {
    aud: '',
    iss: '',
    iat: 0,
    exp: 0,
    name: '',
    preferred_username: '',
    email: '',
    img: ''
  };
  userPhoto: SafeUrl = '';
  defaultUserIcon: SafeUrl;

  constructor(private authService: AuthService,
              private http: HttpClient,
              private sanitizer: DomSanitizer) {
    this.defaultUserIcon = this.sanitizer.bypassSecurityTrustUrl('assets/user-icon.png');
  }

  ngOnInit() {
    const urlParams = new URLSearchParams(window.location.search);
    this.authCode = urlParams.get('code') || '';
    this.clientId = sessionStorage.getItem('clientId') || '';
    this.tenantId = sessionStorage.getItem('tenantId') || '';
  }

  async configureMsal() {
    if (!this.clientId || !this.tenantId) {
      alert('Please enter both Client ID and Tenant ID.');
      return false;
    }

    sessionStorage.setItem('clientId', this.clientId);
    sessionStorage.setItem('tenantId', this.tenantId);

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
        this.showUserCard = true;
        this.user = this.decodeIdToken(this.idToken);
        await this.fetchUserPhoto();
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

  async redirectToAuthEndpoint() {

    const status = await this.configureMsal();
    if(!status) return;

    this.authService.redirectToAuthEndpoint();
  }

  decodeIdToken(token: string): IdToken {
    try {
      return jwt_decode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return {
        aud: '',
        iss: '',
        iat: 0,
        exp: 0,
        name: '',
        preferred_username: '',
        email: '',
        img: ''
      };
    }
  }

  async fetchUserPhoto() {
    const graphApiUrl = `https://graph.microsoft.com/v1.0/me/photo/$value`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'image/jpeg'
    });
    this.http.get(graphApiUrl, { headers: headers, responseType: 'blob' }).subscribe(
      (blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.userPhoto = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
        };
        reader.readAsDataURL(blob);
      },
      (error) => {
        console.error('Error fetching user photo:', error);
        this.userPhoto = '';
      }
    );
  }
}
