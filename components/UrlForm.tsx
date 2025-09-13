'use client'

import { useState } from 'react'

interface UrlFormProps {
  onSubmit: (url: string) => void
  disabled?: boolean
}

export default function UrlForm({ onSubmit, disabled }: UrlFormProps) {
  const [url, setUrl] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url || disabled) return
    onSubmit(url)
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-2xl mx-auto items-center gap-2">
      <input
        type="url"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
        required
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={disabled || !url}
        className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Analyze
      </button>
    </form>
  )
}