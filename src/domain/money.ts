// Money is stored and computed as integer cents — never floats
// (docs/16-Development-Standards.md §25).
export type MoneyCents = number

export function addMoney(a: MoneyCents, b: MoneyCents): MoneyCents {
  return a + b
}

export function formatMoneyCAD(cents: MoneyCents): string {
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(cents / 100)
}
