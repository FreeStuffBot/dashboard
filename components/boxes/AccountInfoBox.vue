<template>
  <div class="accountinfobox">
    <div class="user">
      <img :src="imgurl" alt="Profile Picture">
      <span class="name" v-text="username" />
      <span class="discrim" v-text="discrim" />
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
    username: {
      type: String,
      required: true
    },
    discrim: {
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
    display: flex;
    align-items: center;

    img {
      background-color: $bg-lighter;
      height: $content-height;
      width: $content-height;
      border-radius: 99pt;
      margin-right: $box-padding;
    }

    .name {
      font-family: $font-major;
      font-size: 14pt;
      color: $color-major;
    }

    .discrim {
      font-family: $font-major;
      font-size: 14pt;
      color: $color-minor;
    }
  }
}

</style>
