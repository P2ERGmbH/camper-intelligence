'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProviderLoginFormProps {
  locale: string;
  initialError?: string;
}

export default function ProviderLoginForm({ locale, initialError = '' }: ProviderLoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(initialError);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch(`/${locale}/api/provider/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Provider login successful:', data.message);
        if (data.redirectUrl) {
          router.push(`/${locale}${data.redirectUrl}`);
        } else {
          router.push(`/${locale}/provider`); // Fallback to generic provider root
        }
      } else {
        setError(data.error || 'Login failed.');
      }
    } catch (err) {
      console.error('Error during provider login:', err);
      setError('An unexpected error occurred during login.');
    }
  };

  return (
    <div className="px-8 py-6 mt-4 text-left bg-card shadow-lg rounded-lg">
      <h3 className="text-2xl font-bold text-center text-foreground">Provider Login</h3>
      <form onSubmit={handleSubmit}>
        <div className="mt-4">
          <div>
            <label className="block text-foreground" htmlFor="email">Email</label>
            <input 
              type="email" 
              placeholder="Email"
              className="w-full px-4 py-2 mt-2 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mt-4">
            <label className="block text-foreground" htmlFor="password">Password</label>
            <input 
              type="password" 
              placeholder="Password"
              className="w-full px-4 py-2 mt-2 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div className="flex items-baseline justify-between">
            <button type="submit" className="px-6 py-2 mt-4 text-primary-foreground bg-primary rounded-lg hover:bg-primary/90">Login</button>
          </div>
        </div>
      </form>
    </div>
  );
}
