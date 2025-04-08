import { Component } from '@angular/core';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-base64',
  imports: [
    MatFormField,
    FormsModule,
    MatInput,
    MatButton,
    MatLabel,
    MatIcon,
    MatIconButton,
    MatTooltip
  ],
  templateUrl: './base64.component.html',
  styleUrl: './base64.component.css'
})
export class Base64Component {

  constructor(private snackBar : MatSnackBar) {
  }

  inputText: string = '';
  encodedText: string = '';
  decodedText: string = '';

  encodeText() {
    this.encodedText = btoa(this.inputText);
    this.decodedText = '';
  }

  decodeText() {
    try {
      this.decodedText = atob(this.inputText);
      this.encodedText = '';
    } catch (e) {
      this.decodedText = 'Invalid Base64 string';
    }
  }

  copyToClipboard() {
    const textToCopy = this.encodedText || this.decodedText;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        this.snackBar.open('Copied', 'Close', { duration: 2000 });
      }).catch(err => {
        console.error('Error copying text: ', err);
      });
    }
  }

  clearText() {
    this.inputText = '';
    this.encodedText = '';
    this.decodedText = '';
  }
}
