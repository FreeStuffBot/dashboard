<template>
  <Container>
    <h1>Admin</h1>

    <h2>Overview</h2>
    <p v-if="git">
      Running Commit #{{ git.shortHash }} ({{ git.subject }} :: {{ git.author.name }}) from {{ git.time }}
    </p>
    <p v-else>
      Running unknown Commit (no admin permission?)
    </p>
    <p>Web v1.1</p>

    <h2>Dashboard</h2>
    <Layout name="3static">
      <Pagelink
        title="Users"
        text="TODO"
        icon="emojis/twemoji_man_walking"
        to="/admin/users"
      />
      <Pagelink
        title="API Apps"
        text="TODO"
        icon="emojis/twemoji_robot"
        to="/admin/apiapps"
      />
    </Layout>

    <h2>Infra</h2>
    <Layout name="3static">
      <Pagelink
        title="Experiments"
        text="View and edit experiments"
        icon="emojis/twemoji_test_tube"
        to="/admin/experiments"
      />
      <Pagelink
        title="Configuration"
        text="Change the global config and other settings"
        icon="emojis/twemoji_gear"
        to="/admin/config"
      />
      <Pagelink
        title="Network"
        text="Monitor the infrastructure"
        icon="emojis/twemoji_satellite"
        to="/admin/network"
      />
    </Layout>

    <h2>Other</h2>
    <Layout name="3static">
      <Pagelink
        title="Internal"
        text="TODO"
        icon="emojis/twemoji_robot"
        to="/admin/internal"
      />
    </Layout>
  </Container>
</template>

<script lang="ts">
import Vue from 'vue'
import Container from '~/components/layout/Container.vue'
import Layout from '~/components/layout/Layout.vue'
import Pagelink from '~/components/entities/Pagelink.vue'

export default Vue.extend({
  components: {
    Container,
    Layout,
    Pagelink
  },
  transition: 'slide-down',
  data() {
    return {
      git: this.$store.state.gitData
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
</style>
