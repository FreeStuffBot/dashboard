<template>
  <div>
    <h1 v-text="product.data.title" />
    <div class="pills">
      <span v-text="idToFsuri(product.id, 'P')" />
      <span v-text="`@${product.uuid}`" />
      <span v-text="product.status" />
      <span v-text="product.data.staffApproved ? 'staff-approved' : 'automated'" />
    </div>

    <h2>Log</h2>
    <div class="logs">
      <div v-for="log of product.auditlog" :key="log._id" class="log">
        <div class="bullet" />
        <div class="content">
          <div class="header">
            <div class="event" v-text="log.event" />
            <div class="user" v-text="$store.state.lang[log.user]" />
            <div class="time" v-text="new Date(log.time).toLocaleString()" />
          </div>
          <div v-for="line, i of log.details.split('\n')" :key="i" class="details" v-text="line" />
        </div>
      </div>
    </div>

    <h2>Metadata</h2>
    <tbody class="meta">
      <tr v-for="data of product.data.meta" :key="data.key">
        <td class="key" v-text="`${data.key}:`" />
        <td class="value" v-text="data.value" />
      </tr>
    </tbody>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Admonition from '~/components/entities/Admonition.vue'
import { idToFsuri } from '../../../lib/utils'

export default Vue.extend({
  components: {
    Admonition
  },
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  methods: {
    idToFsuri
  }
})
</script>

<style scoped lang="scss">
.pills {
  display: flex;
  flex-wrap: wrap;
  gap: $content-padding;

  span {
    font-family: $font-major;
    color: $color-major;
    font-size: 11pt;
    padding: 4pt 7pt;
    background-color: $bg-lighter;
    border: 1px solid $color-border;
    border-radius: 999pt;

    &:first-child {
      background-color: $color-green-20;
      border-color: $color-green;
    }
  }
}

.logs {
  display: flex;
  flex-direction: column;
  gap: 10pt;

  .log {
    font-family: $font-regular;
    font-size: 11pt;
    color: $color-regular;
    display: grid;
    grid-template-columns: auto 1fr;

    .bullet {
      width: 6pt;
      height: 6pt;
      background-color: $color-regular;
      margin: 11pt;
      border-radius: 999pt;
    }

    .content {
      display: flex;
      flex-direction: column;
    }

    .header {
      display: flex;
      height: 28pt;
      align-items: center;
      gap: $content-padding;
    }

    .event {
      font-family: $font-major;
      color: $color-major;
    }

    .time, .user {
      font-size: 9pt;
      font-family: $font-major;
      background-color: $bg-light;
      padding: 2pt 6pt;
      border-radius: 2pt;
    }
  }
}

.meta {  
  .key {
    font-family: $font-major;
    color: $color-major;
    font-size: 11pt;
    padding: 3pt 6pt 3pt 0;
    text-align: right;
  }

  .value {
    font-family: $font-regular;
    color: $color-regular;
    font-size: 11pt;
  }
}
</style>
