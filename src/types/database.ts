export interface Company {
  id: string
  user_id: string | null
  naam: string
  kvk: string | null
  contactpersoon: string | null
  email: string | null
  plan: 'gratis' | 'mkb' | 'bureau'
  created_at: string
}

export interface Verzoek {
  id: string
  company_id: string
  verzoek_nummer: string
  status: 'nieuw' | 'in_behandeling' | 'afgerond' | 'verlopen'
  betrokkene_naam: string
  betrokkene_email: string | null
  betrokkene_bsn_partial: string | null
  ontvangen_op: string
  deadline: string
  systemen_gecontroleerd: string[]
  notities: string | null
  antwoord_concept: string | null
  afgerond_op: string | null
  created_at: string
}
