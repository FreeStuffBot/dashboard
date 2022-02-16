<template>
  <div id="root">
    <div v-if="showApp" id="app">
      <Sidebar />
      <div id="wrapper">
        <nuxt />
      </div>
    </div>

    <div id="loader" :hide="showApp">
      <span>&bull; &bull; &bull;</span>
    </div>

    <div id="popups">
      <PopupsRenderer />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Sidebar from '../components/sidebar/Sidebar.vue'
import PopupsRenderer from '../components/scaffolding/PopupsRenderer.vue'

export default Vue.extend({
  components: {
    Sidebar,
    PopupsRenderer
  },
  data() {
    return {
      scrollFreeze: false,
      transitionDirection: '',
      prevRoutePath: '',
      prevRouteDepth: 0,
      prevRouteProject: '',
      dev: process.env.NODE_ENV !== 'production'
    }
  },
  computed: {
    showApp() {
      return this.$store.state.loginStatus === 'success'
    }
  },
  fetchOnServer: false,
  watch: {
    $route: {
      deep: true,
      handler(route: any) {
        // #region Page transitions
        let depth = route.name.split('-').length
        if (!route.name.startsWith('index')) depth++

        const fullPath = route.fullPath.split('?')[0]
        const sameOrigin = (this.prevRoutePath.startsWith(fullPath) || fullPath.startsWith(this.prevRoutePath))

        if (!sameOrigin)
          this.transitionDirection = ''
        else if (depth > this.prevRouteDepth)
          this.transitionDirection = 'right'
        else if (depth < this.prevRouteDepth)
          this.transitionDirection = 'left'
        else
          this.transitionDirection = ''

        this.prevRouteDepth = depth
        this.prevRoutePath = fullPath
        // #endregion
      }
    },
    '$store.state.disableScroll'(value: number) {
      if (!value) {
        this.scrollFreeze = false
        if (document.body.parentElement)
          document.body.parentElement.style.overflow = ''
      } else if (!this.scrollFreeze) {
        this.scrollFreeze = true
        if (document.body.parentElement)
          document.body.parentElement.style.overflow = 'hidden'
      }
    }
  },
  mounted() {
    this.$store.dispatch('pageLoad')
    this.prevRoutePath = this.$route.fullPath
  }
})
</script>

<style scoped lang="scss">
html, body, #root, #app {
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
  background-color: $backpage;
  z-index: 10;

  &[hide] {
    animation: loader-fadeout .2s ease-out 1s forwards;
  }

  * {
    font-family: $font-regular;
    color: $color-regular;
    font-size: 13pt;
  }
}

#app {
  z-index: 5;
  background-color: $backpage;
  display: flex;
}

#popups {
  position: fixed;
  top: 0;
  left: 0;
  width: min-content;
  height: min-content;
  padding: 0;
  margin: 0;
  z-index: 15;
}

@keyframes loader-fadeout {
  0% { opacity: 1; }
  99% { opacity: 0; visibility: visible; }
  100% { opacity: 0; visibility: hidden; }
}

#wrapper {
  flex-grow: 1;
  overflow-x: hidden;
  padding: $box-outer-padding;
  animation: wrapper-fadein .4s cubic-bezier(0.34, 1.56, 0.64, 1) .5s forwards;

  // &::-webkit-scrollbar { width: 14px; height: 0; }
  // &::-webkit-scrollbar-track { background-color: transparent; }
  // &::-webkit-scrollbar-thumb { background-color: $bg-light; border-radius: 99px; border: 4px solid $backpage; }
  // &::-webkit-scrollbar-thumb:hover { background-color: $bg-lighter }
  &::-webkit-scrollbar { width: 0; height: 0; }
  &::-webkit-scrollbar-track { background-color: transparent; }
  &::-webkit-scrollbar-thumb { background-color: transparent; }
  &::-webkit-scrollbar-thumb:hover { background-color: transparent; }
}

@keyframes wrapper-fadein {
  0% { transform: translateY(30px); }
  100% { transform: translateY(0); }
}
</style>
