<template>
  <div class="container">
    <h1>
      Network
    </h1>

    <span
      class="connection-display"
      :connected="socket && socket.connected"
      v-text="`Websocket: ${socket ? (socket.connected ? 'Connected' : 'Disconnected') : null} ${socketVisualRendered}`"
    />

    <br>
    <span v-text="`Shard count: ${shardCount}`" />
    <span v-text="`Selected: ${selected.length}`" />

    <div class="actions">
      <button generic small class="b1" @click="selected = []">
        Deselect
      </button>
      <button generic small class="b2" @click="selected = shards.map(s=>s.id)">
        Select All
      </button>
      <div v-if="selected.length" style="display: inline;">
        <div class="divider">
          &bull;
        </div>
        <button generic small class="b3 r" @click="action('shutdown')">
          Shutdown
        </button>
        <button generic small class="b4 r" @click="action('reload_lang')">
          Reload Language
        </button>
      </div>
    </div>

    <br>
    <h2>Servers:</h2>
    <span v-for="(amount, server) of shardsMappedToServers" :key="server" v-text="`${server}: ${amount} Shards`" />
    <br>

    <h2>Shards:</h2>
    <div class="shardsContainer">
      <ShardCard
        v-for="shard of shardsStocked.filter(s => s.task.id === 'assigned')"
        :key="shard.id"
        :shard="shard"
        :selected="selected.includes(shard.id)"
        @click="clickShard(shard)"
      />
    </div>

    <h2>Available:</h2>
    <div class="shardsContainer">
      <ShardCard
        v-for="shard of shards.filter(s => s.task.id === 'ready')"
        :key="shard.id"
        :shard="shard"
        :selected="selected.includes(shard.id)"
        @click="clickShard(shard)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import io, { Socket } from 'socket.io-client'
import ShardCard from '~/components/ShardCard.vue'

export default Vue.extend({
  components: { ShardCard },
  transition: 'slide-down',
  data() {
    return {
      socket: null as Socket | null,
      socketVisualUpdater: null as any,
      socketVisualState: 0,
      shards: [] as any[],
      shardCount: 0,
      selected: [] as string[]
    }
  },
  head() {
    return {
      title: 'FreeStuff Admin Panel'
    }
  },
  computed: {
    socketVisualRendered(): string {
      let out = ''
      for (let i = 0; i < 5; i++)
        out += Math.abs(this.socketVisualState) === i ? 'O' : 'o'
      return out
    },
    shardsStocked(): any[] {
      const out = []
      for (let i = 0; i < this.shardCount; i++) {
        const found = (this as any).shards.find((s: any) => (s.task.id === 'assigned' && s.task.shardId === i))
        if (found) {
          out.push(found)
          continue
        }
        out.push({
          id: Math.random().toString(),
          client: '-',
          mode: '-',
          version: '-',
          server: '-',
          status: 'slot',
          task: { id: 'assigned', shardId: i }
        })
      }
      return out
    },
    shardsMappedToServers() {
      const out = {} as any
      for (const shard of this.shards)
        out[shard.server] = (out[shard.server] || 0) + 1
      return out
    }
  },
  mounted() {
    this.socketVisualUpdater = setInterval((v) => {
      v.socketVisualState++

      if (Math.abs(v.socketVisualState) >= 4)
        v.socketVisualState *= -1
    }, 300, this)

    this.socket = io(`${window.location.protocol.includes('s') ? 'wss' : 'ws'}://${window.location.host}`, {
      query: {
        type: 'dashboard'
      },
      path: '/api/internal/socket'
    })

    this.socket.on('connect', () => {
      this.shards = []
    })

    this.socket.on('admin shards count', (count) => {
      this.shardCount = count
    })

    this.socket.on('admin shards add', (shard) => {
      this.shards.push(shard)
    })

    this.socket.on('admin shards remove', (shard) => {
      this.shards.splice(this.shards.findIndex(check => check.id === shard.id), 1)
    })

    this.socket.on('admin shards update', (shard) => {
      const target = this.shards.find(check => check.id === shard.id)
      Object.assign(target, shard)
    })
  },
  destroyed() {
    if (this.socket)
      this.socket.disconnect()
    if (this.socketVisualUpdater)
      clearInterval(this.socketVisualUpdater)
  },
  methods: {
    clickShard(shard: any) {
      console.log(shard)
      if (this.selected.includes(shard.id))
        this.selected.splice(this.selected.indexOf(shard.id), 1)
      else
        this.selected.push(shard.id)
    },
    action(cmd: string) {
      this.socket?.emit('action', {
        shards: this.selected,
        command: {
          id: cmd
        }
      })
    }
  },
  fetchOnServer: false
})
</script>

<style scoped lang="scss">
@import '~/assets/style/all.scss';

span {
  color: white;
  font-family: $font-regular;
  font-size: 11pt;
  display: block;

  &.warn {
    color: $warning-major;
    font-family: $font-header;
  }
}

h1 img {
  height: 11pt;
  opacity: .4;
  padding: 3px;
  margin: 0 0 0 3px;
  cursor: pointer;

  &:hover { opacity: .7; }
}

.shardsContainer {
  margin: $box-padding 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, 90px);
  gap: $box-padding/2;
  width: 100%;
}

.actions {
  margin-top: $box-padding;

  button, a[button] {
    margin-right: 5pt;
    --bg: #{$bg-darker};
    --bg-hov: #{$success-major};
    --color: #{$color-major};

    &.r {
      --bg-hov: #{$warning-minor};
    }
  }
}

.divider {
  display: inline-block;
  width: 20px;
  margin-right: 5px;
  text-align: center;
  color: #ffffff80;
}

.connection-display {
  color: #d47063;

  &[connected] { color: #7DBA84; }
}

</style>
