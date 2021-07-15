<template>
  <div class="usericons">
    <div
      v-for="(user, i) of formatted"
      :key="i"
      class="user"
      :style="`z-index: ${5 + i}; border-color: ${bgcolor}`"
    >
      <img
        v-if="user.icon"
        v-tippy
        :content="user.name"
        :src="user.icon"
        alt="Icon"
        draggable="false"
      >
      <div
        v-else
        v-tippy
        :content="user.names"
        class="more"
        v-text="user.name"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    users: {
      type: Array,
      required: true
    },
    max: {
      type: Number,
      default: 5
    },
    bgcolor: {
      type: String,
      default: '#3e3842'
    }
  },
  computed: {
    formatted(): any {
      if (this.users.length > this.max) {
        const users = this.users.slice(0, this.max - 1)
        const add = {
          icon: null,
          name: '+' + (this.users.length - this.max + 1),
          names: this.users
            .slice(this.max - 1, this.users.length)
            .map((u: any) => u.name)
            .join(', ')
        }
        return [ ...users, add ]
      } else {
        return this.users
      }
    }
  }
})
</script>

<style scoped lang="scss">
@import '~/assets/style/all.scss';


.usericons {
  padding-right: 7pt;
}

.user {
  height: 24pt;
  display: inline-block;
  margin: -3px -10pt -3px 0;
  padding: 0;
  position: relative;
  border-style: solid;
  border-width: 3pt;
  border-radius: 999pt;
  outline: none;
  overflow: hidden;

  img {
    height: 100%;
    background: $backpage;
    border-radius: 999pt;
    outline: none;
  }

  .more {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    min-width: 24pt;
    background-color: $bg-dark;
    border-radius: 999pt;
    color: $color-sub;
    font-family: $font-sub;
    font-size: 12pt;
    padding: 0 2pt;
    outline: none;
  }
}
</style>
