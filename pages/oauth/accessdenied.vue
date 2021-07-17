<template>
  <div class="container">
    <span>Boop boop. You have to click on "Authorize" in order to continue!</span><br>
    <a href="./login">Try again</a>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  layout: 'auth'
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
