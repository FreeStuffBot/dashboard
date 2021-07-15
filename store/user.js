
function updateGuilds(state, guilds) {
  for (const guild of guilds) {
    guild.image = guild.icon
      ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
      : '/assets/img/defaulticon.png'

    guild.imageHover = guild.icon && guild.icon.startsWith('a_') && guild.features.includes('ANIMATED_ICON')
      ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.gif`
      : undefined
  }
  state.guilds = guilds
}

//

export const state = () => ({
  username: '',
  avatar: '',
  avatarUrl: '',
  discriminator: '',
  public_flags: 0,
  flags: 0,
  email: '',
  verified: false,
  locale: '',
  mfa_enabled: false,
  scope: [ ],
  guilds: [ ]
})

export const mutations = {
  login(state, data) {
    for (const key of Object.keys(data.data)) {
      // @ts-ignore
      state[key] = data.data[key]
    }

    state.avatarUrl = state.avatar
      ? `https://cdn.discordapp.com/avatars/${state.id}/${state.avatar}.png`
      : `https://cdn.discordapp.com/embed/avatars/${state.discriminator % 5}.png`

    if (!state.guilds) return
    updateGuilds(state, state.guilds)
  },
  updateGuilds
}

export const getters = {
  isAdmin(state) {
    return state.scope.includes('admin')
  },
  isContentMod(state) {
    return state.scope.includes('admin') || state.scope.includes('contentmod')
  },
  isContributor(state) {
    return state.scope.includes('admin') || state.scope.includes('contributor') || state.scope.includes('contentmod') || !!state.scope.filter(e => e.startsWith('translate')).length
  },
  isTranslator(state) {
    return state.scope.includes('admin') || !!state.scope.filter(e => e.startsWith('translate')).length
  },
  apiAccess(state) {
    if (state.scope.includes('partner') || state.scope.includes('admin')) return 'partner'
    else if (state.scope.includes('api')) return 'basic'
    return ''
  },
  languagesInTranslationScope(state) {
    if (state.scope.includes('admin')) return [ '*' ]
    return state.scope.filter(e => e.startsWith('translate')).map(e => e.substr('translate.'.length))
  }
}