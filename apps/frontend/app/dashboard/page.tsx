'use client';

import { AuthGuard } from '../../components/auth-guard';

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="flex flex-1 items-center justify-center bg-zinc-50">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-zinc-900">Dashboard</h1>
          <p className="mt-2 text-zinc-500">Coming soon.</p>
        </div>
      </div>
    </AuthGuard>
  );
}
