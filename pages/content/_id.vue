<template>
  <div v-if="game" class="container">
    <h1 v-text="game.info.title || ':)'" />
    <div v-if="game.status == 'approved'" class="page">
      <h2>Info:</h2>
      <span v-text="`Approved by ${lang[game.responsible]}`" /><br>
      <span v-text="`Published on ${new Date(game.published*1000).toLocaleString()}`" />
      <h2>Discord:</h2>
      <span v-text="`Announced in ${game.analytics.discord.reach} guilds`" /><br>
      <span v-text="`Estimated views: ${game.analytics.discord.reach * 10}`" /><br>
      <span v-text="`Estimated clicks: ${game.analytics.discord.reach * 2}`" />
      <h2>Telegram:</h2>
      <span v-text="`Announced in ${game.analytics.telegram.reach.users} direct messages`" /><br>
      <span v-text="`Announced in ${game.analytics.telegram.reach.groups} regular groups`" /><br>
      <span v-text="`Announced in ${game.analytics.telegram.reach.supergroups} super groups`" /><br>
      <span v-text="`Announced in ${game.analytics.telegram.reach.channels} channels`" /><br>
      <span v-text="`Audience: ${game.analytics.telegram.reach.users + game.analytics.telegram.reach.groupUsers + game.analytics.telegram.reach.channelUsers} users`" /><br>
      <h2>More:</h2>
      <a v-if="game.info.store == 'steam'" class="pretty block" href="https://analytics.google.com/analytics/web/#/report-home/a112300017w246269144p228798554" target="_blank">Audience Engagement Analytics (Google)</a>
      <span>More statistics and insights will come at some point</span>
      <h2>Game Data:</h2>
      <span v-text="`Type: ${game.info.type}`" /><br>
      <span v-text="`Flags: ${gameinfotrash ? 'Not trash' : 'Trash'}, ${gameinfothirdparty & 0b10 == 0 ? 'First Party' : 'Third Party'}`" /><br>
      <span v-text="`Store: ${game.info.store}`" /><br>
      <span v-text="`Until: ${new Date(gameinfountil).toLocaleString()}`" /><br>
      <span v-text="`Price: ${game.info.org_price.euro}€ / ${game.info.org_price.dollar}$`" /><br>
      <!-- <div class="buttons">
        <button
          generic
          small
          class="b2"
          @click="alert('todo')"
        >
          End early
        </button>
      </div> -->
    </div>
    <div v-else-if="game.status == 'pending'" class="page">
      <label for="gi-name">Game Name</label>
      <input id="gi-name" v-model="game.info.title" type="text" :error="!/^.*$/.test(game.info.title) || game.info.title.toLowerCase() == 'unknown'" placeholder="you yeed your last haw">
      <label for="gi-tn">Thumbnail</label>
      <input id="gi-tn" v-model="game.info.thumbnail" type="url" :error="!/https?:\/\/.+\..+\/.+\..+/.test(game.info.thumbnail)" placeholder="ricky rolly">
      <div class="preview">
        <img :src="game.info.thumbnail">
        <img :src="thumbnailerPreview">
      </div>
      <label for="gi-url">Url</label>
      <input
        id="gi-url"
        v-model="game.info.org_url"
        type="url"
        :error="!/https?:\/\/.+\..+\/.+/.test(game.info.org_url)"
        :disabled="!game.uuid.startsWith('custom:')"
        placeholder="doe?"
      >
      <label for="gi-type">Type</label>
      <select id="gi-type" v-model="game.info.type" select :error="game.info.type != 'free'">
        <option v-for="gtype of types" :key="gtype" :value="gtype" v-text="lang[gtype]" />
      </select>
      <label>Original Price</label>
      <div class="splitbox">
        <div class="el1">
          <input v-model="game.info.org_price.euro" type="number" placeholder="0.00" min="0" step="0.01">
          <span>&euro;</span>
        </div>
        <div class="el2">
          <input v-model="game.info.org_price.dollar" type="number" placeholder="0.00" min="0" step="0.01">
          <span>&dollar;</span>
        </div>
      </div>
      <label v-if="game.info.type != 'free' && game.info.type != 'weekend'">New Price</label>
      <div v-if="game.info.type != 'free' && game.info.type != 'weekend'" class="splitbox">
        <div class="el1">
          <input v-model="game.info.price.euro" type="number" placeholder="0.00" min="0" step="0.01">
          <span>&euro;</span>
        </div>
        <div class="el2">
          <input v-model="game.info.price.dollar" type="number" placeholder="0.00" min="0" step="0.01">
          <span>&dollar;</span>
        </div>
      </div>
      <label for="gi-until">Free until</label>
      <div class="toggle-cont">
        <div class="toggle" :on="gameinfonodate" @click="gameinfonodate = !gameinfonodate">
          Don't display
        </div>
        <input v-model="gameinfountil" type="datetime-local" :disabled="gameinfonodate" :min="new Date().toISOString().split('T')[0]+'T00:00'">
      </div>
      <div class="splitbox">
        <div class="el1 noflex">
          <label for="gi-store">Store</label>
          <select id="gi-store" v-model="game.info.store" select>
            <option v-for="store of stores" :key="store" :value="store" v-text="lang[store]" />
          </select>
        </div>
        <div class="el2 noflex">
          <label for="gi-kind">Kind</label>
          <select id="gi-kind" v-model="game.info.kind" select :error="game.info.kind != 'game'">
            <option v-for="kind of productKinds" :key="kind" :value="kind" v-text="lang[kind]" />
          </select>
        </div>
      </div>
      <label for="gi-rating">Rating</label>
      <div class="splitbox">
        <div class="el1">
          <input
            id="gi-rating"
            v-model="gameinforating"
            type="number"
            placeholder="50"
            min="0"
            max="100"
            step="1"
          >
          <span>/100</span>
        </div>
      </div>
      <label for="gi-desc">Description</label>
      <input
        id="gi-desc"
        v-model="game.info.description"
        type="text"
        placeholder="This very cool game is very cool. Cool."
      >
      <label for="gi-tags">Tags</label>
      <input
        id="gi-tags"
        v-model="gameinfotags"
        type="text"
        :error="!/^(((\w|\d| |-)+,)*(\w|\d| |-)+)?$/.test(gameinfotags)"
        placeholder="Indie, Adventure, Action"
      >
      <label v-if="game.info.store == 'steam'" for="gi-ssid">Steam SubIds</label>
      <input
        v-if="game.info.store == 'steam'"
        id="gi-ssid"
        v-model="game.info.steamSubids"
        type="text"
        :error="!/^(([0-9]{4,8} )*[0-9]{4,8})?$/.test(game.info.steamSubids)"
        placeholder="12345 67890"
      >
      <label for="gi-trash">Flags</label>
      <div class="toggle-cont btn-only">
        <div class="toggle" :on="gameinfotrash" @click="gameinfotrash = !gameinfotrash">
          Trash Game
        </div>
        <div class="toggle" :on="gameinfothirdparty" @click="gameinfothirdparty = !gameinfothirdparty">
          Third Party Provider
        </div>
      </div>
      <div class="buttons">
        <button generic small class="b1" @click="cancel()">
          Cancel
        </button>
        <button generic small class="b2" @click="decline()">
          Decline
        </button>
        <button generic small class="b3" @click="save()">
          Save Changes
        </button>
        <button generic small class="b4" @click="approve()">
          Approve
        </button>
      </div>
    </div>
    <div v-else-if="game.status == 'declined'" class="page" :error="!/^.*$/.test(game.info.title)">
      <span v-text="`Declined by ${lang[game.responsible]} on ${new Date(game.published*1000).toLocaleString()}`" />
      <div class="buttons">
        <button
          v-if="isAdmin"
          generic
          small
          class="b2"
          @click="del()"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { GameData, GameFlag } from '../../backend/types'


