<template>
  <Container>
    <h1>Jobrun</h1>

    <Admonition v-if="error" type="error" :text="error" />
    <Layout v-if="data" name="flow">
      <span v-for="key of Object.keys(data).filter(k => k !== 'data')" :key="key">
        <strong v-text="key" />
        {{ data[key] }}
      </span>

      <div class="io">
        <div v-for="log, i of data.data.io" :key="i" class="io-entry" :style="{ marginLeft: getLogMargin(log) }">
          <span class="type" v-text="log.type" :data-type="log.type" />
          <span class="time" v-text="new Date(log.time).toLocaleTimeString()" />
          <span v-if="showLogTrace(log)" class="stack" v-text="log.stack.join(' > ')" />
          <span v-if="stringifyLogData(log)" class="data" v-text="stringifyLogData(log)" />
        </div>
      </div>
    </Layout>
  </Container>
</template>

<script lang="ts">
import Vue from 'vue'
import API from '../../../lib/api'
import Container from '~/components/layout/Container.vue'
import Layout from '~/components/layout/Layout.vue'
import Tabs from '~/components/layout/Tabs.vue'
import Admonition from '~/components/entities/Admonition.vue'
import Input from '~/components/entities/Input.vue'
import Button from '~/components/entities/Button.vue'

export default Vue.extend({
  components: {
    Container,
    Layout,
    Tabs,
    Admonition,
    Input,
    Button
  },
  transition: 'slide-down',
  async fetch() {
    const { data, status, statusText } = await API.adminGetJobrun(this.$route.params.id)
    if (status !== 200) {
      this.error = `Error.\nhttp ${status}: ${statusText}\n${data?.error}: ${data?.message}`
      return
    }

    this.data = data
  },
  data() {
    return {
      error: '',
      data: null as any,
    }
  },
  methods: {
    getLogMargin(log) {
      const depth = (log.stack.length) + ((log.type === 'enter' || log.type === 'exit') ? 0 : 1)
      return `${depth * 12}pt`
    },
    showLogTrace(log) {
      return (log.type === 'enter' || log.type === 'exit')
    },
    stringifyLogData(log) {
      if (log.type === 'http')
         return `${log.data.req.method} ${log.data.req.url} -> ${log.data.res.status}`

      if (log.type === 'enter' || log.type === 'exit')
         return ''

      return JSON.stringify(log.data, null, 2)
    }
  },
  head() {
    return {
      title: 'FreeStuff Admin Panel'
    }
  },
  fetchOnServer: false
})
</script>

<style scoped lang="scss">

span {
  text-decoration: none;
  color: $color-regular;
  font-family: $font-regular;
  font-size: 11pt;
}

.io {
  display: flex;
  flex-direction: column;
  gap: 1px;

  .io-entry {
    background-color: $bg-light;
    box-sizing: border-box;
    display: grid;
    grid-template-columns: auto 1fr;
    padding: 8pt;
    gap: 4pt;

    .type {
      grid-column: 1;
      padding: 0 3pt;
      border-radius: 99pt;

      &[data-type="enter"] { background-color: $color-blue-20; }
      &[data-type="exit"] { background-color: $color-red-20; }
      &[data-type="http"] { background-color: $color-yellow-20; }
      &[data-type="log"] { background-color: $color-green-20; }
      &[data-type="error"] { background-color: $color-red; }
    }

    .time {
      grid-column: 2;
    }

    .stack {
      grid-column: 1 / span 2;
    }

    .data {
      grid-column: 1 / span 2;
    }
  }
}
</style>
