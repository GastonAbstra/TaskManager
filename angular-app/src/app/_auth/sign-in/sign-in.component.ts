import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { LoginApiRequest } from '../services/login-api-request';
import { AuthStore } from '../services/auth.store';
import { email, form, FormField, required } from '@angular/forms/signals';

interface SignInData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [RouterModule, FormField],
  templateUrl: './sign-in.component.html',
})
export class SignInComponent {
  @Output() toggleFlip = new EventEmitter<void>();

  private readonly router = inject(Router);
  readonly store = inject(AuthStore);
  
  protected signInModel = signal({
    email: '', 
    password: ''
  });
  
  protected signInForm = form(this.signInModel, (path) => {
    required(path.email, {message: "Email is required"});
    email(path.email, {message: "Invalid email format"});

    required(path.password, {message: "Password is required"});
  });
  
  protected isFieldInvalid(fieldName: keyof SignInData): boolean {
      const fieldSignal = this.signInForm[fieldName];
      if (!fieldSignal) return false;

      const field = fieldSignal();
      return field && field.touched() && field.errors().length > 0;
  };

  public submitForm(event: Event) {
    event.preventDefault();
    if (this.signInForm().invalid()) return

    const { email, password } = this.signInForm().value();
    const request = new LoginApiRequest(email, password);
    
    this.store.login(request);
  }

  public onToggleFlip(event: Event) {
    event.preventDefault();
    this.toggleFlip.emit();
  }
}