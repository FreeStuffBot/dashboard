<template>
  <div class="frame">
    <h1 v-text="data.data.data.title" />
    <!-- TODO -->
    <Button text="Edit Product" @click="click('doEdit')" />
    <Button text="Add to Announcement" @click="click('doMoveToAnnouncement')" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Layout from '~/components/layout/Layout.vue'
import Button from '~/components/entities/Button.vue'
import Input from '~/components/entities/Input.vue'
import Admonition from '~/components/entities/Admonition.vue'

export default Vue.extend({
  components: {
    Layout,
    Button,
    Input,
    Admonition
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  methods: {
    click(callee: string) {
      this.data[callee]?.()
      this.$emit('close', true)
    }
  }
})
</script>

<style scoped lang="scss">
.frame {
}
</style>
