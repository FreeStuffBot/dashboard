import API from '~/lib/api'


export const state = () => ({
  environment: 'production',
  loginStatus: 'pending' // pending, guest, success, disconnected
})


export const mutations = {
  updateLoginStatus(state, data) {
    state.loginStatus = data
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
      store.commit('updateLoginStatus', 'disconnected')
      window.$nuxt.$router.push('/login')
    } else if (user.status !== 200) {
      store.commit('user/updateUser', null)
      store.commit('updateLoginStatus', 'guest')
      window.$nuxt.$router.push('/login')
    } else {
      store.commit('user/updateUser', user.data)
      store.commit('updateLoginStatus', 'success')
      user.gitData
      user.lang
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
  getLanguagesAsArray: (state) => {
    const langs = state.data?.project?.languages
    const out = []
    for (const id in langs) {
      out.push({
        id,
        data: langs[id]
      })
    }
    return out
  }
}
