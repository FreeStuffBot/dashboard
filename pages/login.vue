<template>
  <div class="container">
    <div v-if="$store.state.loginStatus === 'guest'">
      <h1>Login to FreeStuff</h1>
      <div class="login-with">
        <a
          v-for="provider of authProviders"
          :key="provider.name"
          :style="`--c: ${provider.color}; --h: ${provider.colorhover}`"
          class="auth-button"
          @click="loginWith(provider.uri)"
        >
          <icon :name="provider.icon" />
          <span>
            Continue with {{ provider.name }}
          </span>
        </a>
      </div>
    </div>
    <div v-else-if="$store.state.loginStatus === 'disconnected'">
      Cannot reach FreeStuff servers...<br>
      Are you offline?
    </div>
    <div v-else-if="$store.state.loginStatus === '404'">
      The dashboard is temporarily not available due to maintenance. Check our Discord for status and news.
    </div>
    <div v-else>
      Loading...
    </div>
    <div class="floater">
      v2.0
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import API from '~/lib/api'

export default Vue.extend({
  layout: 'auth',
  data() {
    return {
      authProviders: [
        { name: 'Discord', icon: 'discord', color: '#5865F2', colorhover: '#707ae6', uri: 'discord' }
      ]
    }
  },
  watch: {
    '$store.state.loginStatus'(status) {
      if (status === 'success')
        this.$router.push('/')
    }
  },
  mounted() {
    this.$store.dispatch('pageLoad')
  },
  methods: {
    async loginWith(provider: string) {
      const { data } = await API.authLogin(provider)
      if (!data.url) return alert('Something went wrong. Please try again.')
      window.location = data.url
    }
  }
})
</script>

<style scoped lang="scss">

h1 {
  margin-bottom: 20pt;
}

.login-with {
  margin-top: 10pt;
  width: 300px;
}

.auth-button {
  width: 100%;
  margin: 0 0 10pt 0;
  border-radius: 4pt;
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr;
  background-color: var(--c);
  border: 4px solid var(--c);
  cursor: pointer;
  transition: background-color .1s ease
            , border-color .1s ease;
  box-shadow: 0 2px 10px #00000011;

  &:hover, &:focus-within {
    background-color: var(--h);
    border-color: var(--h);
  }

  span {
    color: #ffffff;
    font-family: $font-major;
    font-size: 12pt;
    text-align: center;
    margin: 0 8pt;
  }

  .icon {
    width: 24pt;
    padding: 6pt;
    height: 24pt;
    margin: 0;
    cursor: text;
    color: var(--c);
    background-color: #ffffff;
    transition: color .1s ease;
    border-radius: 3pt;
    pointer-events: none;
  }
}

.floater {
  position: absolute;
  bottom: 30pt;
  right: 30pt;
  color: $color-minor;
  font-family: $font-minor;
  font-size: 9pt;
}
</style>
