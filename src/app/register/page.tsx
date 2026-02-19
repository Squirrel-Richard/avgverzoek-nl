'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Shield, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const [form, setForm] = useState({ email: '', password: '', naam: '' })
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!form.naam.trim()) { toast.error('Vul je bedrijfsnaam in'); return }
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    })
    if (error) { toast.error(error.message); setLoading(false); return }
    if (data.user) {
      await supabase.from('companies').insert({ user_id: data.user.id, naam: form.naam })
    }
    toast.success('Account aangemaakt! Check je email.')
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: '#0A0A0F' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white">Gratis beginnen</h1>
          <p className="text-text-muted text-sm mt-1">Geen creditcard nodig</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            required placeholder="Bedrijfsnaam *"
            value={form.naam} onChange={e => setForm(p => ({ ...p, naam: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl text-sm"
          />
          <input
            type="email" required placeholder="E-mailadres *"
            value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl text-sm"
          />
          <input
            type="password" required minLength={8} placeholder="Wachtwoord (min. 8 tekens) *"
            value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl text-sm"
          />
          <motion.button
            type="submit" disabled={loading}
            whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-medium disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Account aanmaken...' : 'Gratis account aanmaken'}
          </motion.button>
        </form>

        <p className="text-center text-text-muted text-sm mt-6">
          Al een account?{' '}
          <Link href="/login" className="text-primary hover:underline">Inloggen</Link>
        </p>
      </motion.div>
    </div>
  )
}
