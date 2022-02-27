<template>
  <section name="sidebar">
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
  position: absolute;
  top: 0;
  left: 0;
  z-index: $zindex-sidebar;
  background-color: $backpage;
  height: 100vh;
  overflow-x: hidden;
  padding: 0 $box-outer-padding;
  width: $sidebar-width;
  animation: sidebar-fadein .3s ease-out .5s forwards;
  border-right: 1px solid $color-border;
  box-sizing: border-box;

  @media screen and (max-width: $res-sidebar-collapse-width) {
    padding: 0 5pt;
  }

  .container {
    padding: $box-outer-padding 0;
    min-height: calc(100vh - #{$box-outer-padding} * 2);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .title {
    display: flex;
    align-items: center;
    margin-bottom: $box-padding;
    background-color: $bg-dark;
    padding: calc(#{$box-outer-padding} / 2);
    margin: calc(-1 * #{$box-outer-padding} / 2);
    margin-bottom: 0;
    border-radius: $box-br;
    box-shadow: 0 0 0 1px #ffffff11 inset;

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

    @media screen and (max-width: $res-laplet-width) {
      padding: 5pt;

      img { height: 24pt; }
      h2 { font-size: 18pt; }
    }

    @media screen and (max-width: $res-sidebar-collapse-width) {
      padding: 0;
      margin: 10px;

      img { height: 27px; }
      h2 { display: none; }
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

    @media screen and (max-width: $res-sidebar-collapse-width) {
      word-break: break-all;
      font-size: 7pt;
      margin-top: 40pt;
    }
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
