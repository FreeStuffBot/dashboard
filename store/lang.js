export const state = () => ({
  pending: 'Approval Pending',
  declined: 'Declined',
  approved: 'Approved',
  free: 'Free to Keep',
  weekend: 'Free for a Weekend',
  discount: 'Discount',
  ad: 'Advertisement',
  unknown: 'Unknown',
  steam: 'Steam',
  epic: 'Epic Games Store',
  humble: 'Humble Bundle',
  gog: 'GOG.com',
  origin: 'Origin',
  uplay: 'Uplay',
  twitch: 'Twitch',
  itch: 'Itch.io',
  discord: 'Discord Store',
  apple: 'Apple App Store (mobile)',
  google: 'Google Play Store (mobile)',
  switch: 'Nintendo Switch Store',
  ps: 'Play Station',
  xbox: 'Xbox',
  other: 'Other',
  game: 'Game',
  dlc: 'DLC',
  software: 'Other Software',
  art: 'Digital Art',
  ost: 'Original Soundtrack',
  book: 'Book or Literature',
  0: 'System'
})

export const mutations = {
  loaded(state, data) {
    for (const key of Object.keys(data)) {
      // @ts-ignore
      state[key] = data[key]
    }
  }
}
