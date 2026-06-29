'use client';

import { redirect, useRouter } from 'next/navigation';
import { useId, useState } from 'react';
import { ApiError, api } from '../../lib/api';

type SignUpResponse = {
  user: { id: string; email: string };
  session: {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
  };
};

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const emailId = useId();
  const passwordId = useId();
  const confirmId = useId();
  const [error, setError] = useState('');

  if (typeof window !== 'undefined' && localStorage.getItem('cgm_token')) {
    redirect('/dashboard');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const data = await api.post<SignUpResponse>('/auth/signup', {
        email,
        password,
      });

      localStorage.setItem('cgm_token', data.session.access_token);
      router.push('/dashboard');
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.message === 'A user with this email already exists') {
          setError('An account with this email already exists');
        } else {
          setError(err.message);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-semibold text-zinc-900">
          Create account
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor={emailId}
              className="mb-1 block text-sm font-medium text-zinc-700"
            >
              Email
            </label>
            <input
              id={emailId}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
            />
          </div>

          <div>
            <label
              htmlFor={passwordId}
              className="mb-1 block text-sm font-medium text-zinc-700"
            >
              Password
            </label>
            <input
              id={passwordId}
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
            />
          </div>

          <div>
            <label
              htmlFor={confirmId}
              className="mb-1 block text-sm font-medium text-zinc-700"
            >
              Confirm password
            </label>
            <input
              id={confirmId}
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex h-10 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Creating account...
              </span>
            ) : (
              'Create account'
            )}
          </button>

          <p className="text-center text-sm text-zinc-500">
            Already have an account?{' '}
            <a
              href="/login"
              className="font-medium text-zinc-900 underline underline-offset-2 hover:text-zinc-700"
            >
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
