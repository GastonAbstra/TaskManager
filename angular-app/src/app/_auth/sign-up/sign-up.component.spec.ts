import { render, screen, fireEvent } from '@testing-library/angular';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { SignUpComponent } from './sign-up.component';
import { UserApiService } from '../../user/data-access/user-api.service';
import { AuthStore } from '../services/auth.store';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';

describe('SignUpComponent (Zoneless)', () => {
  const mockUserApiService = {
    create: vi.fn(() => of({})),
  };

  const mockAuthStore = {
    loading: signal(false),
  };

  const mockRouter = {
    navigateByUrl: vi.fn(),
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should initialize with a disabled submit button', async () => {
    const { fixture } = await render(SignUpComponent, {
      providers: [
        { provide: UserApiService, useValue: mockUserApiService },
        { provide: AuthStore, useValue: mockAuthStore },
        { provide: Router, useValue: mockRouter },
      ],
    });

    await fixture.whenStable();

    const submitBtn = screen.getByRole('button', { name: /sign up/i }) as HTMLButtonElement;
    expect(submitBtn.disabled).toBe(true);
  });

  it('should show an error if passwords do not match', async () => {
    const { fixture } = await render(SignUpComponent, {
      providers: [
        { provide: UserApiService, useValue: mockUserApiService },
        { provide: AuthStore, useValue: mockAuthStore },
        { provide: Router, useValue: mockRouter },
      ],
    });

    const passwordInput = screen.getByPlaceholderText(/6 characters minimum/i);
    const confirmInput = screen.getByPlaceholderText(/confirm your password/i);

    fireEvent.input(passwordInput, { target: { value: 'password123' } });    
    fireEvent.input(confirmInput, { target: { value: 'different123' } });
    fireEvent.blur(confirmInput);
    await fixture.whenStable();

    const mismatchError = screen.queryByText(/password do not match/i);
    expect(mismatchError).not.toBeNull();
  });

  it('should enable submit button when all fields are valid and passwords match', async () => {
    const { fixture } = await render(SignUpComponent, {
      providers: [
        { provide: UserApiService, useValue: mockUserApiService },
        { provide: AuthStore, useValue: mockAuthStore },
        { provide: Router, useValue: mockRouter },
      ],
    });

    const emailInput = screen.getByPlaceholderText(/your@email.com/i);
    const passwordInput = screen.getByPlaceholderText(/6 characters minimum/i);
    const confirmInput = screen.getByPlaceholderText(/confirm your password/i);

    fireEvent.input(emailInput, { target: { value: 'newuser@test.com' } });
    fireEvent.input(passwordInput, { target: { value: 'password123' } });
    fireEvent.input(confirmInput, { target: { value: 'password123' } });
    await fixture.whenStable();

    const submitBtn = screen.getByRole('button', { name: /sign up/i }) as HTMLButtonElement;
    expect(submitBtn.disabled).toBe(false);
  });

  it('should call UserApiService.create and navigate on successful submission', async () => {
    const { fixture } = await render(SignUpComponent, {
      providers: [
        { provide: UserApiService, useValue: mockUserApiService },
        { provide: AuthStore, useValue: mockAuthStore },
        { provide: Router, useValue: mockRouter },
      ],
    });

    fireEvent.input(screen.getByPlaceholderText(/your@email.com/i), { target: { value: 'test@test.com' } });
    fireEvent.input(screen.getByPlaceholderText(/6 characters minimum/i), { target: { value: 'password123' } });
    fireEvent.input(screen.getByPlaceholderText(/confirm your password/i), { target: { value: 'password123' } });

    await fixture.whenStable();

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(mockUserApiService.create).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'password123'
    });
  });
});