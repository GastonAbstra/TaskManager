import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { form, required, minLength, email, validate, FormField } from '@angular/forms/signals';

import { UserApiService } from '../../user/data-access/user-api.service';
import { AuthStore } from '../services/auth.store';

interface SignUpData {
  email: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [RouterModule, FormField],
  templateUrl: './sign-up.component.html',
})
export class SignUpComponent {
  @Output() toggleFlip = new EventEmitter<void>();
  
  private readonly userApiService = inject(UserApiService);
  private readonly router = inject(Router);
  readonly store = inject(AuthStore);

  protected signUpModel = signal({
    email: '',
    password: '',
    confirmPassword: ''
  });

  protected signUpForm = form(this.signUpModel, (path) => {
    required(path.email, { message: "Email is required" });
    email(path.email, { message: "Invalid email format" });
    
    required(path.password, { message: "Password is required" });
    minLength(path.password, 6, { message: "Must be at least 6 characters" });

    required(path.confirmPassword, { message: "Please confirm your password" });

    validate(path.confirmPassword, ({value, valueOf}) => {
      const confirmPassword = value();
      const password = valueOf(path.password);

      if(confirmPassword !== password){
          return {
            kind: 'passwordMismatch',
            message: 'Password do not match'
          };
      }
      return null;
    });
  });

  protected isFieldInvalid(fieldName: keyof SignUpData): boolean {
    const fieldSignal = this.signUpForm[fieldName];
    if (!fieldSignal) return false;

    const field = fieldSignal();
    return field && field.touched() && field.errors().length > 0;
  }

  public submitForm(event: Event) {
    event.preventDefault();
    if (this.signUpForm().invalid()) {
      console.error('Form is invalid', this.signUpForm().errors());
      return;
    }

    const { email, password } = this.signUpModel();
    
    this.userApiService.create({ email, password }).subscribe({
      next: () => {
        this.toggleFlip.emit();
        setTimeout(() => {
          this.router.navigateByUrl('/auth/signin');
        }, 600);
      },
      error: (err) => console.error('Registration failed', err)
    });
  }

  public onToggleFlip(event: Event) {
    event.preventDefault();
    this.toggleFlip.emit();
  }
}