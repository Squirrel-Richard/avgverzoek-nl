'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Shield, Clock, FileText, AlertTriangle, CheckCircle, ArrowRight, Lock } from 'lucide-react'

const features = [
  {
    icon: Clock,
    title: '30-daagse Timer',
    desc: 'Elk inzageverzoek start automatisch een afteller. Dashboard wordt rood als de deadline nadert. Nooit meer te laat.',
    color: '#6366f1',
  },
  {
    icon: CheckCircle,
    title: 'Systemen Checklist',
    desc: 'Doorzoek systematisch alle databases: email, CRM, facturen, HR. Tick per tick aantoonbaar afgewerkt.',
    color: '#14b8a6',
  },
  {
    icon: FileText,
    title: 'Juridisch Correct Antwoord',
    desc: 'NL template conform AVG Art. 15. PDF-export als dossier voor de AP. Bewijs dat je op tijd gehandeld hebt.',
    color: '#22c55e',
  },
]

const stats = [
  { value: '30 dagen', label: 'Wettelijke deadline' },
  { value: '€20M', label: 'Max AP-boete' },
  { value: '1 op 3', label: 'DSAR-klachten: te laat' },
  { value: '90%', label: 'MKB zonder procedure' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: '#0A0A0F' }}>
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.3) 0%, transparent 70%)' }}
        />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <span className="font-bold text-white">AVGVerzoek<span className="text-primary">.nl</span></span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-text-muted hover:text-white transition-colors">Inloggen</Link>
          <Link href="/register">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
            >
              Gratis beginnen
            </motion.button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 text-center px-8 py-24 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-8"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Deadline gemist → risico op €20.000+ AP-boete
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight"
        >
          30 dagen.{' '}
          <span style={{ background: 'linear-gradient(135deg, #6366f1, #14b8a6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Elke keer.
          </span>{' '}
          Geen uitzonderingen.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          AVG inzageverzoeken komen onverwacht. Mis de wettelijke deadline van 30 dagen
          en je riskeert een boete van de Autoriteit Persoonsgegevens.{' '}
          <strong className="text-white">AVGVerzoek.nl regelt het proces automatisch.</strong>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-4 flex-wrap"
        >
          <Link href="/register">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(99,102,241,0.5)' }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-semibold text-lg"
            >
              Gratis beginnen
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
          <div className="text-sm text-text-muted flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            Geen creditcard nodig
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="relative z-10 max-w-4xl mx-auto px-8 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="text-center p-5 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="text-3xl font-black text-primary mb-1">{stat.value}</div>
              <div className="text-xs text-text-muted">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-5xl mx-auto px-8 mb-24">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-3xl font-bold text-white text-center mb-12"
        >
          Alles wat je nodig hebt voor AVG-compliance
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4, boxShadow: `0 20px 40px ${f.color}20` }}
              className="p-6 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${f.color}25` }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: f.color + '15', border: `1px solid ${f.color}30` }}
              >
                <f.icon className="w-6 h-6" style={{ color: f.color }} />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quote */}
      <section className="relative z-10 max-w-3xl mx-auto px-8 mb-24">
        <motion.blockquote
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="p-8 rounded-2xl text-center"
          style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)' }}
        >
          <p className="text-white text-lg italic mb-4">
            &ldquo;De AP verwacht dat organisaties procedures hebben voor inzageverzoeken.
            &apos;We wisten het niet&apos; is geen verweer.&rdquo;
          </p>
          <cite className="text-text-muted text-sm not-italic">
            — Autoriteit Persoonsgegevens, Handleiding AVG 2024
          </cite>
        </motion.blockquote>
      </section>

      {/* Pricing */}
      <section className="relative z-10 max-w-4xl mx-auto px-8 mb-24">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Simpele prijzen</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { plan: 'Gratis', price: '€0', period: '/maand', features: ['1 verzoek/maand', 'Basis 30-daagse timer', 'Checklist', 'Email notificaties'], cta: 'Start gratis', primary: false },
            { plan: 'MKB', price: '€29', period: '/maand', features: ['Onbeperkt verzoeken', 'Email alerts bij deadline', 'Juridisch correcte NL templates', 'PDF-export dossier', 'Antwoord-concept AI-hulp'], cta: 'Start MKB', primary: true },
            { plan: 'Bureau', price: '€99', period: '/maand', features: ['Alles van MKB', 'Meerdere organisaties beheren', 'White-label rapporten', 'AVG-verwerkingsregister', 'Priority support'], cta: 'Start Bureau', primary: false },
          ].map((tier, i) => (
            <motion.div
              key={tier.plan}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl"
              style={{
                background: tier.primary ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.03)',
                border: tier.primary ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.07)',
                boxShadow: tier.primary ? '0 0 40px rgba(99,102,241,0.15)' : 'none',
              }}
            >
              {tier.primary && (
                <div className="text-xs text-primary font-semibold mb-2">MEEST GEKOZEN</div>
              )}
              <div className="text-white font-bold text-xl mb-1">{tier.plan}</div>
              <div className="flex items-baseline gap-1 mb-5">
                <span className="text-4xl font-black text-white">{tier.price}</span>
                <span className="text-text-muted text-sm">{tier.period}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {tier.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-text-muted">
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3 rounded-xl text-sm font-semibold"
                  style={{
                    background: tier.primary ? '#6366f1' : 'rgba(255,255,255,0.06)',
                    color: '#fff',
                    border: tier.primary ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  {tier.cta}
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 px-8 text-center">
        <p className="text-text-muted text-sm mb-2">
          © 2026 AVGVerzoek.nl — AIOW BV · KvK: 12345678
        </p>
        <p className="text-text-faint text-xs">
          AVG inzageverzoek · DSAR tool Nederland · Art 15 AVG compliance · Autoriteit Persoonsgegevens
        </p>
      </footer>
    </div>
  )
}
