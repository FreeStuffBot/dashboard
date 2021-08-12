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
    <span v-text="`Worker count: ${workerCount}`" />
    <span v-text="`Shards per worker: ${shardsPerWorker}`" />
    <span v-text="`Total shard count: ${workerCount * shardsPerWorker}`" />
    <br>
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
    <h2>Workers:</h2>
    <div class="shardsContainer">
      <ShardCard
        v-for="worker of workersStocked"
        :key="worker.id"
        type="worker"
        :data="worker"
        :selected="selected.includes(worker.id)"
        @click="clickShard(worker)"
      />
    </div>
    <br>

    <h2>Shards:</h2>
    <div class="shardsContainer">
      <ShardCard
        v-for="shard of shardsStocked"
        :key="shard.id"
        type="shard"
        :data="shard"
        :selected="selected.includes(shard.id)"
        @click="clickShard(shard)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import io, { Socket } from 'socket.io-client'
import API from '../../lib/api'
import ShardCard from '~/components/ShardCard.vue'

export default Vue.extend({
  components: { ShardCard },
  transition: 'slide-down',
  data() {
    return {
      socket: null as Socket | null,
      socketVisualUpdater: null as any,
      socketVisualState: 0,
      workers: [] as any[],
      workerCount: 0,
      shardsPerWorker: 0,
      selected: [] as string[]
    }
  },
  computed: {
    socketVisualRendered(): string {
      let out = ''
      for (let i = 0; i < 5; i++)
        out += Math.abs(this.socketVisualState) === i ? 'O' : 'o'
      return out
    },
    workersStocked(): any[] {
      const out = []
      for (let i = 0; i < this.workerCount; i++) {
        const found = (this as any).workers.find((s: any) => (s.index === i))
        if (found) {
          if (!(found.shards as any[]).length)
            found.status = 'disconnected'
          else if ((found.shards as any[]).filter(s => s).every(s => s.status === 'operational'))
            found.status = 'operational'
          else
            found.status = 'idle'
          out.push(found)
          continue
        }

        out.push({
          id: Math.random().toString(),
          index: i,
          client: '-',
          mode: '-',
          version: '-',
          server: '-',
          status: 'slot'
        })
      }
      return out
    },
    shardsStocked(): any[] {
      const out = []
      // eslint-disable-next-line no-labels
      outer:
      for (let i = 0; i < this.workerCount * this.shardsPerWorker; i++) {
        for (const worker of this.workers) {
          const found = worker.shards.filter((s: any) => (!!s)).find((s: any) => (s.id === i))
          if (found) {
            found.worker = worker
            out.push(found)
            // eslint-disable-next-line no-labels
            continue outer
          }
        }

        out.push({
          id: i,
          worker: {},
          status: 'slot'
        })
      }
      return out
    }
  },
  mounted() {
    this.socketVisualUpdater = setInterval((v) => {
      v.socketVisualState++

      if (Math.abs(v.socketVisualState) >= 4)
        v.socketVisualState *= -1
    }, 300, this)

    this.socket = io(`${window.location.protocol.includes('s') ? 'wss' : 'ws'}://${API.API_HOST().split('://')[1]}`, {
      query: {
        type: 'dashboard'
      },
      path: '/internal/socket',
      auth: {
        token: API.getAuthToken()
      }
    })

    this.socket.on('connect', () => {
      this.workers = []
    })

    this.socket.on('admin worker count', (count) => {
      this.workerCount = count
    })

    this.socket.on('admin worker shards', (count) => {
      this.shardsPerWorker = count
    })

    this.socket.on('admin worker add', (shard) => {
      console.log(shard)
      this.workers.push(shard)
    })

    this.socket.on('admin worker remove', (shard) => {
      this.workers.splice(this.workers.findIndex(check => check.id === shard.id), 1)
    })

    this.socket.on('admin worker update', (shard) => {
      const target = this.workers.find(check => check.id === shard.id)
      if (target && shard)
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
      // if (this.selected.includes(shard.id))
      //   this.selected.splice(this.selected.indexOf(shard.id), 1)
      // else
      //   this.selected.push(shard.id)
    },
    action(cmd: string) {
      // this.socket?.emit('action', {
      //   shards: this.selected,
      //   command: {
      //     id: cmd
      //   }
      // })
    }
  },
  head() {
    return {
      title: 'FreeStuff Admin Panel'
    }
  },
  fetchOnServer: false
})
</script>

<style scoped lang="scss">
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
