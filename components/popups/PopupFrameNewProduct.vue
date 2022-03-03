<template>
  <div class="frame">
    <h1>New Product</h1>
    <Layout name="component-flow">
      <Input
        v-model="url"
        label="Product URL"
        placeholder="https://store.steampowered.com/app/1172050"
      />
      <Button
        type="green"
        text="Create"
        @click="submit"
      />
    </Layout>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Layout from '~/components/layout/Layout.vue'
import Button from '~/components/entities/Button.vue'
import Input from '~/components/entities/Input.vue'

export default Vue.extend({
  components: {
    Layout,
    Button,
    Input
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      url: ''
    }
  },
  methods: {
    submit() {
      this.$emit('close', true)
      this.data.callback?.(this.url)
    }
  }
})
</script>

<style scoped lang="scss">
.frame {
  h1 {
    width: 100%;
    margin-top: 0;
    text-align: center;
  }

  p {
    width: 100%;
    margin-top: 0;
    // text-align: center;

    span[bold] {
      font-family: $font-header;
      color: $color-header;
    }
  }
}
</style>
