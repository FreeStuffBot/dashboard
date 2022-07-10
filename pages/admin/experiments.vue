<template>
  <Container>
    <h1>Experiments</h1>

    <Layout v-if="list" name="component-flow">
      <Admonition v-if="error" type="error" :text="error" />

      <Layout name="$211">
        <Input v-model="search" type="text" placeholder="Search" />
        <Button type="green" text="Add Experim..." @click="add()" />
        <Button type="light" text="Rule Docs" @click="rulesDocs()" />
      </Layout>

      <div v-for="e of list.filter(searchFilter)" :key="e.id" class="experiment">
        <div class="img" :style="`background-color: hsl(${e.id.split('').reduce((prev, curr) => prev + curr.charCodeAt(0), 0)}, 40%, 60%)`" v-text="e.id[0]" />
        <span class="id" v-text="e.id" />
        <span class="description" v-text="e.description" />
        <Layout name="2dynamic" class="rules">
          <Input v-model="e.rules" type="text" placeholder="rule" />
          <Button type="blue" text="Update" @click="update(e.id, e.rules)" />
        </Layout>
      </div>
    </Layout>
  </Container>
</template>

<script lang="ts">
import Vue from 'vue'
import API from '../../lib/api'
import { openFormDialogue, openInfoDialogue } from '../../lib/popups'
import Container from '~/components/layout/Container.vue'
import Layout from '~/components/layout/Layout.vue'
import Admonition from '~/components/entities/Admonition.vue'
import Input from '~/components/entities/Input.vue'
import Button from '~/components/entities/Button.vue'

export default Vue.extend({
  components: {
    Container,
    Layout,
    Admonition,
    Input,
    Button
  },
  transition: 'slide-down',
  async fetch() {
    const { data, status, statusText } = await API.getAdminExperiments()
    if (status !== 200) {
      this.error = `Error.\nhttp ${status}: ${statusText}\n${data?.error}: ${data?.message}`
      return
    }

    this.list = data
  },
  data() {
    return {
      error: '',
      list: null as any,
      search: ''
    }
  },
  methods: {
    searchFilter(experiment: any) {
      if (this.search === '') return true
      if (experiment.id.replaceAll('_', ' ').toLowerCase().includes(this.search.replaceAll('_', ' ').toLowerCase())) return true
      if (experiment.description.toLowerCase().includes(this.search.toLowerCase())) return true
      if (experiment.rules.toLowerCase().includes(this.search.toLowerCase())) return true
      return false
    },
    async add() {
      const { id, description, rules } = await openFormDialogue(this.$store, {
        title: 'Gaming',
        inputs: [
          { id: 'id', type: 'text', label: 'Id', placeholder: 'enable_feature_xyz' },
          { id: 'description', type: 'text', label: 'Description', placeholder: 'This experiment will enable this and that.' },
          { id: 'rules', type: 'text', label: 'Rules', placeholder: '60% of beta' }
        ]
      })

      await API.adminPostExperiment({
        id, description, rules
      })

      this.$fetch()
    },
    async update(id: string, rules: string) {
      if (rules)
        await API.adminPatchExperiment(id, { rules })
      else
        await API.adminDeleteExperiment(id)

      this.$fetch()
    },
    rulesDocs() {
      openInfoDialogue(
        this.$store,
        'Rules How-To',
        `amount ["of" group] ["where" filter]

        **Amount**
        30% → ~30% of all servers
        200 [PLANNED] → ~200 servers (gets converted to %)

        **Groups**
        all → all servers
        beta → all servers that opted into beta tests
        europe → all servers with europe regions
        usa → all servers with american regions

        **Filter**
        (none)

        **Examples**
        50% of europe
        200 of beta
        0.1%
        100% of usa
        `
      )
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
.experiment {
  position: relative;
  display: grid;
  background-color: $bg-light;
  padding: $box-padding;
  border-radius: $box-br;
  overflow: hidden;
  text-decoration: none;
  box-shadow: 0 0 0 1px #ffffff11 inset;
  grid-template: auto auto / auto 1fr 1fr;
  grid-template-areas: "icon title rules" "icon desc rules";
  column-gap: $box-padding;

  img, .img {
    display: grid;
    place-items: center;
    width: 32pt;
    height: 32pt;
    border-radius: 99pt;
    grid-area: icon;
    color: #222222dd;
    font-size: 16pt;
    font-family: $font-header;
    text-transform: capitalize;
  }

  .id {
    grid-area: title;
    color: $color-major;
    font-family: $font-major;
    margin-bottom: 2pt;
    font-size: 11pt;
  }

  .description {
    grid-area: desc;
    color: $color-sub;
    font-family: $font-sub;
    font-size: 11pt;
  }

  .rules {
    grid-area: rules;
    display: flex;
    justify-content: center;
  }
}
</style>
