import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStore } from '../services/auth.store';
import { LoginApiRequest } from '../services/login-api-request';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './sign-in.component.html',
})
export class SignInComponent implements OnInit {
  @Output() toggleFlip = new EventEmitter<void>();
  readonly store = inject(AuthStore);
  private readonly router = inject(Router);

  onToggleFlip(event: Event) {
    event.preventDefault();
    this.toggleFlip.emit();
  }
  
  protected readonly signInForm = new FormGroup({
    email: new FormControl('', { 
      nonNullable: true, 
      validators: [Validators.required, Validators.email] 
    }),
    password: new FormControl('', { 
      nonNullable: true, 
      validators: [Validators.required] 
    }),

  });

  ngOnInit(): void {

    if (this.store.tokenValid()) {
      this.router.navigateByUrl('/');
    }
  }

  public submitForm(): void {
    if (this.signInForm.invalid) return;

    const { email, password } = this.signInForm.getRawValue();
    const request = new LoginApiRequest(email, password);
    
    this.store.login(request);
  }
}