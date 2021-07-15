<template>
  <div id="app">
    <div id="wrapper">
      <nuxt />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  created() {
  }
}
</script>

<style scoped lang="scss">
@import '~/assets/style/all.scss';

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
