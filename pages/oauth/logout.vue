<template>
  <div class="container">
    <div class="panel main">
      Loading...
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  layout: 'fullscreen',
  fetchOnServer: false,
  mounted() {
    localStorage.clear()
    this.$router.replace('/login')
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
  border-radius: 5pt;
  padding: 10pt;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &.main { grid-area: main; }

  * { flex-shrink: 0; }
}
</style>
