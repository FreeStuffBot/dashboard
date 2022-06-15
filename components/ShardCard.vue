<template>
  <div
    v-if="type === 'worker'"
    v-tippy="{delay: 0, arrow : true, arrowType : 'round', animation : 'vertical', duration: 100, theme: 'black'}"
    class="data"
    :content="[
      `<t>id: <d>${data.id}</d></t>`,
      `<t>index: <d>${data.index}</d></t>`,
      `<t>version: <d>${data.version.substr(0, 8)}</d></t>`,
      `<t>container: <d>${data.container}</d></t>`,
      `<t>node: <d>${data.node}</d></t>`,
      `<t>shards: <d>${data.task && data.task.ids}</d></t>`,
      `<t>outdated: <d>${!!data.outdated}</d></t>`,
    ].filter(e => !!e).join('<br>')"
    :status="data.status"
    :selected="selected"
    @click="$emit('click')"
  >
    <span class="id cc" v-text="data.index" />
    <span class="status cc" v-text="data.status === 'slot' ? 'slot' : data.shards.filter(s => s && s.status === 'operational').length + ' healthy'" />
    <span class="server" :outdated="!!data.outdated" v-text="data.node" />
  </div>
  <div
    v-else-if="type === 'shard'"
    v-tippy="{delay: 0, arrow : true, arrowType : 'round', animation : 'vertical', duration: 100, theme: 'black'}"
    class="data"
    :content="[
      `<t>id: <d>${data.id}</d></t>`,
      `<t>status: <d>${data.status}</d></t>`,
      `<t>worker: <d>${data.worker.id} (${data.worker.index})</d></t>`,
    ].filter(e => !!e).join('<br>')"
    :status="data.status"
    :selected="selected"
    @click="$emit('click')"
  >
    <span class="id cc" v-text="data.id" />
    <span class="status cc" v-text="data.status" />
    <span class="server" :outdated="!!data.outdated" v-text="data.status === 'slot' ? '-' : data.worker.index" />
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    type: {
      type: String,
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
.data {
  position: relative;
  width: 90px;
  background-color: $bg-light;
  border-radius: $box-br;

  &[status="slot"] {
    background-color: transparent;
    box-shadow: 0 0 0 2px inset $bg-light;
    pointer-events: none;
    span.cc { background-color: $bg-light; }
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
      border-radius: calc($box-br / 2) calc($box-br / 2) 0 0;
    }

    &.status {
      padding: 2px 0 7px 0;
      margin: 0 5px 5px 5px;
      font-family: $font-regular;
      color: #ffffffaa;
      font-size: 8pt;
      background-color: #00000040;
      border-radius: 0 0 calc($box-br / 2) calc($box-br / 2);
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
