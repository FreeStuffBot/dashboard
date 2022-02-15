<template>
  <div id="layout">
    <div v-if="$store.state.loginStatus === 'success'" id="app">
      <Sidebar />
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
import Sidebar from '../components/sidebar/Sidebar.vue'

export default Vue.extend({
  components: {
    Sidebar
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

#wrapper {
  flex-grow: 1;
  overflow-x: hidden;
  padding: $box-outer-padding;
  animation: wrapper-fadein .4s cubic-bezier(0.34, 1.56, 0.64, 1) .5s forwards;

  // &::-webkit-scrollbar { width: 14px; height: 0; }
  // &::-webkit-scrollbar-track { background-color: transparent; }
  // &::-webkit-scrollbar-thumb { background-color: $bg-bright; border-radius: 99px; border: 4px solid $backpage; }
  // &::-webkit-scrollbar-thumb:hover { background-color: $bg-brighter }
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
