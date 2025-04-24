import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {Clipboard, ClipboardModule} from '@angular/cdk/clipboard';
import {HttpClient, HttpHeaders} from '@angular/common/http'; // Import HttpClient and HttpHeaders
import {catchError} from 'rxjs/operators'; // Import catchError
import {throwError} from 'rxjs'; // Import throwError

@Component({
  selector: 'app-ims',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    ClipboardModule
  ],
  templateUrl: './ims.component.html',
  styleUrls: ['./ims.component.css']
})
export class ImsComponent {
  imsApigeeUrls = [
    'https://api.d01e.eu.gcp.ford.com',
    'https://api.qa01e.eu.gcp.ford.com',
    'https://api.pd01e.eu.gcp.ford.com'
  ];
  selectedImsApigeeUrl: string = this.imsApigeeUrls[0];
  applicationId: string = '';
  correlationId: string = '';
  fordApplicationId: string = '';
  redirectUri: string = 'http://localhost:4200/ims';
  clientId: string = ''; // Add clientId property
  tenantId: string = ''; // Add tenantId property
  authCode: string = '';
  codeChallenge: string = ''; // Add codeChallenge property
  transactionId: string = ''; // Add transactionId property

  constructor(
    private clipboard: Clipboard,
    private http: HttpClient // Inject HttpClient
  ) {
  }

  generateUUID(): string {
    // Basic UUID v4 generation
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  setApplicationId() {
    this.applicationId = this.generateUUID();
  }

  setCorrelationId() {
    this.correlationId = this.generateUUID();
  }

  setFordApplicationId() {
    this.fordApplicationId = this.generateUUID();
  }

  copyAuthCode() {
    if (this.authCode) {
      this.clipboard.copy(this.authCode);
      // Optional: Add user feedback like a snackbar message here
      console.log('Auth Code copied to clipboard');
    }
  }

  generatePkce() {
    if (!this.selectedImsApigeeUrl || !this.correlationId) {
      console.error('IMS APIGEE URL and Correlation ID are required.');
      // Optionally show a user-friendly error message
      return;
    }

    const apiUrl = `${this.selectedImsApigeeUrl}/bees/identity/api/v1/oauth/pkce`;
    const headers = new HttpHeaders({
      'x-correlation-id': this.correlationId
    });

    this.http.get<{ code_challenge: string }>(apiUrl, {headers})
      .pipe(
        catchError(error => {
          console.error('Error generating PKCE:', error);
          // Optionally show a user-friendly error message
          this.codeChallenge = 'Error generating PKCE'; // Indicate error in the field
          return throwError(() => new Error('PKCE generation failed'));
        })
      )
      .subscribe(response => {
        this.codeChallenge = response.code_challenge;
        console.log('PKCE generated successfully');
      });
  }

  login() {
    // Implement login logic here
    console.log('Login clicked');
    console.log('Selected URL:', this.selectedImsApigeeUrl);
    console.log('Application ID:', this.applicationId);
    console.log('Correlation ID:', this.correlationId);
    console.log('Ford Application ID:', this.fordApplicationId);
    console.log('Client ID:', this.clientId); // Log clientId
    console.log('Tenant ID:', this.tenantId); // Log tenantId
    console.log('Redirect URI:', this.redirectUri);
    console.log('Auth Code:', this.authCode); // Log authCode
    console.log('Code Challenge:', this.codeChallenge);
    console.log('Transaction ID:', this.transactionId);

    const authority = `https://login.microsoftonline.com/${this.tenantId}`;
    const redirectUri = `${this.selectedImsApigeeUrl}/bees/identity/api/oauth/v1/exchange/code/entra-employee`;
    const scopes = `${this.clientId}/.default+openid`;
    const state = {
      redirectUri: this.redirectUri,
      market: 'ES',
      applicationId: this.applicationId
    };
    const stateString = btoa(JSON.stringify(state));
    window.location.href = `${authority}/oauth2/v2.0/authorize?client_id=${this.clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&response_mode=form_post&scope=${encodeURIComponent(scopes)}&state=${stateString}`;
  }
}
