export const state = () => ({
  pending: '⧖ Pending',
  declined: '✕ Declined',
  approved: '✓ Approved',
  published: '✓ Published',
  processing: '… Processing',
  keep: 'Free to Keep',
  timed: 'Free for a Weekend',
  prime: 'Included in Prime',
  gamepass: 'Included in GamePass',
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
