<template>
  <div class="container">
    <h1>FreeStuff API</h1>
    <span>Hey there! Are you interested in using the FreeStuff API? Well you've come to the right place!</span>
    <br>
    <br>
    <span>Check out the documentation on the left or head over to Patreon for API access!</span>
    <br>
    <br>
    <button generic dark @click="openPatreon()">
      Get Access
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'


export default Vue.extend({
  transition: 'slide-down',
  fetchOnServer: false,
  methods: {
    openPatreon() {
      window.open('https://freestuffbot.xyz/o/patreon', '_blank')
    }
  },
  head() {
    return {
      title: 'FreeStuff API'
    }
  }
})
</script>

<style scoped lang="scss">
span {
  color: white;
  font-family: $font-regular;
  font-size: 11pt;

  &[minor] { color: #888888; }
}
</style>
