import { render, screen, fireEvent } from '@testing-library/angular';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { SignInComponent } from './sign-in.component';
import { AuthStore } from '../services/auth.store';
import { Router } from '@angular/router';
import { signal } from '@angular/core';

describe('SignInComponent', () => {
  const mockAuthStore = {
    login: vi.fn(),
    loading: signal(false),
    error: signal(null),
  };
  
  const mockRouter = {
    navigateByUrl: vi.fn(),
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should have a disabled submit button by default', async () => {
    const { fixture } = await render(SignInComponent, {
      providers: [
        { provide: AuthStore, useValue: mockAuthStore },
        { provide: Router, useValue: mockRouter }
      ]
    });

    await fixture.whenStable();

    const submitBtn = screen.getByRole('button', { name: /sign in/i }) as HTMLButtonElement;
    expect(submitBtn.disabled).toBe(true);
  });

  it('should show error messages when invalid data is entered', async () => {
    const { fixture } = await render(SignInComponent, {
      providers: [
        { provide: AuthStore, useValue: mockAuthStore },
        { provide: Router, useValue: mockRouter }
      ]
    });

    const emailInput = screen.getByLabelText(/email/i);
    
    fireEvent.input(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    
    await fixture.whenStable();

    const errorMsg = screen.queryByText(/invalid email format/i);
    expect(errorMsg).not.toBeNull();
  });

  it('should call login when form is valid and submitted', async () => {
    const { fixture } = await render(SignInComponent, {
      providers: [
        { provide: AuthStore, useValue: mockAuthStore },
        { provide: Router, useValue: mockRouter }
      ]
    });

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByPlaceholderText('********'); // Fixed placeholder string

    fireEvent.input(emailInput, { target: { value: 'test@dotnetlab.com' } });
    fireEvent.input(passwordInput, { target: { value: 'password123' } });
    
    await fixture.whenStable();

    const submitBtn = screen.getByRole('button', { name: /sign in/i }) as HTMLButtonElement;
    expect(submitBtn.disabled).toBe(false);

    const form = screen.getByRole('form', { name: /sign-in-form/i });
    fireEvent.submit(form);

    expect(mockAuthStore.login).toHaveBeenCalled();
  });
});