interface InterfacedGameData extends GameData {
  trash: boolean;
  thirdparty: boolean;
}

const stores = [
  'steam',
  'epic',
  'humble',
  'gog',
  'origin',
  'uplay',
  'twitch',
  'itch',
  'discord',
  'apple',
  'google',
  'switch',
  'ps',
  'xbox',
  'other'
]

const types = [
  'free',
  'weekend',
  'discount',
  'ad',
  'unknown'
]

const productKinds = [
  'game',
  'dlc',
  'software',
  'art',
  'ost',
  'book',
  'other'
]

export default Vue.extend({
  components: {
  },
  transition: 'slide-down',
  data() {
    return {
      lang: this.$store.state.lang,
      stores,
      types,
      productKinds,
      thumbnailerPreview: '',
      game: null as InterfacedGameData | null,
      gameinfountil: '',
      gameinfonodate: false,
      gameinfotrash: false,
      gameinfothirdparty: false,
      gameinfotags: '',
      gameinforating: 0
    }
  },
  async fetch() {
    const { data } = await axios.get(`/data/game/${this.$route.params.id}`)
    this.game = data
    if (this.game) {
      if (this.game.info.until === 0) {
        this.gameinfountil = new Date().toISOString().split('T')[0] + 'T00:00'
        this.gameinfonodate = true
      } else {
        const d = new Date(this.game.info.until * 1000)
        this.gameinfountil = `${d.toISOString().split('T')[0]}T${(d.getHours() + '').padStart(2, '0')}:${(d.getMinutes() + '').padStart(2, '0')}`
      }
      this.gameinfotrash = !!(this.game.info.flags & GameFlag.TRASH)
      this.gameinfothirdparty = !!(this.game.info.flags & GameFlag.THIRDPARTY)
      this.gameinfotags = this.game.info.tags.join(', ') || ''
      this.gameinforating = ~~((this.game.info.rating || 0) * 100)
      this.updateThumbnailerPreview()
    }
  },
  head() {
    return {
      // @ts-ignore
      title: 'FreeStuff CMS'
    }
  },
  computed: {
    isAdmin() {
      return this.$store.getters['user/isAdmin']
    }
  },
  watch: {
    'game.info.thumbnail'(val: any) {
      this.updateThumbnailerPreview(val)
    }
  },
  methods: {
    cancel() {
      this.$router.replace('/content')
    },
    async decline() {
      const doIt = await Swal.fire({
        title: 'Are you sure you want to permanently decline this game?',
        text: 'Declining a game is the right choice when the bot found something that is not worth announcing or if the game was already announced not long ago. DO NOT DECLINE BECAUSE SOME OF THE INFORMATION FOUND IS INCORRECT. In that case, please correct the information and approve the game.',
        icon: 'error',
        showCancelButton: true,
        confirmButtonColor: '#d64955',
        confirmButtonText: 'Decline!'
      })
      if (doIt.value) {
        await axios.post('/content/decline', this.buildGameInfo())
        this.$fetch()
      }
    },
    async save() {
      await axios.post('/content/save', this.buildGameInfo())
      this.$fetch()
      await Swal.fire({
        title: 'Changes saved!',
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: '#3e9e71',
        confirmButtonText: 'Great!'
      })
    },
    async approve() { // eslint-disable-next-line camelcase
      const guilds = await axios.get(`/content/guildamount/${this.game?.info.store}/${this.game?.info.org_price.euro}/${this.game?.info.org_price.dollar}/${this.game?.trash}`)
      const doIt = document.querySelector('.page>*[error]')
        ? await Swal.fire({
          title: 'Are you sure the data is correct and the game is fitting?',
          text: `Clicking on "Approve" will irreversibly send an announcement to approximately ${guilds.data.amount} guilds. THERE ARE SOME FIELDS WITH INCORRECT VALUES, PLEASE DOUBLE CHECK THEM! Continue anyways?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#F39807',
          confirmButtonText: 'Approve!'
        })
        : await Swal.fire({
          title: 'Are you sure the data is correct and the game is fitting?',
          text: `Clicking on "Approve" will irreversibly send an announcement to approximately ${guilds.data.amount} guilds. Continue?`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3e9e71',
          confirmButtonText: 'Approve!'
        })
      if (doIt.value) {
        await axios.post('/content/approve', this.buildGameInfo())
        this.$fetch()
      }
    },
    async del() {
      const doIt = await Swal.fire({
        title: 'Delete?',
        text: 'Delete.',
        icon: 'error',
        showCancelButton: true,
        confirmButtonColor: '#d64955',
        confirmButtonText: 'Delete!'
      })
      if (doIt.value) {
        await axios.post('/content/delete', this.buildGameInfo())
        this.$fetch()
      }
    },
    buildGameInfo(): GameData {
      if (!this.game) return {} as GameData
      const game = JSON.parse(JSON.stringify(this.game))

      game.info.flags = 0
      if (this.gameinfotrash) game.info.flags |= GameFlag.TRASH
      if (this.gameinfothirdparty) game.info.flags |= GameFlag.THIRDPARTY

      if (this.gameinfonodate) {
        game.info.until = 0
      } else {
        const d = new Date(this.gameinfountil)
        game.info.until = d.getTime() / 1000
      }

      game.info.tags = this.gameinfotags.split(', ').map(t => t.trim()).filter(t => !!t)
      game.info.rating = (this.gameinforating || 0) / 100

      return game
    },
    async updateThumbnailerPreview(thumbnail?: string) {
      const thumb = encodeURIComponent(thumbnail || this.game?.info.thumbnail || '')
      const obj = await axios.get(`/content/thumbnails/${this.game?._id}/${thumb}`)
      this.thumbnailerPreview = obj.data.full
    }
  },
  fetchOnServer: false
})
</script>

<style scoped lang="scss">
@import '~/assets/style/all.scss';

.page {
  padding-top: $box-padding;
}

span {
  color: white;
  font-family: $font-regular;
  font-size: 11pt;

  &[minor] { color: #888888; }
}

label {
  display: block;
  font-size: 12pt;
  color: $color-sub;
  font-family: $font-major;
}

input, .preview, select {
  display: block;
  margin: 5px 0 15px 0;
  padding: 7pt 12pt;
  border: none;
  border-radius: 2pt;
  background-color: $bg-bright;
  color: $color-regular;
  font-family: $font-regular;
  font-size: 14pt;
  width: calc(100% - 24pt);

  &[select] { width: 100%; }
  &[error] { outline: 2px solid #aa223399; }

  &:disabled {
    opacity: .5;
    color: $color-sub;
    cursor: not-allowed;
  }
}

.preview {
  height: 150px;
  margin-top: -10px;
  display: flex;
  justify-content: space-evenly;

  img {
    position: relative;
    height: calc(100% - 4px);
    border: 2px solid #00000022;
  }
}

.splitbox {
  display: flex;

  & > * {
    width: 50%;
    align-items: baseline;

    &:not(.noflex) { display: flex; }
  }

  span {
    font-size: 14pt;
    margin-left: 5px;
  }

  .el1 {
    margin-right: 30px;
  }
}

.buttons {
  margin-top: 50px;

  button {
    margin-right: 5pt;
    --bg: #{$bg-darker};
    --color: #{$color-major};

    &.b1 { --bg-hov: #{$bg-bright}; }
    &.b2 { --bg-hov: #{$warning-major}; }
    &.b3 { --bg-hov: #{$info-major}; }
    &.b4 { --bg-hov: #{$success-major}; }
  }
}

</style>