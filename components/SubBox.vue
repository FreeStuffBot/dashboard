<template>
  <div class="subbox" :style="`--color: ${color}`">
    <div class="header">
      <span v-text="title" />
      <a v-if="extName" :href="extHref" target="_blank">
        <span v-text="extName" />
        <img src="~/assets/icons/ext_link.svg" title="External Link">
      </a>
    </div>
    <div class="hints">
      <div v-for="hint of hints" :key="hint.name" v-tippy="{arrow : true, arrowType : 'round', animation : 'vertical', duration: 100, trigger: 'click', theme: !!hint.value ? 'black' : 'invisible'}" :class="{empty: !hint.value}" :content="hint.details">
        <span v-text="hint.value" />
        <span v-text="hint.name" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    extName: {
      type: String,
      required: true
    },
    extHref: {
      type: String,
      required: true
    },
    hints: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style scoped lang="scss">
.subbox {
  display: block;
  background: var(--color);
  padding: $box-padding;
  border-radius: $box-border-radius;
  margin-bottom: $box-padding;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: $box-padding;

  span {
    font-family: $font-header;
    color: $color-header;
    margin: 0;
    font-size: 16pt;
  }

  a {
    text-decoration: none;

    * { transition: all .1s ease-in-out; }

    span {
      font-family: $font-regular;
      color: #ffffff99;
      font-size: 11pt;
      margin: 0;
    }

    img {
      height: 7pt;
      opacity: .56;
    }

    &:hover {
      span { color: #ffffff; }
      img { opacity: 1; }
    }
  }
}

.hints {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  grid-column-gap: $box-padding;
  row-gap: $box-padding;
  width: 100%;

  div {
    background-color: #00000019;
    padding: $box-padding;
    border-radius: 20pt;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    outline: none;

    &.empty { background-color: transparent; }
    &:not(.empty) { cursor: pointer; }

    span:first-child {
      font-family: $font-header;
      color: #ffffff;
      margin: 0 0 5px 0;
      font-size: 18pt;
    }

    span:last-child {
      font-family: $font-sub;
      color: #ffffffbb;
      margin: 0;
      font-size: 12pt;
      text-align: center;
    }
  }
}

</style>
