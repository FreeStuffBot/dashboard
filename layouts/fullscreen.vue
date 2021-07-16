<template>
  <div id="app">
    <div id="wrapper">
      <nuxt />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  mounted() {
    this.$store.dispatch('pageLoad')
  }
})
</script>

<style scoped lang="scss">
html, body, #app {
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

#app {
  background-color: $backpage;
  display: flex;
  height: 100vh;
}

#wrapper {
  flex-grow: 1;
  overflow-x: hidden;
  padding: $box-outer-padding;
}

</style>
