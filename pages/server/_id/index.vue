<template>
  <div v-if="guild" class="container">
    <h1 v-text="guild.name" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  components: {
  },
  data() {
    return {
      guild: this.$store.state.user.guilds
        ? this.$store.state.user.guilds.find((g: any) => g.id === this.$route.params.id)
        : undefined
    }
  },
  transition: 'slide-down',
  head() {
    return {
      // @ts-ignore
      title: 'FreeStuff Edit ' + this.guild.name
    }
  }
})
</script>

<style scoped lang="scss">
@import '~/assets/style/all.scss';

.container {
  max-width: 40vw;
}

span {
  color: white;
  font-family: $font-regular;
  font-size: 11pt;

  &[minor] { color: #888888; }
}

</style>
