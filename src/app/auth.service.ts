import { Injectable } from '@angular/core';
import { PublicClientApplication, AuthenticationResult } from '@azure/msal-browser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private msalInstance: PublicClientApplication | null = null;

  async configureMsal(clientId: string, tenantId: string) {
    this.msalInstance = new PublicClientApplication({
      auth: {
        clientId,
        authority: `https://login.microsoftonline.com/${tenantId}`,
        redirectUri: 'http://localhost:4200',
      },
    });
    await this.msalInstance.initialize();
  }

  async login(): Promise<AuthenticationResult | null> {
    if (!this.msalInstance) throw new Error('MSAL is not configured.');
    return this.msalInstance.loginPopup({
      scopes: ['openid', 'profile', 'email'],
    });
  }

  async acquireToken(): Promise<AuthenticationResult | null> {
    if (!this.msalInstance) throw new Error('MSAL is not configured.');

    const accounts = this.msalInstance.getAllAccounts();
    if (!accounts.length) throw new Error('No accounts found.');

    return this.msalInstance.acquireTokenSilent({
      scopes: ['openid', 'profile', 'email'],
      account: accounts[0],
    });
  }
}
