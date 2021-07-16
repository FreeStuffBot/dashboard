<template>
  <div class="container">
    <div v-if="$store.state.loginStatus === 'guest'" class="panel main">
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
    <div v-else class="panel main">
      Loading...
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import API from '~/lib/api'
import icon from '~/components/icon.vue'

export default Vue.extend({
  components: {
    icon
  },
  layout: 'fullscreen',
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
    if (this.$store.state.loginStatus === 'success')
      this.$router.push('/')
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
.container {
  width: 100%;
  height: 100%;
  display: grid;
  column-gap: 20pt;
  grid-template-columns: 1fr;
  grid-template-areas: "main";
}

.panel {
  height: 100%;
  background-color: $bg-bright;
  border-radius: 3pt;
  padding: 10pt;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &.main { grid-area: main; }

  * { flex-shrink: 0; }
}

.profile {
  background-color: $bg-brighter;
  padding: 16pt;
  margin: 0;
  border-radius: 999pt;

  .icon {
    width: 32pt;
    color: $color-major;
  }
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
</style>
