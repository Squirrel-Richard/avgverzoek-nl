'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Verzoek } from '@/types/database'
import {
  Shield, Plus, Clock, CheckCircle, AlertTriangle,
  FileText, LogOut, Loader2, ChevronRight
} from 'lucide-react'

const STATUS_LABELS: Record<string, string> = {
  nieuw: 'Nieuw',
  in_behandeling: 'In behandeling',
  afgerond: 'Afgerond',
  verlopen: 'Verlopen',
}
const STATUS_COLORS: Record<string, string> = {
  nieuw: '#3B82F6',
  in_behandeling: '#F97316',
  afgerond: '#22C55E',
  verlopen: '#EF4444',
}

function daysLeft(deadline: string) {
  const diff = new Date(deadline).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function DeadlineBadge({ deadline }: { deadline: string }) {
  const days = daysLeft(deadline)
  const color = days <= 0 ? '#EF4444' : days <= 7 ? '#EF4444' : days <= 14 ? '#F97316' : '#22C55E'
  const label = days <= 0 ? 'Verlopen!' : days === 1 ? '1 dag' : `${days} dagen`
  return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: color + '20', color, border: `1px solid ${color}40` }}>
      {label}
    </span>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [verzoeken, setVerzoeken] = useState<Verzoek[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchVerzoeken() }, [])

  async function fetchVerzoeken() {
    setLoading(true)
    const { data, error } = await supabase
      .from('verzoeken')
      .select('*')
      .order('ontvangen_op', { ascending: false })
    if (!error && data) setVerzoeken(data as Verzoek[])
    setLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  const urgent = verzoeken.filter(v => v.status !== 'afgerond' && v.status !== 'verlopen' && daysLeft(v.deadline) <= 7)
  const open = verzoeken.filter(v => v.status === 'nieuw' || v.status === 'in_behandeling')
  const afgerond = verzoeken.filter(v => v.status === 'afgerond')

  return (
    <div className="min-h-screen" style={{ background: '#0A0A0F' }}>
      {/* Sidebar */}
      <nav className="fixed left-0 top-0 h-full w-60 z-50 flex flex-col"
        style={{ background: 'rgba(6,6,15,0.9)', backdropFilter: 'blur(30px)', borderRight: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold text-white text-sm">AVGVerzoek<span className="text-primary">.nl</span></span>
          </div>
        </div>
        <div className="p-4">
          <Link href="/verzoek/nieuw">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(99,102,241,0.3)' }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/20 border border-primary/30 text-primary text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Nieuw Verzoek
            </motion.button>
          </Link>
        </div>
        <div className="flex-1 px-3 py-2">
          {[
            { href: '/dashboard', icon: FileText, label: 'Verzoeken' },
          ].map(item => (
            <motion.div key={item.href} whileHover={{ x: 3 }} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-primary bg-primary/10 border border-primary/15">
              <item.icon className="w-4 h-4 text-primary" />
              {item.label}
            </motion.div>
          ))}
        </div>
        <div className="p-4 border-t border-white/5">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-all">
            <LogOut className="w-4 h-4" />
            Uitloggen
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="ml-60 p-8">
        {/* Urgent banner */}
        <AnimatePresence>
          {urgent.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-xl flex items-center gap-3"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
            >
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span className="text-red-300 font-medium text-sm">
                ⚠️ {urgent.length} {urgent.length === 1 ? 'verzoek nadert' : 'verzoeken naderen'} de 30-daagse deadline!
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">AVG Inzageverzoeken</h1>
            <p className="text-text-muted mt-1">{loading ? '...' : `${open.length} open · ${afgerond.length} afgerond`}</p>
          </div>
          <Link href="/verzoek/nieuw">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-medium text-sm"
            >
              <Plus className="w-4 h-4" />
              Nieuw verzoek
            </motion.button>
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Open', value: open.length, icon: Clock, color: '#3B82F6' },
            { label: 'Urgent (< 7 dagen)', value: urgent.length, icon: AlertTriangle, color: '#EF4444' },
            { label: 'Afgerond', value: afgerond.length, icon: CheckCircle, color: '#22C55E' },
          ].map(s => (
            <motion.div key={s.label} whileHover={{ y: -2 }}
              className="p-5 rounded-2xl flex items-center gap-4"
              style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${s.color}20` }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.color + '15' }}>
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <div>
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="text-xs text-text-muted">{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Verzoeken list */}
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : verzoeken.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <Shield className="w-16 h-16 text-text-faint mx-auto mb-4 opacity-20" />
            <h3 className="text-white font-medium mb-2">Nog geen verzoeken</h3>
            <p className="text-text-muted text-sm mb-6">Ontvang je eerste AVG inzageverzoek? Log het hier direct.</p>
            <Link href="/verzoek/nieuw">
              <motion.button whileHover={{ scale: 1.05 }} className="px-6 py-3 bg-primary text-white rounded-xl font-medium text-sm">
                Eerste verzoek loggen
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {verzoeken.map((v, i) => (
              <motion.div key={v.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/verzoek/${v.id}`}>
                  <motion.div
                    whileHover={{ x: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}
                    className="flex items-center gap-4 p-5 rounded-2xl cursor-pointer"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white font-medium">{v.betrokkene_naam}</span>
                        <span className="text-xs text-text-muted font-mono">{v.verzoek_nummer}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: STATUS_COLORS[v.status] + '20', color: STATUS_COLORS[v.status], border: `1px solid ${STATUS_COLORS[v.status]}40` }}>
                          {STATUS_LABELS[v.status]}
                        </span>
                      </div>
                      <div className="text-xs text-text-muted mt-0.5">
                        Ontvangen: {new Date(v.ontvangen_op).toLocaleDateString('nl-NL')}
                        {v.betrokkene_email && <span className="ml-3">{v.betrokkene_email}</span>}
                      </div>
                    </div>
                    {v.status !== 'afgerond' && <DeadlineBadge deadline={v.deadline} />}
                    <ChevronRight className="w-4 h-4 text-text-muted" />
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
