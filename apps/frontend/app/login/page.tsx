'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useId, useState } from 'react';
import { ApiError, api } from '../../lib/api';

type SignInResponse = {
  user: { id: string; email: string };
  session: {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
  };
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const emailId = useId();
  const passwordId = useId();
  const [error, setError] = useState('');

  useEffect(() => {
    if (localStorage.getItem('cgm_token')) {
      router.push('/dashboard');
    }
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);

    try {
      const data = await api.post<SignInResponse>('/auth/signin', {
        email,
        password,
      });

      localStorage.setItem('cgm_token', data.session.access_token);
      router.push('/dashboard');
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
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
        <h1 className="mb-6 text-2xl font-semibold text-zinc-900">Sign in</h1>

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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
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
                Signing in...
              </span>
            ) : (
              'Sign in'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
