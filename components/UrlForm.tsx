'use client';
import { useState } from 'react';

interface UrlFormProps {
  onSubmit: (url: string) => void;  // <= düzeltildi
  disabled?: boolean;
}

export default function UrlForm({ onSubmit, disabled }: UrlFormProps) {
  const [url, setUrl] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url || disabled) return;
    onSubmit(url);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-2xl items-center gap-2">
      <input
        type="url"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-500"
        required
      />
      <button
        type="submit"
        disabled={disabled}
        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
      >
        Analiz Et
      </button>
    </form>
  );
}