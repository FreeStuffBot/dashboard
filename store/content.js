import API from '~/lib/api'


export const state = () => ({
  platforms: [],
  currencies: []
})

export const mutations = {
  update(state, { name, value }) {
    state[name] = value
  }
}

export const actions = {
  async load(store, name) {
    let value

    if (name === 'platforms')
      value = (await API.getPlatformList()).data
    else if (name === 'currencies')
      value = (await API.getCurrencyList()).data

    if (value)
      store.commit('update', { name, value })
  }
}
