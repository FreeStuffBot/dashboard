<template>
  <div id="layout">
    <div v-if="$store.state.loginStatus === 'success'" id="app">
      <div id="sidebar">
        <div class="container">
          <div v-if="dev" class="devnotice">
            Dev Env
          </div>
          <div id="header">
            <img src="~/assets/img/logo.png" alt="Logo">
            <div class="title">
              <span class="line1">FreeStuff</span>
              <span class="line2">Dashboard</span>
            </div>
          </div>
          <SidebarNav />
          <footer>
            Copyright &copy; {{ new Date().getYear() + 1900 }} FreeStuff Services
          </footer>
        </div>
      </div>
      <div id="wrapper">
        <nuxt />
      </div>
    </div>
    <div id="loader">
      <span>&bull; &bull; &bull;</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SidebarNav from '~/components/SidebarNav.vue'

Vue.use(require('vue-tippy').default, {
  arrow: true,
  arrowType: 'round',
  animation: 'vertical',
  duration: 100,
  theme: 'black'
})
Vue.component('tippy', require('vue-tippy').TippyComponent)


export default Vue.extend({
  components: {
    SidebarNav
  },
  data() {
    return {
      dev: process.env.NODE_ENV !== 'production'
    }
  },
  mounted() {
    this.$store.dispatch('pageLoad')
  }
})
</script>

<style scoped lang="scss">
html, body, #layout, #app {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

[rate-limit] { visibility: hidden; }

#layout {
  background-color: $backpage;
}

#loader {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  z-index: 1;

  * {
    font-family: $font-regular;
    color: $color-regular;
    font-size: 13pt;
  }
}

#app {
  z-index: 10;
  background-color: $backpage;
  display: flex;
  opacity: 0;
  animation: app-fadein .2s ease-out .5s forwards;
}

@keyframes app-fadein {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

#sidebar {
  background-color: $bg-dark;
  height: 100vh;
  overflow-x: hidden;
  padding: 0 $box-outer-padding;
  max-width: 18vw;
  animation: sidebar-fadein .3s ease-out .5s forwards;

  .container {
    padding: $box-outer-padding 0;
    min-height: calc(100vh - #{$box-outer-padding * 2});
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  #header {
    display: flex;
    align-items: center;
    margin-bottom: $box-padding;
    margin-right: $box-outer-padding * 2;

    img {
      border-radius: 99pt;
      height: 4vw;
      margin-right: $box-padding;
    }

    .title {
      display: flex;
      flex-direction: column;

      * {
        font-family: $font-header;
        font-size: 1.8vw;
        margin: -0.2vw;
      }

      .line1 { color: $primary-blue; }
      .line2 { color: $primary-pink; }
    }
  }

  nav {
    flex-grow: 1;
  }

  footer {
    font-family: $font-minor;
    font-size: 10pt;
    color: $color-minor;
    width: 100%;
    text-align: center;
    margin-top: $box-outer-padding;
  }

  &::-webkit-scrollbar { width: 14px; height: 0; }
  &::-webkit-scrollbar-track { background-color: transparent; }
  &::-webkit-scrollbar-thumb { background-color: $bg-bright; border-radius: 99px; border: 4px solid $bg-dark; }
  &::-webkit-scrollbar-thumb:hover { background-color: $bg-brighter }
  // &:not(:hover)::-webkit-scrollbar-thumb { background-color: transparent; }
}

@keyframes sidebar-fadein {
  0% { transform: translateX(-10px); }
  100% { transform: translateX(0); }
}

#wrapper {
  flex-grow: 1;
  overflow-x: hidden;
  padding: $box-outer-padding;
  animation: wrapper-fadein .4s cubic-bezier(0.34, 1.56, 0.64, 1) .5s forwards;

  &::-webkit-scrollbar { width: 14px; height: 0; }
  &::-webkit-scrollbar-track { background-color: transparent; }
  &::-webkit-scrollbar-thumb { background-color: $bg-bright; border-radius: 99px; border: 4px solid $backpage; }
  &::-webkit-scrollbar-thumb:hover { background-color: $bg-brighter }
}

@keyframes wrapper-fadein {
  0% { transform: translateY(30px); }
  100% { transform: translateY(0); }
}
</style>

<style lang="scss">
.container {
  width: 100%;
  max-width: 550pt;
}

.devnotice {
  display: block;
  padding: 5px 0;
  text-align: center;
  background-color: $warning-minor;
  transform: translate(-$box-outer-padding, -$box-outer-padding);
  width: calc(100% + #{$box-outer-padding * 2});
  font-family: $font-major;
  font-size: 12pt;
  text-transform: uppercase;
}
</style>
