<template>
  <div class="accountinfobox">
    <div class="user">
      <img :src="imgurl" alt="Profile Picture">
      <span class="dispname" v-text="dispname" />
      <span class="username" v-text="username" />
    </div>

    <!-- <Layout name="inline"> -->
      <Button
        type="red"
        text="Logout"
        @click="$router.push('/oauth/logout')"
      />
    <!-- </Layout> -->
  </div>
</template>

<script lang="ts">
import Layout from '~/components/layout/Layout.vue'
import Button from '~/components/entities/Button.vue'

export default {
  components: {
    Layout,
    Button
  },
  props: {
    dispname: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    imgurl: {
      type: String,
      required: true
    },
    subtext: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
.accountinfobox {
  @include box;
  display: flex;
  justify-content: space-between;

  .user {
    display: grid;
    align-items: center;
    grid-template-columns: auto 1fr;
    grid-template-rows: 1fr 1fr;

    img {
      background-color: $bg-lighter;
      height: $content-height;
      width: $content-height;
      border-radius: 99pt;
      margin-right: $box-padding;
      grid-row: 1 / span 2;
    }

    .dispname {
      font-family: $font-major;
      font-size: 14pt;
      color: $color-major;
    }

    .username {
      font-family: $font-major;
      font-size: 12pt;
      color: $color-sub;
    }
  }
}

</style>
