<template>
  <div class="container">
    <h1>FreeStuff API</h1>
    <p>Hey there! Are you interested in using the FreeStuff API? Well you've come to the right place!</p>
    <p>Check out the documentation on the left or head over to Patreon for API access!</p>
    <Button
      type="green"
      text="Get Access"
      @click="openPatreon()"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Button from '~/components/entities/Button.vue'

export default Vue.extend({
  components: {
    Button
  },
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
