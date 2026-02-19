'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Save, Loader2, Shield } from 'lucide-react'
import { toast } from 'sonner'

const SYSTEMEN = ['Email', 'CRM / Klantbestand', 'Financieel / Facturen', 'HR / Personeelsadmin', 'Website / Analytics', 'Nieuwsbrief', 'Cloud opslag', 'Overig']

function generateVerzoekNummer() {
  const year = new Date().getFullYear()
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `AVG-${year}-${rand}`
}

export default function NieuwVerzoekPage() {
  const router = useRouter()
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    betrokkene_naam: '',
    betrokkene_email: '',
    betrokkene_bsn_partial: '',
    ontvangen_op: new Date().toISOString().split('T')[0],
    notities: '',
  })
  const [systemen, setSystemen] = useState<string[]>([])

  function toggleSysteem(s: string) {
    setSystemen(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.betrokkene_naam.trim()) { toast.error('Vul de naam in van de betrokkene'); return }
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { data: company } = await supabase.from('companies').select('id').eq('user_id', user?.id).single()
      if (!company) throw new Error('Geen bedrijf gevonden')

      const { error } = await supabase.from('verzoeken').insert({
        company_id: company.id,
        verzoek_nummer: generateVerzoekNummer(),
        betrokkene_naam: form.betrokkene_naam,
        betrokkene_email: form.betrokkene_email || null,
        betrokkene_bsn_partial: form.betrokkene_bsn_partial || null,
        ontvangen_op: form.ontvangen_op,
        deadline: new Date(new Date(form.ontvangen_op).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        systemen_gecontroleerd: systemen,
        notities: form.notities || null,
        status: 'nieuw',
      })
      if (error) throw error
      toast.success('Verzoek gelogd! 30-daagse deadline gestart.')
      router.push('/dashboard')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Opslaan mislukt')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen p-8" style={{ background: '#0A0A0F' }}>
      <div className="max-w-xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-text-muted hover:text-white transition-colors mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" />
          Terug naar dashboard
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Nieuw Inzageverzoek</h1>
            <p className="text-text-muted text-sm">30-daagse deadline start automatisch</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Betrokkene */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl space-y-4"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <h2 className="text-white font-semibold">Gegevens betrokkene</h2>
            <div>
              <label className="block text-xs text-text-muted mb-1.5">Volledige naam *</label>
              <input required placeholder="bijv. Jan de Vries"
                value={form.betrokkene_naam} onChange={e => setForm(p => ({ ...p, betrokkene_naam: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-text-muted mb-1.5">E-mailadres</label>
                <input type="email" placeholder="jan@example.nl"
                  value={form.betrokkene_email} onChange={e => setForm(p => ({ ...p, betrokkene_email: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-text-muted mb-1.5">BSN (laatste 4 cijfers)</label>
                <input placeholder="bijv. 1234" maxLength={4}
                  value={form.betrokkene_bsn_partial} onChange={e => setForm(p => ({ ...p, betrokkene_bsn_partial: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1.5">Datum ontvangen *</label>
              <input type="date" required
                value={form.ontvangen_op} onChange={e => setForm(p => ({ ...p, ontvangen_op: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl text-sm"
              />
            </div>
          </motion.div>

          {/* Systemen */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <h2 className="text-white font-semibold mb-1">Te doorzoeken systemen</h2>
            <p className="text-text-muted text-xs mb-4">Selecteer welke systemen persoonsdata van deze persoon kunnen bevatten</p>
            <div className="grid grid-cols-2 gap-2">
              {SYSTEMEN.map(s => (
                <motion.button
                  key={s} type="button"
                  onClick={() => toggleSysteem(s)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-left transition-all"
                  style={{
                    background: systemen.includes(s) ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
                    border: systemen.includes(s) ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.08)',
                    color: systemen.includes(s) ? '#a5b4fc' : '#9CA3AF',
                  }}
                >
                  <div className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0" style={{ background: systemen.includes(s) ? '#6366f1' : 'transparent', borderColor: systemen.includes(s) ? '#6366f1' : '#4B5563' }}>
                    {systemen.includes(s) && <span className="text-white text-xs">✓</span>}
                  </div>
                  {s}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Notities */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <label className="block text-white font-semibold mb-3">Notities (optioneel)</label>
            <textarea placeholder="Via welk kanaal ontvangen? Bijzonderheden?"
              value={form.notities} onChange={e => setForm(p => ({ ...p, notities: e.target.value }))}
              rows={3} className="w-full px-4 py-3 rounded-xl text-sm resize-none"
            />
          </motion.div>

          <div className="flex gap-3">
            <motion.button
              type="submit" disabled={saving}
              whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Opslaan...' : 'Verzoek opslaan + timer starten'}
            </motion.button>
            <Link href="/dashboard">
              <button type="button" className="px-6 py-3 text-text-muted hover:text-white rounded-xl text-sm border border-white/10 hover:border-white/20 transition-all">
                Annuleren
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
