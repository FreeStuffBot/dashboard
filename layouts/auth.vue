<template>
  <div id="app">
    <div class="panel">
      <nuxt class="container" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
})
</script>

<style scoped lang="scss">
#app {
  background-color: $backpage;
  position: absolute;
  display: flex;
  height: 100vh;
  inset: 0;
}

.panel {
  position: absolute;
  width: calc(#{$box-width} + #{$box-outer-padding} * 2);
  height: 100%;
  top: 0;
  left: 0;
  padding: 20pt;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 1fr;
}

.container {
  height: 100%;
  background-color: $bg-light;
  border-radius: 3pt;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20pt;
  box-sizing: border-box;
  font-family: $font-regular;
  color: $color-sub;
  font-size: 12pt;
  text-align: center;

  * { flex-shrink: 0; }
}
</style>
