
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
  id: '',
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
  guilds: [ ],
  allNotifications: [ ],
  readNotifications: [ ],
  unreadNotifications: [ ],
})

export const mutations = {
  updateUser(state, data) {
    if (!data?.data) return

    for (const key of Object.keys(data.data)) {
      // @ts-ignore
      state[key] = data.data[key]
    }
    state.scope = data.scope

    state.avatarUrl = state.avatar
      ? `https://cdn.discordapp.com/avatars/${state.id}/${state.avatar}.png`
      : `https://cdn.discordapp.com/embed/avatars/${state.discriminator % 5}.png`

    state.readNotifications = data.notifications.filter(n => n.readAt)
    state.unreadNotifications = data.notifications.filter(n => !n.readAt)
    state.allNotifications = [ ...state.unreadNotifications, ...state.readNotifications ]

    if (!state.guilds) return
    updateGuilds(state, state.guilds)
  },
  markNotificationAsRead(state, id) {
    const idx = state.unreadNotifications.findIndex(n => n.id === id)
    if (idx < 0) return
    const notif = state.unreadNotifications.splice(idx, 1)[0]
    state.readNotifications.push(notif)
    notif.readAt = Date.now()
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
  },
  languagesInMaintainerScope(state) {
    if (state.scope.includes('admin')) return [ '*' ]
    return state.scope.filter(e => e.startsWith('langmain')).map(e => e.substr('langmain.'.length))
  }
}
