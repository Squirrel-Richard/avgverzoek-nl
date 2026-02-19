import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'AVGVerzoek.nl — AVG Inzageverzoek Workflow voor NL MKB',
  description: 'Beheer AVG inzageverzoeken (DSAR) moeiteloos. 30-daagse timer, juridisch correcte NL templates, automatische checklists. Verplicht voor elke NL organisatie die persoonsdata verwerkt.',
  keywords: 'AVG inzageverzoek, DSAR Nederland, GDPR inzageverzoek, Art 15 AVG, Autoriteit Persoonsgegevens, privacyverzoek, persoonsgegevens opvragen',
  openGraph: {
    title: 'AVGVerzoek.nl — Beheer AVG Inzageverzoeken Automatisch',
    description: 'Mis de 30-daagse deadline niet. AP-boetes tot €20M vermijden. Simpele workflow voor NL MKB.',
    type: 'website',
    locale: 'nl_NL',
    url: 'https://avgverzoek-nl.vercel.app',
  },
  robots: 'index, follow',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body>
        {children}
        <Toaster position="bottom-right" theme="dark" />
      </body>
    </html>
  )
}
