<template>
  <div
    v-tippy="{delay: 0, arrow : true, arrowType : 'round', animation : 'vertical', duration: 100, theme: 'black'}"
    class="shard"
    :content="[
      `<t>id: <d>${shard.id}</d></t>`,
      `<t>client: <d>${shard.client}</d></t>`,
      `<t>version: <d>${shard.version.substr(0, 8)}</d></t>`,
      `<t>mode: <d>${shard.mode}</d></t>`,
      `<t>server: <d>${shard.server}</d></t>`,
      `<t>status: <d>${shard.status}</d></t>`,
      `<t>task: <d>${Object.values(shard.task).join(', ')}</d></t>`,
      `<t>outdated: <d>${!!shard.outdated}</d></t>`,
    ].filter(e => !!e).join('<br>')"
    :status="shard.status"
    :selected="selected"
    @click="$emit('click')"
  >
    <span class="id cc" v-text="shard.task.shardId" />
    <span class="status cc" v-text="shard.status" />
    <span class="server" :outdated="!!shard.outdated" v-text="shard.server" />
  </div>
</template>

<script>
export default {
  props: {
    shard: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped lang="scss">
.shard {
  position: relative;
  width: 90px;
  background-color: $bg-bright;
  border-radius: $box-border-radius;

  &[status="slot"] {
    background-color: transparent;
    box-shadow: 0 0 0 2px inset $bg-bright;
    pointer-events: none;
    span.cc { background-color: $bg-bright; }
  }
  &[status="idle"] span.cc { background-color: #F4B860; }
  &[status="reconnecting"] span.cc { background-color: #63b3d4; }
  &[status="startup"] span.cc { background-color: #77ccc8; }
  &[status="disconnected"] span.cc { background-color: #d47063; }
  &[status="identifying"] span.cc { background-color: #7F6A93; }
  &[status="operational"] span.cc { background-color: #7DBA84; }
  &[status="timeout"] span.cc { background-color: #d8649a; }
  &[selected] { box-shadow: 0 0 0 1px inset #ffffff; }

  span {
    display: block;
    text-align: center;

    &.id {
      font-family: monospace;
      font-size: 20pt;
      padding: 5px 15px 0 15px;
      margin: 5px 5px 0 5px;
      color: #ffffffaa;
      background-color: #00000040;
      border-radius: $box-border-radius/2 $box-border-radius/2 0 0;
    }

    &.status {
      padding: 2px 0 7px 0;
      margin: 0 5px 5px 5px;
      font-family: $font-regular;
      color: #ffffffaa;
      font-size: 8pt;
      background-color: #00000040;
      border-radius: 0 0 $box-border-radius/2 $box-border-radius/2;
    }

    &.server {
      margin-bottom: 10px;
      font-family: $font-regular;
      color: $color-minor;
      font-size: 11pt;

      &[outdated]::after {
        content: '!';
        font-family: $font-header;
        color: $warning-major;
        margin-left: .5em;
      }
    }
  }
}

</style>
