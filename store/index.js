
export const state = () => ({
  environment: 'production',
  gitCommit: undefined
})

export const actions = {
  async nuxtServerInit({ state, commit }, { res, redirect }) {
    state.environment = process.env.NODE_ENV

    // if (!req.session || !req.session.user) return;
    if (!res.locals.clientInit) { // TODO
      // if (redirect) redirect('/oauth/login');
    } else {
      const client = await res.locals.clientInit()
      if (client?.user) {
        commit('user/login', JSON.parse(JSON.stringify(client.user)))
        this.state.gitCommit = client.gitCommit
        commit('lang/loaded', client.lang)
      } else if (redirect) { redirect('/oauth/login') }
    }
  }
}
