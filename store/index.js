import API from '~/lib/api'


export const state = () => ({
  // @deprecated
  environment: 'production',

  // pending, guest, success, disconnected, 404
  loginStatus: 'pending',

  // anything - admin only
  gitData: null,

  // disables scroll on the main scroll element (body) for nested components to open full screen dialogues
  // this is a number so that multiple competing components can all "enable" disableScroll without interfering with others
  // simply add one to enable, subtract one to disable
  disableScroll: 0,

  // a list of popups
  popups: []
})


export const mutations = {
  setLoginStatus(state, data) {
    state.loginStatus = data
  },
  setGitData(state, data) {
    state.gitData = data
  },
  setDisableScroll(state, data) {
    state.disableScroll += data ? 1 : -1
    if (state.disableScroll < 0)
      state.disableScroll = 0
  },
  openPopup(state, data) {
    state.popups.push(data)
    state.disableScroll++
  },
  closePopup(state, index) {
    state.popups.splice(index || (state.popups.length - 1), 1)
    state.disableScroll--
  }
}

export const actions = {
  pageLoad(store) {
    store.dispatch('refetchUser')
  },
  async refetchUser(store) {
    const user = await API.authMe()
    if (user.status === 999) {
      store.commit('user/updateUser', null)
      store.commit('setLoginStatus', 'disconnected')
      window.$nuxt.$router.push('/login')
    } else if (user.status === 404) {
      store.commit('user/updateUser', null)
      store.commit('setLoginStatus', '404')
      window.$nuxt.$router.push('/login')
    } else if (user.status !== 200) {
      store.commit('user/updateUser', null)
      store.commit('setLoginStatus', 'guest')
      window.$nuxt.$router.push('/login')
    } else {
      store.commit('user/updateUser', user.data)
      store.commit('setLoginStatus', 'success')
      store.commit('lang/loaded', user.data.lang)
      store.commit('setGitData', user.data.gitData)
    }
  },
  async refetchLines(store, data) {
    const { data: lines } = await API.getLines(data, true)
    if (lines) store.commit('updateLines', lines)
  }
}

export const getters = {
  getLanguages: (state) => {
    return state.data?.project?.languages || {}
  },
  getLanguagesAsArray: () => {
    return []
  }
}
