import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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

  onToggleFlip(event: Event) {
    event.preventDefault();
    this.toggleFlip.emit();
  }

  protected readonly signUpForm = new FormGroup({
    email: new FormControl('', { 
      nonNullable: true, 
      validators: [Validators.required, Validators.email] 
    }),
    password: new FormControl('', { 
      nonNullable: true, 
      validators: [Validators.required, Validators.minLength(6)] 
    }),
  });

  public submitForm(): void {
    if (this.signUpForm.invalid) return;

    const rawValues = this.signUpForm.getRawValue();
    this.userApiService.create(rawValues).subscribe({
      next: () => {
        //if (result.success) {
          // Una vez creado, redirigimos al login para que el usuario entre formalmente
          this.router.navigateByUrl('/auth/signin');
        //} else {
          // Si el backend devuelve un error controlado (ej: email duplicado)
          // Podrías mapearlo a una señal de error local o usar el store
         // console.error(result.problemDetails.detail);
        //}
      },
      error: (err) => {
        console.error('Error en el registro:', err);
      }
    });
  }
}