import { z } from 'zod'

export interface DropdownCountry {
  name: string
  countryCode: string
  date: string
  localName: string
  global: boolean
  counties: string | null
  launchYear: number | null
  types: ('Public' | 'Bank' | 'School' | 'Authorities' | 'Optional' | 'Observance')[]
}

export const publicHolidaysSchema = z.object({
  year: z.number(),
  countryCode: z
    .string()
    .min(2, 'Country code must be at least 2 characters')
    .max(2, 'Country code must be at most 2 characters'),
})

interface PublicHoliday {
  date: string
  localName: string
  name: string
  countryCode: string
  global: boolean
  counties: string | null
  launchYear: number | null
  types: ('Public' | 'Bank' | 'School' | 'Authorities' | 'Optional' | 'Observance')[]
}

export type { PublicHoliday }
