import { describe, expect, it } from 'vitest'
import { addMoney, formatMoneyCAD } from './money'

describe('money', () => {
  it('adds cents without floating point drift', () => {
    expect(addMoney(1010, 2020)).toBe(3030)
  })

  it('formats cents as CAD currency', () => {
    // Intl.NumberFormat may use a narrow no-break space as the group
    // separator depending on the ICU data available; normalize all
    // Unicode space-separator characters before comparing.
    const normalize = (value: string) => value.replace(/\p{Zs}/gu, ' ')
    expect(normalize(formatMoneyCAD(303000))).toBe('3 030,00 $')
  })
})
