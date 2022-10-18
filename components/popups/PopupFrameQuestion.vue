<template>
  <div class="frame">
    <h1 v-text="data.title" />
    <p
      v-for="(line, i) of (data.text ? data.text.split('\n') : [])"
      :key="i"
    >
      <span
        v-for="(part, j) of line.split('**')"
        :key="j"
        :bold="j % 2 === 1"
        v-text="part"
      />
    </p>

    <Layout name="flow">
      <Input
        v-model="output"
        :label="data.label"
        :placeholder="data.placeholder"
      />

      <Admonition v-if="error" type="error" :text="error" />

      <Layout name="center">
        <Button
          type="light"
          text="Cancel"
          @click="cancel"
        />
        <Button
          type="green"
          text="Submit"
          @click="submit"
        />
      </Layout>
    </Layout>
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
  data() {
    return {
      error: '',
      output: ''
    }
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.sync()
      }
    }
  },
  mounted() {
    this.sync()
  },
  methods: {
    sync() {
      this.error = ''
      this.output = ''
    },
    submit() {
      this.error = this.data.validate?.(this.output)
      if (this.error)
        return

      this.$emit('close', true)
      this.data.callback?.(this.output)
    },
    cancel() {
      this.$emit('close', true)
      this.data.callback?.(null)
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

    span[bold] {
      font-family: $font-header;
      color: $color-header;
    }
  }
}
</style>
