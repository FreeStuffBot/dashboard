<template>
  <NuxtLink class="gamelistelement" :status="status" :to="`/content/${gid}`">
    <div class="bg">
      <img src="~/assets/img/gamecard_background_overlay.svg" alt="" draggable="false">
      <div class="img" :style="`background-image: url('${banner}');`" />
    </div>
    <div class="content">
      <span class="status" v-text="$store.state.lang[status]" />
      <span class="name" v-text="name" />
      <span class="subtext" v-text="([store,type,responsible]).join(' • ')" />
    </div>
  </NuxtLink>
</template>

<script>
export default {
  props: {
    gid: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    store: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    responsible: {
      type: String,
      required: true
    },
    banner: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
.gamelistelement {
  position: relative;
  display: block;
  background-color: $bg-light;
  padding: $box-padding;
  border-radius: $box-br;
  margin-bottom: calc($box-padding / 2);
  overflow: hidden;
  box-shadow: 0 0px 6px #00000000;
  text-decoration: none;
  cursor: pointer;

  &[status="pending"] { --statusColor: #AB6B31; }
  &[status="declined"] { --statusColor: #AB3231; }
  &[status="approved"] { --statusColor: #59AB31; }
  &[status="scheduled"] { --statusColor: #3190AB; }

  &:hover {
    filter: brightness(0.9);
  }

  .bg {
    position: absolute;
    height: 100%;
    width: 50%;
    right: 0;
    top: 0;

    * { position: absolute; }

    img {
      z-index: 2;
      transform: translateX(-1px);
    }

    .img {
      z-index: 1;
      display: block;
      height: 100%;
      width: 100%;
      background-position: 50% 50%;
      background-size: cover;
    }
  }
  &[status="declined"] .bg .img { filter: grayscale(.5) saturate(.3) }

  .content {
    position: relative;
    z-index: 5;
    max-width: 70%;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;

    * {
      width: 100%;
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .status {
      font-family: $font-header;
      font-size: 11pt;
      text-transform: uppercase;
      color: var(--statusColor, white);
    }

    .name {
      color: $color-major;
      font-family: $font-major;
      font-size: 20pt;
      margin: 3px 0 3px 0;
    }

    .subtext {
      color: $color-sub;
      font-family: $font-sub;
      font-size: 12pt;
    }
  }
}

</style>
