<template>
  <div v-if="data" class="subscription">
    <h2 v-text="headerText" />
    <Layout name="11">
      <div class="source">
        <h3>Source</h3>
        <p>You subscribed on 23. Oct. 2022.</p>
        <p><a @click="showDetails()">View Details.</a></p>
      </div>
      <div class="used-for">
        <h3>Used For</h3>
        <div v-if="isOccupied" class="server">
          <div class="icon" />
          <span>Your server name</span>
        </div>
        <div v-else class="server unoccupied">
          <div class="icon">+</div>
          <span>No server selected</span>
        </div>
      </div>
    </Layout>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { openInfoDialogue } from '~~/lib/popups';
import Button from '../entities/Button.vue';
import Layout from '../layout/Layout.vue';

export default Vue.extend({
  components: { Button, Layout },
  props: {
    index: {
      type: Number,
      default: 0
    },
    data: {
      type: Object,
      required: true
    }
  },
  computed: {
    headerText(): string {
      return `Subscription ${this.index + 1}`
    },
    isOccupied(): boolean {
      return this.data.usedFor
    },
  },
  methods: {
    unassign() {

    },
    unsubscribe() {

    },
    showDetails() {
      openInfoDialogue(this.$store, 'Soon', 'Not finished yet lmao')
    }
  }
})
</script>

<style scoped lang="scss">
.subscription {
  @include box;

  h2, p {
    margin: 0;
    padding: 0;
  }

  h3 {
    margin: $box-padding 0 calc($box-padding / 3) 0;
    padding: 0;
  }

  a {
    font-family: $font-major;
    color: $color-blue;
    text-decoration: none;
    cursor: pointer;
  }

  hr {
    width: calc(100% + 2 * $box-padding);
    height: 1px;
    margin: $box-padding;
    margin-left: calc($box-padding * -1);
    display: block;
    border: none;
    background-color: $color-border;
  }

  .server {
    display: flex;
    gap: $box-padding;
    border: 1px solid $color-border;
    padding: $content-padding;
    padding-right: calc($content-padding * 2);
    border-radius: $content-br;
    align-items: center;
    cursor: pointer;
    transition: border-color .1s ease,
      background-color .1s ease;
    // width: fit-content;

    &:hover {
      border-color: $color-minor;
      background-color: $bg-lighter;
    }

    .icon {
      width: 32pt;
      height: 32pt;
      background-color: $bg-lighter;
      border-radius: 99pt;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: $font-header;
      font-size: 22pt;
      line-height: 1em;
      color: $color-header;
    }

    span {
      color: $color-major;
      font-family: $font-major;
      font-size: 11pt;
    }

    &.unoccupied {
      border-style: dashed;

      span { color: $color-sub; }
    }
  }
}
</style>
