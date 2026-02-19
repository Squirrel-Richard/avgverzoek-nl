'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Verzoek } from '@/types/database'
import {
  ArrowLeft, Shield, CheckCircle,
  Check, Loader2, FileText
} from 'lucide-react'
import { toast } from 'sonner'

const SYSTEMEN_OPTIES = ['Email', 'CRM / Klantbestand', 'Financieel / Facturen', 'HR / Personeelsadmin', 'Website / Analytics', 'Nieuwsbrief', 'Cloud opslag', 'Overig']

const STATUS_OPTIES = [
  { value: 'nieuw', label: 'Nieuw', color: '#3B82F6' },
  { value: 'in_behandeling', label: 'In behandeling', color: '#F97316' },
  { value: 'afgerond', label: 'Afgerond', color: '#22C55E' },
  { value: 'verlopen', label: 'Verlopen', color: '#EF4444' },
]

function daysLeft(deadline: string) {
  return Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

const NL_TEMPLATE = (naam: string) => `Geachte ${naam},

Hierbij bevestigen wij de ontvangst van uw verzoek tot inzage in uw persoonsgegevens conform artikel 15 van de Algemene Verordening Gegevensbescherming (AVG).

Wij hebben uw verzoek in behandeling genomen en zullen u binnen de wettelijke termijn van 30 dagen een overzicht verstrekken van de persoonsgegevens die wij van u verwerken.

Indien wij uw verzoek niet kunnen inwilligen, zullen wij u hiervan met opgave van redenen in kennis stellen.

Met vriendelijke groet,
[Uw naam]
[Bedrijfsnaam]`

export default function VerzoekDetailPage() {
  const { id } = useParams<{ id: string }>()
  const supabase = createClient()
  const [verzoek, setVerzoek] = useState<Verzoek | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notities, setNotities] = useState('')
  const [antwoord, setAntwoord] = useState('')

  useEffect(() => { if (id) loadVerzoek() }, [id])

  async function loadVerzoek() {
    setLoading(true)
    const { data } = await supabase.from('verzoeken').select('*').eq('id', id).single()
    if (data) {
      setVerzoek(data as Verzoek)
      setNotities(data.notities || '')
      setAntwoord(data.antwoord_concept || NL_TEMPLATE(data.betrokkene_naam))
    }
    setLoading(false)
  }

  async function toggleSysteem(s: string) {
    if (!verzoek) return
    const current = verzoek.systemen_gecontroleerd || []
    const updated = current.includes(s) ? current.filter((x: string) => x !== s) : [...current, s]
    const { error } = await supabase.from('verzoeken').update({ systemen_gecontroleerd: updated }).eq('id', id)
    if (!error) setVerzoek(p => p ? { ...p, systemen_gecontroleerd: updated } : p)
  }

  async function updateStatus(status: string) {
    const { error } = await supabase.from('verzoeken').update({
      status,
      afgerond_op: status === 'afgerond' ? new Date().toISOString() : null
    }).eq('id', id)
    if (!error) {
      setVerzoek(p => p ? { ...p, status: status as Verzoek['status'] } : p)
      toast.success(`Status gewijzigd naar: ${status}`)
    }
  }

  async function saveNotes() {
    setSaving(true)
    await supabase.from('verzoeken').update({ notities, antwoord_concept: antwoord }).eq('id', id)
    setSaving(false)
    toast.success('Opgeslagen')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0F' }}><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
  if (!verzoek) return <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0F' }}><div className="text-white">Verzoek niet gevonden</div></div>

  const days = daysLeft(verzoek.deadline)
  const timerColor = days <= 0 ? '#EF4444' : days <= 7 ? '#EF4444' : days <= 14 ? '#F97316' : '#22C55E'
  const statusObj = STATUS_OPTIES.find(s => s.value === verzoek.status)

  return (
    <div className="min-h-screen p-8" style={{ background: '#0A0A0F' }}>
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-text-muted hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{verzoek.betrokkene_naam}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-text-muted text-sm font-mono">{verzoek.verzoek_nummer}</span>
                {statusObj && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                    style={{ background: statusObj.color + '20', color: statusObj.color, border: `1px solid ${statusObj.color}40` }}>
                    {statusObj.label}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Timer */}
          {verzoek.status !== 'afgerond' && (
            <motion.div
              animate={{ boxShadow: [`0 0 15px ${timerColor}30`, `0 0 30px ${timerColor}50`, `0 0 15px ${timerColor}30`] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-center px-6 py-4 rounded-2xl"
              style={{ background: timerColor + '10', border: `1px solid ${timerColor}30` }}
            >
              <div className="text-3xl font-black" style={{ color: timerColor }}>
                {days <= 0 ? 'VERLOPEN' : `${days}`}
              </div>
              <div className="text-xs mt-0.5" style={{ color: timerColor }}>
                {days <= 0 ? '' : days === 1 ? 'dag resterend' : 'dagen resterend'}
              </div>
              <div className="text-xs text-text-muted mt-1">
                Deadline: {new Date(verzoek.deadline).toLocaleDateString('nl-NL')}
              </div>
            </motion.div>
          )}
          {verzoek.status === 'afgerond' && (
            <div className="text-center px-6 py-4 rounded-2xl" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
              <CheckCircle className="w-8 h-8 text-success mx-auto mb-1" />
              <div className="text-xs text-success font-medium">Afgerond</div>
            </div>
          )}
        </div>

        {/* Status wijzigen */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl mb-5"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <h2 className="text-white font-semibold mb-3 text-sm">Status wijzigen</h2>
          <div className="flex gap-2 flex-wrap">
            {STATUS_OPTIES.map(s => (
              <motion.button key={s.value} type="button" onClick={() => updateStatus(s.value)}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: verzoek.status === s.value ? s.color + '20' : 'rgba(255,255,255,0.05)',
                  color: verzoek.status === s.value ? s.color : '#9CA3AF',
                  border: verzoek.status === s.value ? `1px solid ${s.color}40` : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {verzoek.status === s.value && '✓ '}{s.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Systemen checklist */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="p-5 rounded-2xl mb-5"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-semibold text-sm">Systemen gecheckt</h2>
            <span className="text-xs text-text-muted">{(verzoek.systemen_gecontroleerd || []).length}/{SYSTEMEN_OPTIES.length}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {SYSTEMEN_OPTIES.map(s => {
              const checked = (verzoek.systemen_gecontroleerd || []).includes(s)
              return (
                <motion.button key={s} type="button" onClick={() => toggleSysteem(s)}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-left transition-all"
                  style={{
                    background: checked ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)',
                    border: checked ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(255,255,255,0.08)',
                    color: checked ? '#86efac' : '#9CA3AF',
                  }}
                >
                  <div className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0"
                    style={{ background: checked ? '#22c55e' : 'transparent', borderColor: checked ? '#22c55e' : '#4B5563' }}>
                    {checked && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                  {s}
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Antwoord concept */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="p-5 rounded-2xl mb-5"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-primary" />
            <h2 className="text-white font-semibold text-sm">Antwoord-concept (NL template)</h2>
          </div>
          <textarea
            value={antwoord} onChange={e => setAntwoord(e.target.value)}
            rows={10} className="w-full px-4 py-3 rounded-xl text-sm resize-none font-mono text-text-muted"
          />
        </motion.div>

        {/* Notities + Save */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="p-5 rounded-2xl mb-5"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <label className="block text-white font-semibold text-sm mb-3">Interne notities</label>
          <textarea
            value={notities} onChange={e => setNotities(e.target.value)}
            rows={3} placeholder="Interne aantekeningen..."
            className="w-full px-4 py-3 rounded-xl text-sm resize-none"
          />
        </motion.div>

        <div className="flex gap-3">
          <motion.button onClick={saveNotes} disabled={saving}
            whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium text-sm disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {saving ? 'Opslaan...' : 'Wijzigingen opslaan'}
          </motion.button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-6 py-3 text-text-muted hover:text-white rounded-xl text-sm border border-white/10 hover:border-white/20 transition-all"
          >
            <FileText className="w-4 h-4" />
            PDF afdrukken
          </button>
        </div>
      </div>
    </div>
  )
}
