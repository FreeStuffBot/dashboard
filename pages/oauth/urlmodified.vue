<template>
  <div class="container">
    <span>Boop boop. Please do not edit the url! We need all of the information we ask for.</span><br>
    <span>Expected "{{ expected }}" but got "{{ got }}"</span><br>
    <a href="./login">Try again</a>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  layout: 'fullscreen',
  asyncData({ query }) {
    return {
      expected: query.expected,
      got: query.got
    }
  }
})
</script>

<style scoped lang="scss">
span {
  color: white;
  font-family: $font-regular;
  font-size: 11pt;
  display: block;
}

a {
  text-decoration: none;
  color: $color-minor;
  font-family: $font-minor;
  font-size: 9pt;
  display: inline-block;
  padding: 20px;
  transform: translate(-20px, -20px);
  transition: color .1s ease;

  &:hover { color: $color-regular }
}

</style>
