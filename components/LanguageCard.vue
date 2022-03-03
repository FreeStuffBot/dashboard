<template>
  <div class="container">
    <NuxtLink
      class="box"
      :editable="lang._editable"
      :to="`/translate/${lang._id}`"
    >
      <h3 v-text="lang._display_text" />
      <div class="progress">
        <div
          class="inner lang-box-progess-inner"
          :class="{ done: lang._meta_progress >= maxProgress }"
          :style="`--progress: ${Math.min(100, lang._meta_progress / maxProgress * 100)}%`"
        />
      </div>
      <div>
        <span v-text="lang._ranking > 0 ? `Used in ${lang._ranking} servers` : 'Unreleased'" />
        <span v-text="new Date(parseInt(lang._meta_last_edit, 10)).toLocaleString()" />
      </div>
      <div class="users">
        <UserIcons
          v-if="lang._meta_responsible"
          :users="lang._meta_responsible"
          :max="6"
          :bgcolor="'var(--bg-light)'"
        />
      </div>
    </NuxtLink>
  </div>
</template>


<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    lang: {
      type: Object,
      required: true
    },
    maxProgress: {
      type: Number,
      required: true
    }
  }
})
</script>

<style scoped lang="scss">
span, h3 {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

span {
  color: $color-sub;
  font-family: $font-regular;
  font-size: 11pt;
}

.box {
  position: relative;
  display: grid;
  background-color: $bg-light;
  padding: $box-padding;
  border-radius: $box-br;
  overflow: hidden;
  text-decoration: none;
  box-shadow: 0 0 0 1px #ffffff11 inset;
  gap: $content-padding;
  cursor: pointer;
  transition: background-color .1s ease-out;

  &:hover { background-color: $bg-lighter; }

  &:not([editable]) { opacity: .5; }
}

.progress {
  width: 100%;
  height: 3pt;
  margin: 10pt 0;
  background-color: $bg-dark;
  border-radius: 99px;

  .inner {
    --color: #{$color-blue};
    height: 100%;
    width: var(--progress);
    border-radius: 99px;
    background-color: var(--color);
    transition: width 1s $ease-out-quart;
    box-shadow: 0 0 14px var(--color);

    &.done { --color: #{$color-green}; }
  }
}

.users {
  width: 100%;
  overflow: hidden;
  opacity: 1;
  transition: opacity 1s ease-out;
}

.loading-animation-queued {
  .lang-box-progess-inner {
    width: 0;
  }

  .users {
    opacity: 0;
  }
}
</style>
