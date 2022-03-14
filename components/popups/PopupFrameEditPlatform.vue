<template>
  <div class="frame">
    <h1 v-text="`Edit ${data.data.name}`" />
    <Layout v-if="platform" name="component-flow">
      <Input v-model="platform.id" label="General - Id" type="text" :disabled="true" />
      <Input v-model="platform.name" label="General - Name" type="text" />
      <Input v-model="platform.url" label="General - URL" type="text" />
      <Input v-model="platform.description" label="General - Description" type="text" />
      <Input v-model="platform.assets.icon" label="Assets - Icon URL" type="text">
        <template #preview>
          <div class="asset-icon-preview" :style="`background-image: url('${platform.assets.icon}')`" />
        </template>
      </Input>
      <Input v-model="platform.gibuRef" label="Internal - Gibu API Reference" type="text" />

      <Admonition v-if="error" type="error" :text="error" />

      <Layout name="center">
        <Button
          type="light"
          text="Cancel"
          @click="close"
        />
        <Button
          type="red"
          :text="`Delete ${data.data.name}`"
          @click="delet"
        />
        <Button
          type="green"
          text="Save & Close"
          @click="save"
        />
      </Layout>
    </Layout>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import API from '../../lib/api'
import { openConfirmDialogue } from '../../lib/popups'
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
  data() {
    return {
      error: '',
      platform: null as any
    }
  },
  watch: {
    'data.data': {
      deep: true,
      handler(val: any) {
        this.sync(val ?? null)
      }
    }
  },
  mounted() {
    this.sync(this.data?.data ?? null)
  },
  methods: {
    sync(data: any) {
      this.platform = JSON.parse(JSON.stringify(data))
      this.error = ''
    },
    async save() {
      const { data, status, statusText } = await API.patchPlatform(this.data.data.id, this.platform)
      if (status !== 200) {
        this.error = `Error. http ${status}: ${statusText}.\n${data?.error}: ${data?.message}`
        return
      }

      this.$emit('close', true)
      this.data.callback?.(true)
    },
    close() {
      this.$emit('close', true)
      this.data.callback?.(false)
    },
    async delet() {
      const doIt = await openConfirmDialogue(this.$store, 'U sure?', `If you delete ${this.data.data.name} it will be gone forever. Stuff might break. Only proceed if you know exactly what you are doing!`)
      if (!doIt) return

      const { data, status, statusText } = await API.deletePlatform(this.data.data.id)
      if (status !== 200) {
        this.error = `Error. http ${status}: ${statusText}.\n${data?.error}: ${data?.message}`
        return
      }

      this.$store.commit('closePopup')
      this.data.callback?.(true)
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

  .asset-icon-preview {
    display: block;
    width: 100%;
    height: calc(#{$content-height} * 2);
    margin: $box-padding;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
  }
}
</style>