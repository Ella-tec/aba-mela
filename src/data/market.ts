export const MELA_MARKET = {
  name: 'Kansas City Metro',
  primaryCity: 'Kansas City',
  primaryState: 'MO',
  timezone: 'America/Chicago',
  currency: 'USD',
  locale: 'en-US',
  mapCenter: { lat: 39.0997, lng: -94.5786 },
  serviceAreas: [
    { city: 'Kansas City', state: 'MO', lat: 39.0997, lng: -94.5786, status: 'planned' },
    { city: 'North Kansas City', state: 'MO', lat: 39.1300, lng: -94.5710, status: 'planned' },
    { city: 'Independence', state: 'MO', lat: 39.0911, lng: -94.4155, status: 'planned' },
    { city: "Lee's Summit", state: 'MO', lat: 38.9108, lng: -94.3822, status: 'planned' },
    { city: 'Liberty', state: 'MO', lat: 39.2461, lng: -94.4191, status: 'planned' },
    { city: 'Overland Park', state: 'KS', lat: 38.9822, lng: -94.6708, status: 'planned' },
    { city: 'Olathe', state: 'KS', lat: 38.8814, lng: -94.8191, status: 'planned' },
    { city: 'Shawnee', state: 'KS', lat: 39.0228, lng: -94.7152, status: 'planned' },
  ] as const,
} as const;

export const formatUsd = (amount: number) =>
  new Intl.NumberFormat(MELA_MARKET.locale, {
    style: 'currency',
    currency: MELA_MARKET.currency,
    maximumFractionDigits: 2,
  }).format(amount);
