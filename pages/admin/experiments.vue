<template>
  <div class="container">
    <h1>
      Experiments
    </h1>

    <div class="buttons">
      <input v-model="search" type="text">
      <button generic small class="b3" @click="add()">
        Add Experiment
      </button>
      <button generic small class="b3" @click="rulesDocs()">
        Rules Docs
      </button>
    </div>
    <div class="list">
      <div v-for="e of list.filter(searchFilter)" :key="e._id" class="experiment">
        <div class="img" :style="`background-color: hsl(${e._id.split('').reduce((prev, curr) => prev + curr.charCodeAt(0), 0)}, 40%, 60%)`" v-text="e._id[0]" />
        <span class="name" v-text="e._id" />
        <span class="description" v-text="e.description" />
        <div class="rules">
          <input v-model="e.rules" type="text" placeholder="rule">
          <button @click="update(e._id, e.rules)">
            Update
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

export default Vue.extend({
  transition: 'slide-down',
  async fetch() {
    const { data } = await axios.get('/admin/experimentsapi?anticache=' + Math.random())
    this.list = data
  },
  data() {
    return {
      list: [ ],
      search: ''
    }
  },
  methods: {
    searchFilter(experiment: any) {
      if (this.search === '') return true
      if (experiment.name?.replaceAll('_', ' ').toLowerCase().includes(this.search.replaceAll('_', ' ').toLowerCase())) return true
      if (experiment.description.toLowerCase().includes(this.search.toLowerCase())) return true
      if (experiment.rules.toLowerCase().includes(this.search.toLowerCase())) return true
      return false
    },
    async add() {
      const { value } = await Swal.fire({
        title: 'New Experiment',
        html: `
          <label for="swal-input1">ID</label>
          <input id="swal-input1" class="swal2-input" placeholder="experiment_name">
          <label for="swal-input2">Description</label>
          <input id="swal-input2" class="swal2-input" placeholder="bla bla bla">
        `,
        preConfirm() {
          return [
            (document.getElementById('swal-input1') as HTMLInputElement).value,
            (document.getElementById('swal-input2') as HTMLInputElement).value
          ]
        }
      })

      if (!value) return

      await axios.post('/admin/experimentsapi', {
        name: value[0],
        description: value[1]
      })

      this.$fetch()
    },
    async update(name: string, rules: string) {
      await axios.patch('/admin/experimentsapi', {
        name, rules
      })

      this.$fetch()
    },
    rulesDocs() {
      Swal.fire({
        title: 'Rules How To',
        html: `amount ["of" group] ["where" filter]

              <b>Amount</b>
              30% → ~30% of all servers
              200 [PLANNED] → ~200 servers (gets converted to %)

              <b>Groups</b>
              all → all servers
              beta → all servers that opted into beta tests
              europe → all servers with europe regions
              usa → all servers with american regions

              <b>Filter</b>
              (none)

              <b>Examples</b>
              50% of europe
              200 of beta
              0.1%
              100% of usa
        `.split('\n').map(line => `<span align="left">${line}</span>`).join('')
      })
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
  color: white;
  font-family: $font-regular;
  font-size: 11pt;
  display: block;
}

.experiment {
  background-color: $bg-bright;
  padding: $box-padding;
  border-radius: $box-border-radius;
  margin-top: $box-padding / 2;
  display: grid;
  grid-template: auto auto / auto 1fr auto;
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

  .name {
    grid-area: title;
    color: $color-major;
    font-family: $font-major;
    margin-bottom: 2pt;
  }

  .description {
    grid-area: desc;
    color: $color-sub;
    font-family: $font-sub;
  }

  .rules {
    grid-area: rules;
    display: flex;
    justify-content: center;

    input {
      outline: none;
      color: $color-regular;
      font-family: $font-regular;
      font-size: 12pt;
      padding: 5pt 20pt;
      background-color: $bg-dark;
      border-radius: $content-border-radius 0 0 $content-border-radius;
      border: none;
      transition: background-color .2s ease;

      &:hover { background-color: $backpage }
    }

    button {
      outline: none;
      color: $primary-orange;
      font-family: $font-header;
      font-size: 10pt;
      text-transform: uppercase;
      padding: 2pt 10pt;
      background-color: $bg-dark;
      border-radius: 0 $content-border-radius $content-border-radius 0;
      border: none;
      cursor: pointer;
      transition: background-color .2s ease;

      &:hover { background-color: $backpage }
    }
  }
}

.buttons {
  button {
    margin-right: 5pt;
    --bg: #{$bg-darker};
    --color: #{$color-major};

    &.b1 { --bg-hov: #{$bg-bright}; }
    &.b2 { --bg-hov: #{$warning-major}; }
    &.b3 { --bg-hov: #{$info-major}; }
    &.b4 { --bg-hov: #{$success-major}; }
  }

  input {
    border-radius: $content-border-radius;
    background-color: $bg-bright;
    border: none;
    padding: 5pt 8pt;
    font-size: 11pt;
    font-family: $font-regular;
    color: $color-regular;
    margin-top: 10pt;
    margin-right: 5pt;
  }
}

</style>
