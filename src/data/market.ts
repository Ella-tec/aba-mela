export const MELA_MARKET = {
  name: 'Kansas City Metro',
  primaryCity: 'Kansas City',
  primaryState: 'MO',
  timezone: 'America/Chicago',
  currency: 'USD',
  locale: 'en-US',
  mapCenter: { lat: 39.0997, lng: -94.5786 },
  serviceAreas: [
    { city: 'Kansas City', state: 'MO', status: 'planned' },
    { city: 'North Kansas City', state: 'MO', status: 'planned' },
    { city: 'Independence', state: 'MO', status: 'planned' },
    { city: "Lee's Summit", state: 'MO', status: 'planned' },
    { city: 'Liberty', state: 'MO', status: 'planned' },
    { city: 'Overland Park', state: 'KS', status: 'planned' },
    { city: 'Olathe', state: 'KS', status: 'planned' },
    { city: 'Shawnee', state: 'KS', status: 'planned' },
  ] as const,
} as const;

export const formatUsd = (amount: number) =>
  new Intl.NumberFormat(MELA_MARKET.locale, {
    style: 'currency',
    currency: MELA_MARKET.currency,
    maximumFractionDigits: 2,
  }).format(amount);
