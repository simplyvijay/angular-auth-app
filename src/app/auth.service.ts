import {Injectable} from '@angular/core';
import {AuthenticationResult, PublicClientApplication} from '@azure/msal-browser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private msalInstance: PublicClientApplication | null = null;
  private codeVerifier: string | null = null;

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

  private generateCodeVerifier(): string {
    const array = new Uint32Array(32);
    window.crypto.getRandomValues(array);
    return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
  }

  private async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
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

  redirectToAuthEndpoint() {
    this.codeVerifier = this.generateCodeVerifier();
    this.generateCodeChallenge(this.codeVerifier).then(codeChallenge => {
      if (!this.msalInstance) throw new Error('MSAL is not configured.');
      const configuration = this.msalInstance.getConfiguration();
      const clientId = configuration.auth.clientId;
      const authority = configuration.auth.authority;
      const redirectUri = configuration.auth.redirectUri;
      const scopes = ['openid', 'profile', 'email'].join(' ');
      window.location.href = `${authority}/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&response_mode=query&scope=${encodeURIComponent(scopes)}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
    });
  }
}
