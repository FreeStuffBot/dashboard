<template>
  <div class="container">
    <span>You have to login, dude!</span><br>
    <a href="/oauth/login">Login</a>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  layout: 'fullscreen'
})
</script>

<style scoped lang="scss">
@import '~/assets/style/all.scss';

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
