<template>
  <div :class="{ container: true, 'loading-animation-queued': !loadingFinished }">
    <h1>Content Moderation <img v-tippy="{delay: [500, 0]}" src="~/assets/icons/reload.svg" alt="Reload" content="Refresh Data" @click.prevent="$fetch()"></h1>
    <div class="actions">
      <button generic small class="b1" @click="action('new_url')">
        New from URL
      </button>
      <button generic small class="b2" @click="action('new_scratch')">
        New from Scratch
      </button>
      <button generic small class="b3" @click="action('scrape_store')">
        Scrape Store
      </button>
    </div>
    <h2>Games:</h2>
    <div v-if="games.length" class="games">
      <GameListElement
        v-for="(game, i) in games"
        :key="game._id"
        :status="game.status"
        :name="game.info.title"
        :store="lang[game.info.store]"
        :type="lang[game.info.type]"
        :gid="game._id + ''"
        :responsible="lang[game.responsible] || game.responsible || 'System'"
        :banner="game.info.thumbnail"
        :ia-margin="i"
      />
    </div>
    <span v-else minor>Loading...</span>
    <div center>
      <button generic dark @click="loadMore()">
        Load more ...
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Swal from 'sweetalert2'
import API from '../../lib/api'
import GameListElement from '~/components/GameListElement.vue'


export default Vue.extend({
  components: {
    GameListElement
  },
  transition: 'slide-down',
  async fetch() {
    const { data } = await API.getContentList(0, 20)
    this.games = data

    // eslint-disable-next-line nuxt/no-timing-in-fetch-data
    setTimeout(() => (this.loadingFinished = true), 10)
  },
  data() {
    return {
      lang: this.$store.state.lang,
      games: [] as any[],
      selected: [] as string[],
      loadingFinished: false
    }
  },
  methods: {
    toggleSelect(id: string) {
      console.log(id)
      if (this.selected.includes(id)) this.selected.splice(this.selected.indexOf(id))
      else this.selected.push(id)
    },
    async action(type: string) {
      if (type === 'new_url') {
        const { value: url } = await Swal.fire({
          input: 'url',
          inputPlaceholder: 'Enter the URL'
        })

        if (url) {
          Swal.fire({
            title: 'Fetching Information!',
            html: 'Please hold on...',
            timerProgressBar: true
          })
          Swal.showLoading()

          const game = await API.postNewUrl(url)
          if (game.data.error) {
            Swal.fire({
              title: game.data.error,
              icon: 'error'
            })
          } else if (game.data._id) {
            Swal.close()
            this.$router.replace(`/content/${game.data._id}`)
          } else {
            Swal.fire({
              title: 'Failed to fetch data.',
              icon: 'error'
            })
          }
        }
      }
      if (type === 'new_scratch') {
        const data = await Swal.fire({
          title: 'New Announcement?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3e9e71',
          confirmButtonText: 'Yea'
        })

        if (data.value) {
          const game = await API.postNewScratch()
          this.$router.replace(`/content/${game.data._id}`)
        }
      }
      if (type === 'scrape_store') {
        const { value: store } = await Swal.fire({
          title: 'Which store would you like to get scraped?',
          text: 'CURRENTLY BROKEN .... REEEE',
          input: 'select',
          inputOptions: {
            steam: 'Steam',
            epic: 'Epic Games Store'
          },
          inputPlaceholder: 'Select a store',
          showCancelButton: true
        })

        if (store) {
          Swal.fire({
            title: `Scraping ${this.lang[store]}...`,
            html: 'Please hold on...',
            timerProgressBar: true
          })
          Swal.showLoading()

          const res = await API.postScrapeStore(store)
          if (res.data.success) {
            Swal.close()
            Swal.fire({
              title: 'Success!',
              text: 'Found something, take a look!',
              icon: 'success'
            })
            this.$fetch()
          } else {
            Swal.fire({
              title: 'Failed to fetch data.',
              text: `Here's why:\n${res.data.error}`,
              icon: 'error'
            })
          }
        }
      }
    },
    async loadMore() {
      if (!this.games) this.$fetch()
      const { data } = await API.getContentList(this.games.length, 20)
      this.games.push(...data)
    }
  },
  head() {
    return {
      title: 'FreeStuff CMS'
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

  &[minor] { color: #888888; }
}

.actions {
  margin-top: $box-padding;

  button {
    margin-right: 5pt;
    --bg: #{$bg-darker};
    --bg-hov: #{$success-major};
    --color: #{$color-major};
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

</style>
