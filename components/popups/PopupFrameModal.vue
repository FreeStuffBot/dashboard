<template>
  <div class="frame">
    <h1 v-if="data.title" v-text="data.title" />
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
    <Layout v-if="data.buttons" name="center" class="buttons">
      <Button
        v-for="(up, i) of data.buttons"
        :key="i"
        :type="up.type"
        :text="up.text"
        @click="clickButton(up)"
      />
    </Layout>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Layout from '~/components/layout/Layout.vue'
import Button from '~/components/entities/Button.vue'

export default Vue.extend({
  components: {
    Layout,
    Button
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  methods: {
    clickButton(button: any) {
      const closePopup = button.onClick()
      if (closePopup) this.$emit('close', true)
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

  .buttons {
    margin-top: 0;
  }
}
</style>
