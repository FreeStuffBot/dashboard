<template>
  <section>
    <div class="container">
      <div v-if="dev" class="devnotice" v-text="'Dev Env'" />
      <div class="title">
        <img src="~/assets/img/logo.png" alt="Logo">
        <h2>FreeStuff</h2>
      </div>
      <SidebarNav />
      <footer>
        Copyright &copy; {{ new Date().getFullYear() }} FreeStuff Services
      </footer>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import SidebarNav from './SidebarNav.vue'

export default Vue.extend({
  components: {
    SidebarNav
  }
})
</script>

<style scoped lang="scss">
section {
  background-color: $backpage;
  height: 100vh;
  overflow-x: hidden;
  padding: 0 $box-outer-padding;
  width: $sidebar-width;
  animation: sidebar-fadein .3s ease-out .5s forwards;
  border-right: 2px solid $color-border;

  .container {
    padding: $box-outer-padding 0;
    min-height: calc(100vh - #{$box-outer-padding * 2});
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .title {
    display: flex;
    align-items: center;
    margin-bottom: $box-padding;
    background-color: $bg-dark;
    padding: $box-outer-padding/2;
    margin: -$box-outer-padding/2;
    margin-bottom: 0;
    border-radius: $box-br;

    img {
      border-radius: 99pt;
      height: 32pt;
      margin-right: $box-padding;
    }

    h2 {
      font-family: $font-header;
      color: $color-header;
      font-size: 24pt;
      margin: 0;
      padding: 0;
    }
  }

  nav {
    flex-grow: 1;
  }

  footer {
    font-family: $font-minor;
    font-size: 10pt;
    color: $color-minor;
    width: 100%;
    text-align: center;
    margin-top: $box-outer-padding;
  }

  &::-webkit-scrollbar { width: 0; height: 0; }
  &::-webkit-scrollbar-track { background-color: transparent; }
  &::-webkit-scrollbar-thumb { background-color: transparent; }
  &::-webkit-scrollbar-thumb:hover { background-color: transparent; }
}

@keyframes sidebar-fadein {
  0% { transform: translateX(-10px); }
  100% { transform: translateX(0); }
}
</style>
