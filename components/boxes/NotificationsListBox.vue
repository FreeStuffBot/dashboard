<template>
  <div class="notificationslistbox">
    <div
      v-for="notif of notifications"
      :key="notif.id"
      class="notif"
      :data-read="!!notif.readAt"
      @click="open(notif)"
    >
      <Icon name="material/notification" />
      <p class="title" v-text="notif.data.title" />
      <p class="date" v-text="getDate(notif)" />
    </div>
  </div>
</template>

<script lang="ts">
import Layout from '~/components/layout/Layout.vue'
import Button from '~/components/entities/Button.vue'
import Icon from '../icon.vue'
import API from '../../lib/api'
import { openInfoDialogue } from '../../lib/popups'


const MINUTE = 60_000

export default {
  components: {
    Layout,
    Button,
    Icon
  },
  props: {
    notifications: {
      type: Array<{ id: String, readAt: Number, data: { title: String } }>,
      required: true
    }
  },
  methods: {
    getDate(notif: any): string {
      const date = new Date(notif.sentAt)
      const delta = Date.now() - notif.sentAt
      if (delta < 60 * MINUTE) return `${~~(delta / MINUTE)}m ago`
      if (delta < 24 * 60 * MINUTE) return `${~~(delta / MINUTE / 60)}h ago`
      return date.toLocaleDateString()
    },
    open(notif: any): void {
      openInfoDialogue(this.$store, notif.data.title, notif.data.message)
      if (!notif.readAt) {
        API.postNotificationRead(notif.id)
        this.$store.commit('user/markNotificationAsRead', notif.id)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.notificationslistbox {
  @include box;
  display: flex;
  flex-direction: column;
  padding: 0 !important;
  overflow: hidden;

  .notif {
    display: flex;
    flex-wrap: wrap;
    gap: $content-padding;
    padding: $box-padding;
    align-items: center;
    color: $color-major;
    cursor: pointer;
    transition: background-color .1s ease;

    &:not(:last-child) {
      border-bottom: 1px solid $color-border;
    }

    &:hover {
      background-color: $bg-lighter;
    }

    .title {
      margin: 0;
      font-family: $font-major;
      color: $color-major;
      font-size: 12pt;
    }

    &[data-read] .title {
      font-family: $font-regular;
      color: $color-regular;
    }

    .date {
      margin: 0;
      font-family: $font-regular;
      color: $color-sub;
      font-size: 12pt;
    }
  }
}

</style>
