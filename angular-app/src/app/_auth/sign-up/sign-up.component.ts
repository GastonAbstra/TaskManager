import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserApiService } from '../../user/data-access/user-api.service';
import { AuthStore } from '../services/auth.store';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './sign-up.component.html',
})
export class SignUpComponent {
  @Output() toggleFlip = new EventEmitter<void>();
  private readonly userApiService = inject(UserApiService);
  private readonly router = inject(Router);
  readonly store = inject(AuthStore);

  private passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    return password && confirmPassword && password.value !== confirmPassword.value 
      ? { passwordMismatch: true } 
      : null;
  };

  protected readonly signUpForm = new FormGroup({
    email: new FormControl('', { 
      nonNullable: true, 
      validators: [Validators.required, Validators.email] 
    }),
    password: new FormControl('', { 
      nonNullable: true, 
      validators: [Validators.required, Validators.minLength(6)] 
    }),
    confirmPassword: new FormControl('', { 
        nonNullable: true, 
        validators: [Validators.required] 
      })
    }, { validators: this.passwordMatchValidator });

  public submitForm(): void {
    if (this.signUpForm.invalid) return;

    const rawValues = this.signUpForm.getRawValue();
    
    this.userApiService.create(rawValues).subscribe({
      next: () => {
        this.toggleFlip.emit();

        setTimeout(() => {
          this.router.navigateByUrl('/auth/signin');
        }, 600); // Flipcard animation takes 0.6s
      },
      error: (err) => {
        console.error('Error al registrar usuario', err);
      }
    });
  }

  onToggleFlip(event: Event) {
    event.preventDefault();
    this.toggleFlip.emit();
  }
}