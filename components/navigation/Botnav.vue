<template>
  <section name="botnav">
    <nav>
      <NuxtLink
        v-for="link of navlinks"
        :key="link.url"
        :to="link.url"
        class="link"
        :subpages="link.url !== '/'"
      >
        <div class="icon-wrapper">
          <img
            class="i"
            :src="link.icon"
            alt="icon"
            draggable="false"
            :title="link.secret"
          >
        </div>
        <div class="text-wrapper">
          <span v-text="link.name" />
        </div>
      </NuxtLink>
    </nav>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      navlinks: [
        {
          name: this.$store.state.user.global_name,
          url: '/',
          icon: this.$store.state.user.avatarUrl
        },
        {
          name: 'Translating',
          url: '/translate',
          icon: '/assets/img/peepolang.png'
        },
        {
          name: 'Content',
          url: '/content',
          icon: '/assets/img/peepolove.png'
        }
      ]
    }
  }
})
</script>

<style scoped lang="scss">
section {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: $zindex-sidebar;
  background-color: $backpage;
  height: $botnav-height;
  overflow: hidden;
  width: 100vw;
  border-top: 1px solid $color-border;
  box-sizing: border-box;
}

nav {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(50pt, 1fr));
  margin: 3pt;
  gap: 3pt;
}

.link {
  display: grid;
  text-decoration: none;
  grid-template-rows: 1fr auto;
  align-items: center;
  justify-content: center;
  padding: 4pt;
  height: 100%;
  border-radius: 3pt;
  box-sizing: border-box;

  &.nuxt-link-exact-active, &[subpages].nuxt-link-active {
    background-color: $bg-lighter;
    span { color: $color-major !important; }

    img.a { visibility: visible !important; }
    img.h { visibility: hidden; }

    &::after { transition: none; }
  }

  .icon-wrapper {
    display: flex;
    justify-content: center;

    .i {
      width: min-content;
      aspect-ratio: 1 / 1;
      height: 22pt;
      border-radius: 999pt;
    }
  }

  .text-wrapper {
    display: block;
    width: min-content;
    margin: 0;
    padding: 0;

    span {
      width: min-content;
      font-family: $font-major;
      font-size: 8pt;
      text-transform: uppercase;
      color: $color-sub;
      margin: 0;
      padding: 0;
    }
  }
}
</style>
