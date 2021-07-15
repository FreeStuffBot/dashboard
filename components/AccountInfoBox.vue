<template>
  <div class="accinfobox">
    <img :src="imgurl" alt="Profile Picture">
    <div class="text">
      <div>
        <span class="un" v-text="username" />
        <span class="dm" sub v-text="discrim" />
      </div>
      <span class="st" v-text="subtext" />
    </div>
    <div class="buttons">
      <a v-tippy href="javascript:alert('not implemented lol')" class="c-green" content="Settings">
        <img src="~/assets/icons/settings.svg" alt="Settings">
      </a>
      <a v-tippy href="/oauth/logout" class="c-red" content="Logout">
        <img src="~/assets/icons/logout.svg" alt="Logout">
      </a>
    </div>
  </div>
</template>

<script>
export default {
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
@import '~/assets/style/all.scss';

.accinfobox {
  display: flex;
  background: #393f55;
  padding: $box-padding;
  border-radius: $box-border-radius;
  margin-bottom: $box-padding;

  & > img {
    background-color: #00000044;
    height: 64pt;
    width: 64pt;
    border-radius: 99pt;
    margin-right: $box-padding;
  }

  .text {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .un {
      color: $color-major;
      font-family: $font-major;
      font-size: 20pt;
    }

    .dm, .st {
      color: $color-sub;
      font-family: $font-sub;
      font-size: 14pt;
    }
  }

  .buttons {
    display: flex;

    a {
      display: flex;
      color: $color-major;
      text-decoration: none;
      margin: 10pt 10pt 10pt 0;
      width: 44pt;
      height: 44pt;
      border-radius: 99pt;
      background-color: #00000011;
      justify-content: center;
      align-items: center;
      transition: .2s background-color ease;

      &:hover {
        &.c-red { background-color: $warning-major; }
        &.c-green { background-color: $success-major; }

        img { opacity: 1; }
      }

      img {
        width: 20pt;
        height: 20pt;
        color: $color-regular;
        opacity: .3;
        transition: .2s opacity ease;
      }
    }
  }
}

</style>
