<template>
  <div class="input-enum">
    <label v-if="label" v-text="label" />
    <Layout name="component-flow" :tight="true">
      <div v-for="(item, index) in value" :key="index" class="entry">
        <slot
          :value="item"
          :update="val => set(index, val)"
          :remove="val => remove(index)"
        />
      </div>
      <Layout v-if="add" name="inline">
        <Button
          :text="add"
          @click="addEntry()"
        />
      </Layout>
    </Layout>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Button from './Button.vue'
import Layout from '~/components/layout/Layout.vue'

export default Vue.extend({
  components: {
    Button,
    Layout
  },
  props: {
    value: {
      type: [ Object ],
      default: () => ([])
    },
    label: {
      type: String,
      required: false
    },
    add: {
      type: String,
      required: false
    },
    defaultValue: {
      type: Object,
      default: () => (null)
    }
  },
  methods: {
    update(value: any) {
      this.$emit('input', value)
    },
    addEntry(): void {
      this.update([
        ...this.value,
        JSON.parse(JSON.stringify(this.defaultValue ?? null))
      ])
    },
    set(index: number, val: any): void {
      Vue.set(this.value, index, val)
      this.update(this.value)
    },
    remove(index: number): void {
      const copy = [ ...this.value ]
      copy.splice(index, 1)
      Vue.set(this, 'value', copy)
      this.update(this.value)
    }
  }
})
</script>

<style scoped lang="scss">
.input-enum {
}
</style>
